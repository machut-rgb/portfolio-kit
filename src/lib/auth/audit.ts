import "server-only";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { auditLog } from "@/lib/db/schema";
import { generateId } from "./tokens";

export async function logAudit(input: {
  actorId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  const h = await headers();
  const raw = h.get("x-forwarded-for") || h.get("x-real-ip") || "";
  const ip = raw.split(",")[0]?.trim();
  const ipHint = ip ? ip.split(/[.:]/).slice(0, 2).join(".") + ".*" : undefined;

  await db.insert(auditLog).values({
    id: generateId(),
    actorId: input.actorId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    meta: input.meta,
    ipHint,
  });
}
