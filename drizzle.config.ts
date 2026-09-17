import { defineConfig } from "drizzle-kit";

/**
 * Points at the same local file used by `src/lib/db/client.ts` in dev, so
 * `npm run db:generate` / `db:push` work against the database you're
 * actually running without any extra env setup. Set TURSO_DATABASE_URL +
 * TURSO_AUTH_TOKEN to point these commands at a Turso database instead
 * (e.g. to run a migration against production).
 */
export default defineConfig({
  dialect: "turso",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "file:./local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
