import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { users, sessions } from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/auth/password";
import { generateId } from "../src/lib/auth/tokens";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 10;

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

/** Masks input with `*` as it's typed. Falls back to plain prompt if stdin isn't a TTY (e.g. piped input in CI). */
async function promptPassword(question: string): Promise<string> {
  if (!stdin.isTTY) return prompt(question);

  return new Promise((resolve) => {
    stdout.write(question);
    let value = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (char: string) => {
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        stdout.write("\n");
        resolve(value);
        return;
      }
      if (char === "\u0003") process.exit(130); // Ctrl+C
      if (char === "\u007f" || char === "\b") {
        value = value.slice(0, -1);
        stdout.write("\b \b");
        return;
      }
      value += char;
      stdout.write("*");
    };

    stdin.on("data", onData);
  });
}

function validatePassword(pw: string): string | null {
  if (pw.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return null;
}

async function createAdmin() {
  const email = (process.env.ADMIN_EMAIL || (await prompt("Admin email: "))).trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    console.error("✗ That doesn't look like a valid email.");
    process.exit(1);
  }

  const password = process.env.ADMIN_PASSWORD || (await promptPassword("Admin password: "));
  const passwordError = validatePassword(password);
  if (passwordError) {
    console.error(`✗ ${passwordError}`);
    process.exit(1);
  }

  if (!process.env.ADMIN_PASSWORD) {
    const confirm = await promptPassword("Confirm password: ");
    if (confirm !== password) {
      console.error("✗ Passwords didn't match.");
      process.exit(1);
    }
  }

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({ id: generateId(), email, passwordHash });
  console.log(`✓ Admin account created for ${email}.`);
}

async function resetPassword() {
  const email = (process.env.ADMIN_EMAIL || (await prompt("Admin email to reset: "))).trim().toLowerCase();
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!existing) {
    console.error(`✗ No admin account found for ${email}.`);
    process.exit(1);
  }

  const password = process.env.ADMIN_PASSWORD || (await promptPassword("New password: "));
  const passwordError = validatePassword(password);
  if (passwordError) {
    console.error(`✗ ${passwordError}`);
    process.exit(1);
  }

  if (!process.env.ADMIN_PASSWORD) {
    const confirm = await promptPassword("Confirm new password: ");
    if (confirm !== password) {
      console.error("✗ Passwords didn't match.");
      process.exit(1);
    }
  }

  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({ passwordHash, failedAttempts: 0, lockedUntil: null })
    .where(eq(users.id, existing.id));
  // Password reset invalidates every existing session — including one an
  // attacker may already hold if that's why the password is being reset.
  await db.delete(sessions).where(eq(sessions.userId, existing.id));
  console.log(`✓ Password reset for ${email}. All active sessions were signed out.`);
}

async function main() {
  const resetMode = process.argv.includes("--reset-password");

  if (resetMode) {
    await resetPassword();
    return;
  }

  const existingCount = await db.$count(users);
  if (existingCount > 0) {
    const existing = await db.query.users.findFirst();
    console.error(
      `✗ An admin account already exists (${existing?.email}). This is a single-owner panel, so a second ` +
        `account isn't created automatically.\n  To change the password instead, run:\n  npm run create-admin -- --reset-password`,
    );
    process.exit(1);
  }

  await createAdmin();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
