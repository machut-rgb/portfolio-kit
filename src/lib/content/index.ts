import { unstable_cache } from "next/cache";
import { t } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import { formatIssues, siteContentSchema } from "./schema";
import { loadContentFromDb } from "./db-loader";
import type { ExperienceItem, Project, SiteContent } from "./types";

/**
 * The single read path for site content. Backed by the database (see
 * `db-loader.ts`) — `/content/*.ts` is now seed data only, loaded once by
 * `scripts/seed-content.ts` and never read at request time.
 *
 * Wrapped in `unstable_cache` (not a raw DB call on every request) because
 * Drizzle/libSQL queries aren't `fetch()`, so Next's request cache doesn't
 * cover them automatically. Tagged `"content"` so an admin mutation can call
 * `revalidateTag("content")` and every page relying on this picks up the
 * change on its next request — no redeploy, no manual cache clear.
 *
 * `revalidate: 300` is a time-based safety net (content is never more than
 * 5 minutes stale even if a revalidation call is ever missed), not the
 * primary invalidation mechanism.
 */
const loadContent = unstable_cache(
  async (): Promise<SiteContent> => {
    const data = await loadContentFromDb();
    const result = siteContentSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid site content:\n${formatIssues(result.error)}`);
    }
    return result.data;
  },
  ["site-content"],
  { tags: ["content"], revalidate: 300 },
);

export async function getContent(): Promise<SiteContent> {
  return loadContent();
}

export async function getProjects(options?: { featuredOnly?: boolean }): Promise<Project[]> {
  const all = (await getContent()).projects;
  const list = options?.featuredOnly ? all.filter((p) => p.featured) : all;
  return [...list].sort((a, b) => b.year - a.year);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getContent()).projects.find((p) => p.slug === slug);
}

/** Every tag in use, most common first — powers the project filter. */
export async function getProjectTags(): Promise<string[]> {
  const counts = new Map<string, number>();
  for (const project of (await getContent()).projects) {
    for (const tag of project.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
}

/** Reverse-chronological, current roles first. */
export async function getExperience(): Promise<ExperienceItem[]> {
  const experience = (await getContent()).experience;
  return [...experience].sort((a, b) => {
    if (a.current !== b.current) return a.current ? -1 : 1;
    return (b.start ?? "").localeCompare(a.start ?? "");
  });
}

export async function getFullName(): Promise<string> {
  const { firstName, lastName } = (await getContent()).profile;
  return `${firstName} ${lastName}`;
}

/** Primary role label, used in metadata and the OG image. */
export async function getPrimaryRole(locale: Locale): Promise<string> {
  const first = (await getContent()).profile.roles[0];
  return first ? t(first, locale) : "";
}

export type { SiteContent };
