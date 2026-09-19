"use server";

import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { socialLinks } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { generateId } from "@/lib/auth/tokens";
import { adminHref } from "@/lib/auth/config";
import { parseOptionalString, parseString } from "@/lib/admin/formData";
import { detectPlatform, isAllowedSocialHref } from "@/lib/admin/socialPlatforms";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

function readFields(formData: FormData) {
  const href = parseString(formData, "href");
  const detected = detectPlatform(href);
  return {
    label: parseString(formData, "label") || detected?.label || "Link",
    href,
    icon: parseString(formData, "icon") || detected?.icon || "globe",
    handle: parseOptionalString(formData, "handle"),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.href) return "Add the link's address.";
  if (!isAllowedSocialHref(fields.href)) {
    return "That address is not valid. Use a full https:// link, or mailto: for an email address.";
  }
  if (!fields.label) return "Give the link a label.";
  return null;
}

export async function createSocialLinkAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  try {
    await withAdminMutation(
      "socialLink.create",
      async () => {
        const [{ maxPosition } = { maxPosition: -1 }] = await db
          .select({ maxPosition: socialLinks.position })
          .from(socialLinks)
          .orderBy(desc(socialLinks.position))
          .limit(1);
        await db.insert(socialLinks).values({ id: generateId(), ...fields, position: (maxPosition ?? -1) + 1000 });
      },
      { entityType: "socialLink" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/contact/social"));
}

export async function updateSocialLinkAction(
  id: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readFields(formData);
  const error = validate(fields);
  if (error) return { error };

  try {
    await withAdminMutation(
      "socialLink.update",
      async () => {
        await db.update(socialLinks).set(fields).where(eq(socialLinks.id, id));
      },
      { entityType: "socialLink", entityId: id },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/contact/social"));
}

export async function deleteSocialLinkAction(id: string): Promise<void> {
  await withAdminMutation(
    "socialLink.delete",
    async () => {
      await db.delete(socialLinks).where(eq(socialLinks.id, id));
    },
    { entityType: "socialLink", entityId: id },
  );
}

export async function moveSocialLinkAction(id: string, direction: "up" | "down"): Promise<void> {
  await withAdminMutation(
    "socialLink.reorder",
    async () => {
      const current = await db.query.socialLinks.findFirst({ where: eq(socialLinks.id, id) });
      if (!current) return;

      const neighbor =
        direction === "up"
          ? await db.query.socialLinks.findFirst({
              where: lt(socialLinks.position, current.position),
              orderBy: [desc(socialLinks.position)],
            })
          : await db.query.socialLinks.findFirst({
              where: gt(socialLinks.position, current.position),
              orderBy: [asc(socialLinks.position)],
            });
      if (!neighbor) return;

      await db.update(socialLinks).set({ position: neighbor.position }).where(eq(socialLinks.id, current.id));
      await db.update(socialLinks).set({ position: current.position }).where(eq(socialLinks.id, neighbor.id));
    },
    { entityType: "socialLink", entityId: id, meta: { direction } },
  );
}
