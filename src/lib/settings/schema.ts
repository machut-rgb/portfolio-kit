import { z } from "zod";
import { locales } from "@/lib/i18n/config";
import type { L } from "@/lib/i18n/localize";

/**
 * The settings tables store JSON blobs rather than one column per field.
 * That's deliberate: these are small, read-together, rarely-queried config
 * objects whose shape changes as the kit grows — a schema migration for
 * every new feature flag would be a lot of churn for no query benefit.
 * The trade-off is that the database can't enforce their shape, so these
 * schemas do it at the boundary instead, on every read and every write.
 */
// Annotated as `L` so downstream `t(value, locale)` calls narrow to string.
// Without it, Zod infers the raw union and every consumer needs a cast.
const localized: z.ZodType<L> = z.union([z.string(), z.record(z.string(), z.string())]);

export const siteSettingsSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  description: localized,
  keywords: z.array(z.string()),
  defaultLocale: z.enum(locales as unknown as [string, ...string[]]),
  repository: z.string().nullable(),
  features: z.object({
    projectPages: z.boolean(),
    resume: z.boolean(),
    contactForm: z.boolean(),
    localeSwitcher: z.boolean(),
    analytics: z.boolean(),
  }),
  footerLinks: z.array(z.object({ label: localized, href: z.string() })),
});

export type SiteSettingsData = z.infer<typeof siteSettingsSchema>;

export const themeSettingsSchema = z.object({
  defaultPreset: z.string().min(1),
  defaultMode: z.enum(["light", "dark", "system"]),
  overrides: z.record(z.string(), z.unknown()).default({}),
  allowVisitorTheming: z.boolean(),
  studio: z.union([z.boolean(), z.literal("dev")]),
  offeredPresets: z.array(z.string()).default([]),
});

export type ThemeSettingsData = z.infer<typeof themeSettingsSchema>;
