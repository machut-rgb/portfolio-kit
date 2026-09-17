"use server";

import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { certifications } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { generateId } from "@/lib/auth/tokens";
import { adminHref } from "@/lib/auth/config";
import { parseLocalized, parseOptionalString, parseString } from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

function readFields(formData: FormData) {
  return {
    name: parseLocalized(formData, "name"),
    issuer: parseString(formData, "issuer"),
    year: parseString(formData, "year"),
    description: parseLocalized(formData, "description"),
    icon: parseOptionalString(formData, "icon"),
    url: parseOptionalString(formData, "url"),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.issuer) return "Issuer is required.";
  if (!fields.year) return "Year is required.";
  return null;
}

export async function createCertificationAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  try {
    await withAdminMutation(
      "certification.create",
      async () => {
        const [{ maxPosition } = { maxPosition: -1 }] = await db
          .select({ maxPosition: certifications.position })
          .from(certifications)
          .orderBy(asc(certifications.position));
        await db.insert(certifications).values({ id: generateId(), ...fields, position: (maxPosition ?? -1) + 1000 });
      },
      { entityType: "certification" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/certifications"));
}

export async function updateCertificationAction(
  id: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  try {
    await withAdminMutation(
      "certification.update",
      async () => {
        await db.update(certifications).set(fields).where(eq(certifications.id, id));
      },
      { entityType: "certification", entityId: id },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/certifications"));
}

export async function deleteCertificationAction(id: string): Promise<void> {
  await withAdminMutation(
    "certification.delete",
    async () => {
      await db.delete(certifications).where(eq(certifications.id, id));
    },
    { entityType: "certification", entityId: id },
  );
}

export async function moveCertificationAction(id: string, direction: "up" | "down"): Promise<void> {
  await withAdminMutation(
    "certification.reorder",
    async () => {
      const current = await db.query.certifications.findFirst({ where: eq(certifications.id, id) });
      if (!current) return;

      const neighbor =
        direction === "up"
          ? await db.query.certifications.findFirst({
              where: lt(certifications.position, current.position),
              orderBy: [desc(certifications.position)],
            })
          : await db.query.certifications.findFirst({
              where: gt(certifications.position, current.position),
              orderBy: [asc(certifications.position)],
            });
      if (!neighbor) return;

      await db.update(certifications).set({ position: neighbor.position }).where(eq(certifications.id, current.id));
      await db.update(certifications).set({ position: current.position }).where(eq(certifications.id, neighbor.id));
    },
    { entityType: "certification", entityId: id, meta: { direction } },
  );
}
