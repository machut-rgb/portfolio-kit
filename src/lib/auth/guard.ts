import "server-only";
import { redirect } from "next/navigation";
import { authConfig } from "./config";
import { getSession, type SessionUser } from "./session";

/**
 * Call at the top of any admin server component or Server Action.
 * Route-level protection (proxy.ts) is defense in depth, not the real
 * gate — every action re-checks here so a misconfigured route can't
 * silently skip auth.
 */
export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect(`${authConfig.adminPath}/login`);
  }
  return session;
}
