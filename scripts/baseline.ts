import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { createClient } from "@libsql/client";

/**
 * Adopts an existing database into migration tracking.
 *
 * `db:push` applies a schema without recording anything, so a database
 * created that way has no `__drizzle_migrations` table. Running `db:migrate`
 * against it then tries to create tables that already exist and fails on the
 * first statement.
 *
 * This stamps the migrations whose tables are already present as applied, so
 * `db:migrate` can pick up from there. It only reads the schema and inserts
 * journal rows; it never creates, alters or drops a table.
 */
const MIGRATIONS_DIR = "./drizzle";

interface JournalEntry {
  idx: number;
  tag: string;
  when: number;
}

function tablesCreatedBy(sql: string): string[] {
  return [...sql.matchAll(/CREATE TABLE `([^`]+)`/g)].map((match) => match[1]!);
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL?.trim() || "file:./local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim() || undefined;
  const client = createClient({ url, authToken });

  const journalPath = join(MIGRATIONS_DIR, "meta", "_journal.json");
  const journal = JSON.parse(readFileSync(journalPath, "utf8")) as { entries: JournalEntry[] };
  if (journal.entries.length === 0) {
    console.log("No migrations to baseline.");
    return;
  }

  const existingTables = new Set(
    (await client.execute("SELECT name FROM sqlite_master WHERE type='table'")).rows.map((row) =>
      String(row.name),
    ),
  );

  if (existingTables.size === 0) {
    console.log("This database is empty. Run `npm run db:migrate` instead; there is nothing to baseline.");
    return;
  }

  // A failed `db:migrate` creates this table before its first statement
  // fails, so its mere presence does not mean the database is tracked. Only
  // an actual recorded migration does.
  if (existingTables.has("__drizzle_migrations")) {
    const applied = Number((await client.execute("SELECT COUNT(*) AS n FROM __drizzle_migrations")).rows[0]!.n);
    if (applied > 0) {
      console.log(
        `This database already tracks migrations (${applied} applied). Nothing to baseline; run \`npm run db:migrate\`.`,
      );
      return;
    }
  }

  await client.execute(
    "CREATE TABLE IF NOT EXISTS __drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at numeric)",
  );

  const files = readdirSync(MIGRATIONS_DIR).filter((name) => name.endsWith(".sql"));
  let stamped = 0;

  for (const entry of journal.entries) {
    const file = files.find((name) => name.startsWith(entry.tag));
    if (!file) {
      console.warn(`  skipping ${entry.tag}: no matching .sql file`);
      break;
    }

    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    const tables = tablesCreatedBy(sql);
    const alreadyPresent = tables.length > 0 && tables.every((table) => existingTables.has(table));

    if (!alreadyPresent) {
      const missing = tables.filter((table) => !existingTables.has(table));
      console.log(`  ${entry.tag}: not applied yet (missing ${missing.join(", ") || "unknown"}) — leaving for db:migrate`);
      break;
    }

    const hash = createHash("sha256").update(sql).digest("hex");
    await client.execute({
      sql: "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)",
      args: [hash, entry.when],
    });
    console.log(`  ${entry.tag}: marked as applied`);
    stamped += 1;
  }

  console.log(
    stamped > 0
      ? `\n✓ Baselined ${stamped} migration(s). Now run \`npm run db:migrate\` to apply the rest.`
      : "\nNothing was baselined.",
  );
}

main().catch((err) => {
  console.error("✗ Baseline failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
