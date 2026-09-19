"use server";

import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { contact, contactChannels, socialLinks } from "@/lib/db/schema";
import { saveSingleton } from "@/lib/db/singleton";
import { withAdminMutation } from "@/lib/admin/mutation";
import { generateId } from "@/lib/auth/tokens";
import { adminHref } from "@/lib/auth/config";
import { parseLocalized, parseOptionalString, parseString } from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

/** One social link per line: `Label|https://url|icon|handle` — handle is optional. */
function parseSocialLines(raw: string): { label: string; href: string; icon: string; handle?: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href, icon, handle] = line.split("|").map((p) => p.trim());
      return { label: label!, href: href!, icon: icon || "globe", handle: handle || undefined };
    })
    .filter((s) => s.label && s.href);
}

export async function updateContactAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const heading = parseLocalized(formData, "heading");
  const body = parseLocalized(formData, "body");
  const socialRaw = parseString(formData, "social");

  try {
    await withAdminMutation(
      "contact.update",
      async () => {
        await saveSingleton(contact, { heading, body, updatedAt: new Date() });

        await db.delete(socialLinks);
        const links = parseSocialLines(socialRaw);
        if (links.length > 0) {
          await db.insert(socialLinks).values(
            links.map((link, position) => ({ id: generateId(), ...link, position })),
          );
        }
      },
      { entityType: "contact" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  return { success: true };
}

// --- Contact channels (localized, so they get their own small CRUD) -------

function readChannelFields(formData: FormData) {
  return {
    icon: parseString(formData, "icon") || "sparkle",
    label: parseLocalized(formData, "label"),
    value: parseLocalized(formData, "value"),
    href: parseOptionalString(formData, "href"),
  };
}

export async function createChannelAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const fields = readChannelFields(formData);

  try {
    await withAdminMutation(
      "contactChannel.create",
      async () => {
        const [{ maxPosition } = { maxPosition: -1 }] = await db
          .select({ maxPosition: contactChannels.position })
          .from(contactChannels)
          .orderBy(asc(contactChannels.position));
        await db.insert(contactChannels).values({ id: generateId(), ...fields, position: (maxPosition ?? -1) + 1000 });
      },
      { entityType: "contactChannel" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/contact/channels"));
}

export async function updateChannelAction(
  id: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readChannelFields(formData);

  try {
    await withAdminMutation(
      "contactChannel.update",
      async () => {
        await db.update(contactChannels).set(fields).where(eq(contactChannels.id, id));
      },
      { entityType: "contactChannel", entityId: id },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/contact/channels"));
}

export async function deleteChannelAction(id: string): Promise<void> {
  await withAdminMutation(
    "contactChannel.delete",
    async () => {
      await db.delete(contactChannels).where(eq(contactChannels.id, id));
    },
    { entityType: "contactChannel", entityId: id },
  );
}

export async function moveChannelAction(id: string, direction: "up" | "down"): Promise<void> {
  await withAdminMutation(
    "contactChannel.reorder",
    async () => {
      const current = await db.query.contactChannels.findFirst({ where: eq(contactChannels.id, id) });
      if (!current) return;

      const neighbor =
        direction === "up"
          ? await db.query.contactChannels.findFirst({
              where: lt(contactChannels.position, current.position),
              orderBy: [desc(contactChannels.position)],
            })
          : await db.query.contactChannels.findFirst({
              where: gt(contactChannels.position, current.position),
              orderBy: [asc(contactChannels.position)],
            });
      if (!neighbor) return;

      await db.update(contactChannels).set({ position: neighbor.position }).where(eq(contactChannels.id, current.id));
      await db.update(contactChannels).set({ position: current.position }).where(eq(contactChannels.id, neighbor.id));
    },
    { entityType: "contactChannel", entityId: id, meta: { direction } },
  );
}
