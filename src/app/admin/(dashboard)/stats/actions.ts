"use server";

import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { stats } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { generateId } from "@/lib/auth/tokens";
import { adminHref } from "@/lib/auth/config";
import { parseLocalized, parseString } from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

function readFields(formData: FormData) {
  return {
    value: parseString(formData, "value"),
    label: parseLocalized(formData, "label"),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.value) return "Add the figure to display, for example 8+ or M.Sc.";
  return null;
}

export async function createStatAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  try {
    await withAdminMutation(
      "stat.create",
      async () => {
        const [{ maxPosition } = { maxPosition: -1 }] = await db
          .select({ maxPosition: stats.position })
          .from(stats)
          .orderBy(desc(stats.position))
          .limit(1);
        await db.insert(stats).values({ id: generateId(), ...fields, position: (maxPosition ?? -1) + 1000 });
      },
      { entityType: "stat" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/stats"));
}

export async function updateStatAction(
  id: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  try {
    await withAdminMutation(
      "stat.update",
      async () => {
        await db.update(stats).set(fields).where(eq(stats.id, id));
      },
      { entityType: "stat", entityId: id },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/stats"));
}

export async function deleteStatAction(id: string): Promise<void> {
  await withAdminMutation(
    "stat.delete",
    async () => {
      await db.delete(stats).where(eq(stats.id, id));
    },
    { entityType: "stat", entityId: id },
  );
}

export async function moveStatAction(id: string, direction: "up" | "down"): Promise<void> {
  await withAdminMutation(
    "stat.reorder",
    async () => {
      const current = await db.query.stats.findFirst({ where: eq(stats.id, id) });
      if (!current) return;

      const neighbor =
        direction === "up"
          ? await db.query.stats.findFirst({
              where: lt(stats.position, current.position),
              orderBy: [desc(stats.position)],
            })
          : await db.query.stats.findFirst({
              where: gt(stats.position, current.position),
              orderBy: [asc(stats.position)],
            });
      if (!neighbor) return;

      await db.update(stats).set({ position: neighbor.position }).where(eq(stats.id, current.id));
      await db.update(stats).set({ position: current.position }).where(eq(stats.id, neighbor.id));
    },
    { entityType: "stat", entityId: id, meta: { direction } },
  );
}
