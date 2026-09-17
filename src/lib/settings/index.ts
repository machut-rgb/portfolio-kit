import { unstable_cache } from "next/cache";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sections as sectionsTable, siteSettings, themeSettings } from "@/lib/db/schema";
import { siteConfig } from "@config/site.config";
import { themeConfig } from "@config/theme.config";
import { sections as staticSections, type SectionConfig } from "@config/sections.config";
import type { ThemeConfig } from "@/lib/theme/types";
import { siteSettingsSchema, themeSettingsSchema, type SiteSettingsData } from "./schema";

/**
 * Reads the three "how the site is configured" tables, with the static
 * `config/*.ts` files as fallback.
 *
 * The fallback isn't just defensive — it's what keeps this kit forkable.
 * Clone the repo, don't seed anything, and the site still renders from the
 * checked-in config exactly as it did before Phase 4. Seed it, and the
 * admin panel becomes the source of truth instead. Neither path requires
 * editing framework code.
 *
 * Shares the `"content"` cache tag with `getContent()`, so a single
 * `updateTag("content")` after any admin save invalidates settings and
 * content together — they're always read as a set anyway.
 */

/** `url` always comes from the environment, never the database — it differs
 *  per deployment (preview vs production) and shouldn't be baked into content. */
const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

const loadSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsData> => {
    const row = await db.query.siteSettings.findFirst();
    if (!row) {
      const { url: _url, ...rest } = siteConfig;
      return rest as SiteSettingsData;
    }
    const parsed = siteSettingsSchema.safeParse(row.data);
    if (!parsed.success) {
      // Bad data in the DB shouldn't take the whole site down — fall back to
      // the committed config and make the problem visible in the logs.
      console.error("[settings] site_settings failed validation, using config/site.config.ts:", parsed.error.issues);
      const { url: _url, ...rest } = siteConfig;
      return rest as SiteSettingsData;
    }
    return parsed.data;
  },
  ["site-settings"],
  { tags: ["content"], revalidate: 300 },
);

export async function getSiteSettings() {
  const data = await loadSiteSettings();
  return { ...data, url: siteUrl() };
}

const loadThemeSettings = unstable_cache(
  async (): Promise<ThemeConfig> => {
    const row = await db.query.themeSettings.findFirst();
    if (!row) return themeConfig;
    const parsed = themeSettingsSchema.safeParse(row.data);
    if (!parsed.success) {
      console.error("[settings] theme_settings failed validation, using config/theme.config.ts:", parsed.error.issues);
      return themeConfig;
    }
    return parsed.data as ThemeConfig;
  },
  ["theme-settings"],
  { tags: ["content"], revalidate: 300 },
);

export async function getThemeSettings(): Promise<ThemeConfig> {
  return loadThemeSettings();
}

const loadSections = unstable_cache(
  async (): Promise<SectionConfig[]> => {
    const rows = await db.query.sections.findMany({ orderBy: [asc(sectionsTable.position)] });
    if (rows.length === 0) return staticSections;

    // Rows are typed loosely (type/variant are plain text columns), so the
    // cast is checked against the static config's union at the edges:
    // `renderSection` returns null for an unknown type, and an unknown
    // variant falls through to its section's default branch.
    return rows.map(
      (row) =>
        ({
          id: row.id,
          type: row.type,
          variant: row.variant,
          enabled: row.enabled,
          nav: row.nav,
          divider: row.divider,
          navLabel: row.navLabel ?? undefined,
          eyebrow: row.eyebrow ?? undefined,
          title: row.title ?? undefined,
          intro: row.intro ?? undefined,
        }) as SectionConfig,
    );
  },
  ["sections"],
  { tags: ["content"], revalidate: 300 },
);

export async function getSections(): Promise<SectionConfig[]> {
  return loadSections();
}

export async function getEnabledSections(): Promise<SectionConfig[]> {
  return (await getSections()).filter((s) => s.enabled);
}

export async function getNavSections(): Promise<SectionConfig[]> {
  return (await getSections()).filter((s) => s.enabled && s.nav);
}
