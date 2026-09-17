import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "../src/lib/db/client";

/**
 * Applies the SQL files in `/drizzle` to whatever database the current env
 * points at. Run this against production after `db:generate` produces a new
 * migration — `db:push` (used in dev) is fine for iterating locally but
 * skips the migration history table, so don't use it against a real
 * deployment.
 */
async function main() {
  console.log("Applying migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Migrations applied.");
}

main().catch((err) => {
  console.error("✗ Migration failed:", err);
  process.exit(1);
});
