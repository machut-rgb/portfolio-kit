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

/**
 * Contact-form delivery. Choices live here; secrets do not.
 *
 * Provider, recipient and throttling are ordinary configuration an owner
 * should be able to change without a deploy. SMTP passwords, API keys and
 * webhook URLs stay in environment variables: putting them in a database
 * the application can read weakens exactly what they protect, and a leaked
 * settings row should not also leak the mail account.
 */
export const mailSettingsSchema = z.object({
  provider: z.enum(["console", "smtp", "resend", "webhook"]),
  /** Where submissions are delivered. Blank falls back to MAIL_TO. */
  recipient: z.string(),
  /** Submissions allowed per IP per window. */
  rateLimit: z.number().int().min(1).max(100),
  rateWindowSeconds: z.number().int().min(60).max(86400),
});

export type MailSettingsData = z.infer<typeof mailSettingsSchema>;

export const defaultMailSettings: MailSettingsData = {
  provider: "console",
  recipient: "",
  rateLimit: 5,
  rateWindowSeconds: 3600,
};

export const siteSettingsSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  description: localized,
  keywords: z.array(z.string()),
  defaultLocale: z.enum(locales as unknown as [string, ...string[]]),
  repository: z.string().nullable(),
  /** Upload URL, or null for none. Defaulted so settings rows written
   *  before this field existed still validate. */
  faviconSrc: z.string().nullable().default(null),
  mail: mailSettingsSchema.default(defaultMailSettings),
  features: z.object({
    projectPages: z.boolean(),
    resume: z.boolean(),
    contactForm: z.boolean(),
    localeSwitcher: z.boolean(),
  }),
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
