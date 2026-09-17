"use server";

import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sections } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { parseBoolean, parseLocalizedOptional, parseString } from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

export async function updateSectionAction(
  id: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const title = parseLocalizedOptional(formData, "title");
  const eyebrow = parseLocalizedOptional(formData, "eyebrow");

  try {
    await withAdminMutation(
      "section.update",
      async () => {
        await db
          .update(sections)
          .set({
            variant: parseString(formData, "variant"),
            enabled: parseBoolean(formData, "enabled"),
            nav: parseBoolean(formData, "nav"),
            divider: parseBoolean(formData, "divider"),
            // `false` (not undefined) is meaningful here: it means "render
            // this section with no heading at all", which is different from
            // "fall back to the default heading".
            title: parseBoolean(formData, "hideTitle") ? false : title,
            eyebrow: parseBoolean(formData, "hideEyebrow") ? false : eyebrow,
            intro: parseLocalizedOptional(formData, "intro"),
          })
          .where(eq(sections.id, id));
      },
      { entityType: "section", entityId: id },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  return { success: true };
}

export async function moveSectionAction(id: string, direction: "up" | "down"): Promise<void> {
  await withAdminMutation(
    "section.reorder",
    async () => {
      const current = await db.query.sections.findFirst({ where: eq(sections.id, id) });
      if (!current) return;

      const neighbor =
        direction === "up"
          ? await db.query.sections.findFirst({
              where: lt(sections.position, current.position),
              orderBy: [desc(sections.position)],
            })
          : await db.query.sections.findFirst({
              where: gt(sections.position, current.position),
              orderBy: [asc(sections.position)],
            });
      if (!neighbor) return;

      await db.update(sections).set({ position: neighbor.position }).where(eq(sections.id, current.id));
      await db.update(sections).set({ position: current.position }).where(eq(sections.id, neighbor.id));
    },
    { entityType: "section", entityId: id, meta: { direction } },
  );
}

export async function toggleSectionAction(id: string, field: "enabled" | "nav"): Promise<void> {
  await withAdminMutation(
    "section.toggle",
    async () => {
      const current = await db.query.sections.findFirst({ where: eq(sections.id, id) });
      if (!current) return;
      await db
        .update(sections)
        .set(field === "enabled" ? { enabled: !current.enabled } : { nav: !current.nav })
        .where(eq(sections.id, id));
    },
    { entityType: "section", entityId: id, meta: { field } },
  );
}
