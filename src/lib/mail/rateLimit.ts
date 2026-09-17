/**
 * In-memory sliding-window limiter. Good enough for a personal portfolio's
 * contact form on a single instance; swap for Upstash/Redis if you deploy
 * this behind multiple serverless instances and need it to be exact.
 */
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const limit = Number(process.env.CONTACT_RATE_LIMIT || 5);
  const windowSeconds = Number(process.env.CONTACT_RATE_WINDOW_SECONDS || 3600);
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  const existing = (hits.get(key) || []).filter((ts) => ts > windowStart);
  if (existing.length >= limit) {
    const retryAfterSeconds = Math.ceil((existing[0]! + windowSeconds * 1000 - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }
  existing.push(now);
  hits.set(key, existing);
  return { allowed: true };
}
