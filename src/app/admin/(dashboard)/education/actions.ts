"use server";

import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { education } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { generateId } from "@/lib/auth/tokens";
import { adminHref } from "@/lib/auth/config";
import { parseLocalized, parseLocalizedOptional, parseString } from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

function readFields(formData: FormData) {
  return {
    degree: parseLocalized(formData, "degree"),
    school: parseString(formData, "school"),
    location: parseString(formData, "location"),
    start: parseString(formData, "start"),
    end: parseString(formData, "end"),
    note: parseLocalizedOptional(formData, "note"),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.school) return "The school or institution is required.";
  if (!fields.start) return "Add a start year.";
  if (!fields.end) return "Add an end year, or write 'Present' if it is ongoing.";
  return null;
}

export async function createEducationAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  try {
    await withAdminMutation(
      "education.create",
      async () => {
        const [{ maxPosition } = { maxPosition: -1 }] = await db
          .select({ maxPosition: education.position })
          .from(education)
          .orderBy(desc(education.position))
          .limit(1);
        await db.insert(education).values({ id: generateId(), ...fields, position: (maxPosition ?? -1) + 1000 });
      },
      { entityType: "education" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/education"));
}

export async function updateEducationAction(
  id: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  try {
    await withAdminMutation(
      "education.update",
      async () => {
        await db.update(education).set(fields).where(eq(education.id, id));
      },
      { entityType: "education", entityId: id },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/education"));
}

export async function deleteEducationAction(id: string): Promise<void> {
  await withAdminMutation(
    "education.delete",
    async () => {
      await db.delete(education).where(eq(education.id, id));
    },
    { entityType: "education", entityId: id },
  );
}

export async function moveEducationAction(id: string, direction: "up" | "down"): Promise<void> {
  await withAdminMutation(
    "education.reorder",
    async () => {
      const current = await db.query.education.findFirst({ where: eq(education.id, id) });
      if (!current) return;

      const neighbor =
        direction === "up"
          ? await db.query.education.findFirst({
              where: lt(education.position, current.position),
              orderBy: [desc(education.position)],
            })
          : await db.query.education.findFirst({
              where: gt(education.position, current.position),
              orderBy: [asc(education.position)],
            });
      if (!neighbor) return;

      await db.update(education).set({ position: neighbor.position }).where(eq(education.id, current.id));
      await db.update(education).set({ position: current.position }).where(eq(education.id, neighbor.id));
    },
    { entityType: "education", entityId: id, meta: { direction } },
  );
}
