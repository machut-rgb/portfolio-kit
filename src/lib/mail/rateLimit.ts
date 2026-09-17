import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { rateLimits } from "@/lib/db/schema";

/**
 * Fixed-window limiter backed by the database.
 *
 * Deliberately not an in-memory Map: this app targets serverless, where a
 * process-local counter resets on every cold start and isn't shared across
 * concurrent instances — it would look like protection while providing
 * almost none. The extra round-trip is the cost of it actually working.
 *
 * Fails open: if the limiter itself errors, a legitimate visitor should
 * still be able to send a message. The honeypot and validation still apply.
 */
export async function checkRateLimit(
  key: string,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const limit = Number(process.env.CONTACT_RATE_LIMIT || 5);
  const windowSeconds = Number(process.env.CONTACT_RATE_WINDOW_SECONDS || 3600);
  const windowMs = windowSeconds * 1000;
  const now = Date.now();

  try {
    const existing = await db.query.rateLimits.findFirst({ where: eq(rateLimits.key, key) });

    if (!existing || now - existing.windowStart.getTime() >= windowMs) {
      await db
        .insert(rateLimits)
        .values({ key, hits: 1, windowStart: new Date(now) })
        .onConflictDoUpdate({
          target: rateLimits.key,
          set: { hits: 1, windowStart: new Date(now) },
        });
      return { allowed: true };
    }

    if (existing.hits >= limit) {
      const retryAfterSeconds = Math.ceil((existing.windowStart.getTime() + windowMs - now) / 1000);
      return { allowed: false, retryAfterSeconds };
    }

    await db.update(rateLimits).set({ hits: existing.hits + 1 }).where(eq(rateLimits.key, key));
    return { allowed: true };
  } catch (err) {
    console.error("[rateLimit] check failed, allowing request:", err);
    return { allowed: true };
  }
}
