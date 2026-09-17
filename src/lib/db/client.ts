import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * One driver, two targets:
 *
 *  - No `TURSO_DATABASE_URL` set → a local libSQL file (`local.db`). This is
 *    what `npm run dev` uses with zero setup — no account, nothing to sign
 *    up for, matches the "clone and go" spirit of the rest of this kit.
 *  - `TURSO_DATABASE_URL` set → a hosted Turso database over HTTP, which is
 *    what makes this work on serverless (Vercel/Netlify): the DB survives
 *    cold starts and is reachable from any region, unlike a file on a
 *    function's ephemeral disk.
 *
 * Same SQL dialect, same schema, same queries either way — switching
 * environments is an env var, not a code change.
 */
const url = process.env.TURSO_DATABASE_URL || "file:./local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

if (url.startsWith("libsql:") && !authToken) {
  throw new Error(
    "TURSO_DATABASE_URL is set to a remote libsql:// URL but TURSO_AUTH_TOKEN is missing. " +
      "Get both from `turso db show <name>` / `turso db tokens create <name>`.",
  );
}

const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });
export type Database = typeof db;
export { schema };
