import { randomBytes, createHash, randomUUID } from "node:crypto";

/** 256-bit random token, base64url-encoded — goes in the cookie, never stored raw. */
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** What we actually store: a DB leak yields hashes, not usable session tokens. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateId(): string {
  return randomUUID();
}
