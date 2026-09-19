import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "../src/lib/db/client";

/**
 * Applies the SQL files in `/drizzle` to whatever database the current env
 * points at. Use this against production; `db:push` is for iterating locally
 * and deliberately records nothing.
 */
async function main() {
  console.log("Applying migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Migrations applied.");
}

/**
 * A database created by `db:push` has a schema but no `__drizzle_migrations`
 * table, so the migrator starts from the first migration and immediately hits
 * a table that already exists. The raw SQLite error says nothing about what to
 * do next, so translate it into the two commands that fix it.
 */
function isUntrackedExistingSchema(error: unknown): boolean {
  const message = error instanceof Error ? String(error.message ?? "") : String(error);
  const cause = error instanceof Error && error.cause ? String((error.cause as Error).message ?? "") : "";
  return /already exists/i.test(`${message} ${cause}`);
}

main().catch((err) => {
  if (isUntrackedExistingSchema(err)) {
    console.error(
      [
        "✗ This database has tables but no migration history.",
        "",
        "  That happens when it was created with `npm run db:push`, which applies a",
        "  schema without recording it. Adopt it into migration tracking, then retry:",
        "",
        "    npm run db:baseline",
        "    npm run db:migrate",
        "",
        "  Nothing was changed.",
      ].join("\n"),
    );
    process.exit(1);
  }

  console.error("✗ Migration failed:", err);
  process.exit(1);
});
