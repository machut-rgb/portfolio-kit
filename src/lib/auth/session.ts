import "server-only";
import { cookies, headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import { authConfig } from "./config";
import { generateId, generateSessionToken, hashToken } from "./tokens";

export interface SessionUser {
  id: string;
  email: string;
}

export async function createSession(userId: string): Promise<void> {
  const token = generateSessionToken();
  const now = Date.now();
  const expiresAt = new Date(now + authConfig.sessionTtlMs);
  const h = await headers();

  await db.insert(sessions).values({
    id: hashToken(token),
    userId,
    expiresAt,
    lastSeenAt: new Date(now),
    userAgent: h.get("user-agent")?.slice(0, 200),
    ipHint: firstForwardedIp(h.get("x-forwarded-for") || h.get("x-real-ip")),
  });

  const jar = await cookies();
  jar.set(authConfig.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

function firstForwardedIp(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const ip = raw.split(",")[0]?.trim();
  if (!ip) return undefined;
  return ip.split(/[.:]/).slice(0, 2).join(".") + ".*";
}

/**
 * Validates the session cookie against the DB. Renews the DB row (and the
 * cookie) when more than half the TTL has elapsed, so an active owner is
 * never bounced mid-session — an idle one still expires at the original TTL.
 */
export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(authConfig.cookieName)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const row = await db.query.sessions.findFirst({
    where: eq(sessions.id, tokenHash),
    with: { user: true },
  });

  if (!row || row.expiresAt.getTime() < Date.now()) {
    if (row) await destroySession(token);
    return null;
  }

  const now = Date.now();
  const halfLife = authConfig.sessionTtlMs / 2;
  if (row.expiresAt.getTime() - now < halfLife) {
    const newExpiry = new Date(now + authConfig.sessionTtlMs);
    await db
      .update(sessions)
      .set({ expiresAt: newExpiry, lastSeenAt: new Date(now) })
      .where(eq(sessions.id, tokenHash));
    jar.set(authConfig.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: newExpiry,
    });
  } else {
    await db.update(sessions).set({ lastSeenAt: new Date(now) }).where(eq(sessions.id, tokenHash));
  }

  return { id: row.user.id, email: row.user.email };
}

export async function destroySession(token?: string): Promise<void> {
  const jar = await cookies();
  const active = token ?? jar.get(authConfig.cookieName)?.value;
  if (active) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(active)));
  }
  jar.delete(authConfig.cookieName);
}

export async function destroyAllSessionsForUser(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function listSessionsForUser(userId: string) {
  return db.query.sessions.findMany({ where: eq(sessions.userId, userId) });
}

export { generateId };
