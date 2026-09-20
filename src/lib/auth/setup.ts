import "server-only";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

/**
 * Whether the site has an owner yet.
 *
 * This is the security boundary for the setup wizard: the account-creation
 * step is reachable without a session, so it must be impossible once an
 * account exists. Every entry point checks this, not just the UI.
 */
export async function hasAdminAccount(): Promise<boolean> {
  return (await db.$count(users)) > 0;
}
