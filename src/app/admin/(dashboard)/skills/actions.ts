"use server";

import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { skillGroups, skillItems } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { generateId } from "@/lib/auth/tokens";
import { adminHref } from "@/lib/auth/config";
import { parseLocalized, parseOptionalString, parseString } from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

/**
 * Each line is one skill: `Name` or `Name|Level` (level 1-5, optional).
 * A textarea beats a fully dynamic add/remove-row UI here — faster to type,
 * easy to reorder by cutting and pasting lines, and every field in this
 * kit's audience is comfortable editing structured text.
 */
function parseItems(raw: string): { name: string; level?: number }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, levelRaw] = line.split("|").map((p) => p.trim());
      const level = levelRaw ? Number(levelRaw) : undefined;
      return { name: name!, level: level && level >= 1 && level <= 5 ? level : undefined };
    })
    .filter((item) => item.name);
}

async function replaceItems(groupId: string, raw: string) {
  await db.delete(skillItems).where(eq(skillItems.groupId, groupId));
  const items = parseItems(raw);
  if (items.length > 0) {
    await db.insert(skillItems).values(
      items.map((item, position) => ({
        id: generateId(),
        groupId,
        name: item.name,
        level: item.level,
        position,
      })),
    );
  }
}

export async function createSkillGroupAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const title = parseLocalized(formData, "title");
  const itemsRaw = parseString(formData, "items");
  if (parseItems(itemsRaw).length === 0) return { error: "Add at least one skill." };

  try {
    const groupId = generateId();
    await withAdminMutation(
      "skillGroup.create",
      async () => {
        const [{ maxPosition } = { maxPosition: -1 }] = await db
          .select({ maxPosition: skillGroups.position })
          .from(skillGroups)
          .orderBy(asc(skillGroups.position));
        await db
          .insert(skillGroups)
          .values({ id: groupId, title, icon: parseOptionalString(formData, "icon"), position: (maxPosition ?? -1) + 1000 });
        await replaceItems(groupId, itemsRaw);
      },
      { entityType: "skillGroup", entityId: groupId },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/skills"));
}

export async function updateSkillGroupAction(
  id: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const title = parseLocalized(formData, "title");
  const itemsRaw = parseString(formData, "items");
  if (parseItems(itemsRaw).length === 0) return { error: "Add at least one skill." };

  try {
    await withAdminMutation(
      "skillGroup.update",
      async () => {
        await db.update(skillGroups).set({ title, icon: parseOptionalString(formData, "icon") }).where(eq(skillGroups.id, id));
        await replaceItems(id, itemsRaw);
      },
      { entityType: "skillGroup", entityId: id },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/skills"));
}

export async function deleteSkillGroupAction(id: string): Promise<void> {
  await withAdminMutation(
    "skillGroup.delete",
    async () => {
      await db.delete(skillGroups).where(eq(skillGroups.id, id));
    },
    { entityType: "skillGroup", entityId: id },
  );
}

export async function moveSkillGroupAction(id: string, direction: "up" | "down"): Promise<void> {
  await withAdminMutation(
    "skillGroup.reorder",
    async () => {
      const current = await db.query.skillGroups.findFirst({ where: eq(skillGroups.id, id) });
      if (!current) return;

      const neighbor =
        direction === "up"
          ? await db.query.skillGroups.findFirst({
              where: lt(skillGroups.position, current.position),
              orderBy: [desc(skillGroups.position)],
            })
          : await db.query.skillGroups.findFirst({
              where: gt(skillGroups.position, current.position),
              orderBy: [asc(skillGroups.position)],
            });
      if (!neighbor) return;

      await db.update(skillGroups).set({ position: neighbor.position }).where(eq(skillGroups.id, current.id));
      await db.update(skillGroups).set({ position: current.position }).where(eq(skillGroups.id, neighbor.id));
    },
    { entityType: "skillGroup", entityId: id, meta: { direction } },
  );
}
