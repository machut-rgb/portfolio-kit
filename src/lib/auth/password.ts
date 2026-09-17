import * as argon2 from "argon2";

/**
 * argon2id — the OWASP-recommended variant (resistant to both GPU-cracking
 * and side-channel attacks, unlike argon2i/argon2d alone). Parameters follow
 * OWASP's current baseline for interactive login; bump `memoryCost` if the
 * deploy target has RAM to spare, since higher memory cost is the main lever
 * against GPU-parallel cracking.
 */
const options: argon2.HashOptions = {
  type: argon2.argon2id,
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

export function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, options);
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    // Malformed hash (shouldn't happen with our own writes) — fail closed.
    return false;
  }
}
