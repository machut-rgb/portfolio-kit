"use server";

import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { experience } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { generateId } from "@/lib/auth/tokens";
import { adminHref } from "@/lib/auth/config";
import {
  parseBoolean,
  parseLocalized,
  parseLocalizedList,
  parseList,
  parseOptionalString,
  parseString,
} from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

function readFields(formData: FormData) {
  return {
    role: parseLocalized(formData, "role"),
    org: parseString(formData, "org"),
    orgUrl: parseOptionalString(formData, "orgUrl"),
    location: parseString(formData, "location"),
    start: parseString(formData, "start"),
    end: parseOptionalString(formData, "end"),
    current: parseBoolean(formData, "current"),
    bullets: parseLocalizedList(formData, "bullets"),
    stack: parseList(formData, "stack"),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.org) return "Organization is required.";
  if (!/^\d{4}(-\d{2})?$/.test(fields.start)) return "Start date must be YYYY or YYYY-MM.";
  if (fields.end && !/^\d{4}(-\d{2})?$/.test(fields.end)) return "End date must be YYYY or YYYY-MM.";
  return null;
}

export async function createExperienceAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  let newId = "";
  try {
    await withAdminMutation(
      "experience.create",
      async () => {
        const [{ maxPosition } = { maxPosition: -1 }] = await db
          .select({ maxPosition: experience.position })
          .from(experience)
          .orderBy(asc(experience.position));
        newId = generateId();
        await db.insert(experience).values({ id: newId, ...fields, position: (maxPosition ?? -1) + 1000 });
      },
      { entityType: "experience" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/experience"));
}

export async function updateExperienceAction(
  id: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  try {
    await withAdminMutation(
      "experience.update",
      async () => {
        await db.update(experience).set(fields).where(eq(experience.id, id));
      },
      { entityType: "experience", entityId: id },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/experience"));
}

export async function deleteExperienceAction(id: string): Promise<void> {
  await withAdminMutation(
    "experience.delete",
    async () => {
      await db.delete(experience).where(eq(experience.id, id));
    },
    { entityType: "experience", entityId: id },
  );
}

/** Swaps position with the adjacent row — simple, dependency-free reordering. */
export async function moveExperienceAction(id: string, direction: "up" | "down"): Promise<void> {
  await withAdminMutation(
    "experience.reorder",
    async () => {
      const current = await db.query.experience.findFirst({ where: eq(experience.id, id) });
      if (!current) return;

      const neighbor =
        direction === "up"
          ? await db.query.experience.findFirst({
              where: lt(experience.position, current.position),
              orderBy: [desc(experience.position)],
            })
          : await db.query.experience.findFirst({
              where: gt(experience.position, current.position),
              orderBy: [asc(experience.position)],
            });
      if (!neighbor) return;

      await db.update(experience).set({ position: neighbor.position }).where(eq(experience.id, current.id));
      await db.update(experience).set({ position: current.position }).where(eq(experience.id, neighbor.id));
    },
    { entityType: "experience", entityId: id, meta: { direction } },
  );
}
