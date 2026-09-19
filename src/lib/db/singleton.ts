import "server-only";
import type { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import { db } from "./client";

/**
 * Several tables hold exactly one row: profile, about, contact,
 * site_settings, theme_settings. They are keyed on a fixed id.
 */
export const SINGLETON_ID = 1;

type SingletonTable = SQLiteTable & { id: SQLiteColumn };

/**
 * Writes the one row of a singleton table, creating it if it is missing.
 *
 * Replaces `UPDATE ... WHERE id = 1`, which reports success while changing
 * nothing when the row does not exist. That combination was silent data
 * loss: the read path falls back to the committed config files when a
 * settings table is empty, so the admin rendered normally and every save
 * appeared to work while writing nothing.
 *
 * The upsert makes a zero-row write impossible. The assertion afterwards is
 * a guard against a future driver or dialect change quietly reintroducing
 * it, not something expected to fire.
 */
export async function saveSingleton<T extends SingletonTable>(
  table: T,
  values: Omit<T["$inferInsert"], "id">,
): Promise<void> {
  // Drizzle cannot infer the insert and update shapes through the generic
  // table parameter, so the row is asserted once here rather than at each
  // of the five call sites. `values` is still checked against the table's
  // own insert type by the signature above.
  const row = { ...values, id: SINGLETON_ID } as T["$inferInsert"];
  const updates = values as Record<string, unknown>;

  const result = await db
    .insert(table)
    .values(row)
    .onConflictDoUpdate({ target: table.id, set: updates });

  if (result.rowsAffected === 0) {
    throw new Error(
      `Saving the singleton row of "${String(table)}" affected no rows. The write was not persisted.`,
    );
  }
}
