import { defineConfig } from "drizzle-kit";

/**
 * Points at the same database `src/lib/db/client.ts` uses, so the db:* scripts
 * always target whatever you're actually running. Set TURSO_DATABASE_URL and
 * TURSO_AUTH_TOKEN to run these against a hosted Turso database instead
 * (e.g. migrating production).
 *
 * `?.trim() || undefined` is load-bearing: copying .env.example sets these to
 * EMPTY STRINGS, which is not the same as unset. drizzle-kit's turso dialect
 * rejects an empty authToken with a confusing "Please provide required params"
 * error, so empty is normalised to undefined and the key is omitted entirely
 * for local file databases.
 */
const url = process.env.TURSO_DATABASE_URL?.trim() || "file:./local.db";
const authToken = process.env.TURSO_AUTH_TOKEN?.trim() || undefined;

export default defineConfig({
  dialect: "turso",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: authToken ? { url, authToken } : { url },
});
