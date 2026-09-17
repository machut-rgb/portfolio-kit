import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { authConfig } from "./config";
import { verifyPassword } from "./password";
import { createSession } from "./session";
import { logAudit } from "./audit";

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: "invalid_credentials" }
  | { ok: false; reason: "locked"; retryAfterSeconds: number };

/**
 * Lockout state lives on the `users` row, not in memory — a serverless
 * function's in-process counters reset on every cold start and don't share
 * across concurrent instances, which would make an in-memory limiter here
 * silently useless. The DB round-trip is the point.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.query.users.findFirst({ where: eq(users.email, normalizedEmail) });

  // Constant-shape response whether or not the account exists, so a caller
  // can't enumerate valid emails from timing or error message differences.
  // This is a real argon2id hash of an unrelated fixed string — verifying
  // against it costs the same memory-hard computation as a real check.
  const dummyHash =
    "$argon2id$v=19$m=19456,p=1,t=2$i+X2o03Jbnq5KXOI0ghHAg$8hJIJyFuCFrEGvoJADgeG/1U4henglKTDz+E/zeYNCw";

  if (user?.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    await logAudit({ action: "login_blocked", meta: { email: normalizedEmail } });
    return { ok: false, reason: "locked", retryAfterSeconds: Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000) };
  }

  const valid = await verifyPassword(user?.passwordHash ?? dummyHash, password);

  if (!user || !valid) {
    if (user) await registerFailedAttempt(user.id, user.failedAttempts);
    await logAudit({ action: "login_failed", meta: { email: normalizedEmail } });
    return { ok: false, reason: "invalid_credentials" };
  }

  await db.update(users).set({ failedAttempts: 0, lockedUntil: null }).where(eq(users.id, user.id));
  await createSession(user.id);
  await logAudit({ actorId: user.id, action: "login" });
  return { ok: true };
}

async function registerFailedAttempt(userId: string, currentAttempts: number): Promise<void> {
  const attempts = currentAttempts + 1;
  const lockedUntil = attempts >= authConfig.maxLoginAttempts ? new Date(Date.now() + authConfig.lockoutMs) : null;
  await db.update(users).set({ failedAttempts: attempts, lockedUntil }).where(eq(users.id, userId));
}
