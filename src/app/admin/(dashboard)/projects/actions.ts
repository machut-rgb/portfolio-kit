"use server";

import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { adminHref } from "@/lib/auth/config";
import {
  parseBoolean,
  parseLocalized,
  parseLocalizedList,
  parseLocalizedOptional,
  parseList,
  parseNumber,
  parseOptionalString,
  parseString,
} from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";
import type { ProjectStatus } from "@/lib/content/types";

function readFields(formData: FormData) {
  const bodyList = parseLocalizedList(formData, "body");
  const highlightsList = parseLocalizedList(formData, "highlights");
  const status = parseOptionalString(formData, "status") as ProjectStatus | undefined;
  const repo = parseOptionalString(formData, "linkRepo");
  const demo = parseOptionalString(formData, "linkDemo");
  const writeup = parseOptionalString(formData, "linkWriteup");

  return {
    name: parseString(formData, "name"),
    category: parseLocalized(formData, "category"),
    summary: parseLocalized(formData, "summary"),
    body: bodyList.length > 0 ? bodyList : undefined,
    highlights: highlightsList.length > 0 ? highlightsList : undefined,
    year: parseNumber(formData, "year") ?? new Date().getFullYear(),
    role: parseLocalizedOptional(formData, "role"),
    tags: parseList(formData, "tags"),
    links: repo || demo || writeup ? { repo, demo, writeup } : undefined,
    featured: parseBoolean(formData, "featured"),
    status: status || undefined,
    coverSrc: parseOptionalString(formData, "coverSrc"),
    coverAlt: parseLocalizedOptional(formData, "coverAlt"),
    coverWidth: parseNumber(formData, "coverWidth"),
    coverHeight: parseNumber(formData, "coverHeight"),
  };
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function createProjectAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const slug = parseString(formData, "slug").toLowerCase();
  if (!SLUG_RE.test(slug)) return { error: "Slug must be lowercase, hyphenated (e.g. soc-home-lab)." };

  const fields = readFields(formData);
  if (!fields.name) return { error: "Name is required." };

  try {
    const existing = await db.query.projects.findFirst({ where: eq(projects.slug, slug) });
    if (existing) return { error: `A project with slug "${slug}" already exists.` };

    await withAdminMutation(
      "project.create",
      async () => {
        const [{ maxPosition } = { maxPosition: -1 }] = await db
          .select({ maxPosition: projects.position })
          .from(projects)
          .orderBy(asc(projects.position));
        await db.insert(projects).values({ slug, ...fields, position: (maxPosition ?? -1) + 1000 });
      },
      { entityType: "project", entityId: slug },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/projects"));
}

export async function updateProjectAction(
  slug: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readFields(formData);
  if (!fields.name) return { error: "Name is required." };

  try {
    await withAdminMutation(
      "project.update",
      async () => {
        await db.update(projects).set({ ...fields, updatedAt: new Date() }).where(eq(projects.slug, slug));
      },
      { entityType: "project", entityId: slug },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref("/projects"));
}

export async function deleteProjectAction(slug: string): Promise<void> {
  await withAdminMutation(
    "project.delete",
    async () => {
      await db.delete(projects).where(eq(projects.slug, slug));
    },
    { entityType: "project", entityId: slug },
  );
}

export async function moveProjectAction(slug: string, direction: "up" | "down"): Promise<void> {
  await withAdminMutation(
    "project.reorder",
    async () => {
      const current = await db.query.projects.findFirst({ where: eq(projects.slug, slug) });
      if (!current) return;

      const neighbor =
        direction === "up"
          ? await db.query.projects.findFirst({
              where: lt(projects.position, current.position),
              orderBy: [desc(projects.position)],
            })
          : await db.query.projects.findFirst({
              where: gt(projects.position, current.position),
              orderBy: [asc(projects.position)],
            });
      if (!neighbor) return;

      await db.update(projects).set({ position: neighbor.position }).where(eq(projects.slug, current.slug));
      await db.update(projects).set({ position: current.position }).where(eq(projects.slug, neighbor.slug));
    },
    { entityType: "project", entityId: slug, meta: { direction } },
  );
}
