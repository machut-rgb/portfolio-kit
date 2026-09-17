import "server-only";
import { updateTag } from "next/cache";
import { requireSession } from "@/lib/auth/guard";
import { logAudit } from "@/lib/auth/audit";

export interface MutationAudit {
  entityType?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
}

/**
 * Every content-mutating Server Action goes through this. Three things,
 * always, in order:
 *
 *  1. Re-check the session — the `(dashboard)` layout already gates the
 *     page, but an action is reachable independently of how the page
 *     rendered, so it re-verifies rather than trusting that gate alone.
 *  2. Run the mutation.
 *  3. Audit it and invalidate the `"content"` cache tag.
 *
 * Uses `updateTag`, not `revalidateTag` — the latter's stale-while-
 * revalidate semantics mean the very next request (including the admin's
 * own, right after hitting save) can still get the *old* data while a
 * background refresh runs. `updateTag` only works from a Server Action,
 * but that's all every content mutation in this codebase is, and it's what
 * gives read-your-own-writes: expires the tag immediately, so the admin
 * sees their change on the next request, not "eventually."
 */
export async function withAdminMutation<T>(
  action: string,
  fn: (actorId: string) => Promise<T>,
  audit?: MutationAudit,
): Promise<T> {
  const session = await requireSession();
  const result = await fn(session.id);
  await logAudit({
    actorId: session.id,
    action,
    entityType: audit?.entityType,
    entityId: audit?.entityId,
    meta: audit?.meta,
  });
  updateTag("content");
  return result;
}
