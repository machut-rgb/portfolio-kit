"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { parseBoolean, parseLocalized, parseList, parseString } from "@/lib/admin/formData";
import { siteSettingsSchema } from "@/lib/settings/schema";
import type { FormActionState } from "@/components/admin/forms/AdminForm";
import { defaultLocale } from "@/lib/i18n/config";

export async function updateSiteSettingsAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const repository = parseString(formData, "repository");

  const data = {
    name: parseString(formData, "name"),
    shortName: parseString(formData, "shortName"),
    description: parseLocalized(formData, "description"),
    keywords: parseList(formData, "keywords"),
    defaultLocale: parseString(formData, "defaultLocale") || defaultLocale,
    repository: repository || null,
    features: {
      projectPages: parseBoolean(formData, "features.projectPages"),
      resume: parseBoolean(formData, "features.resume"),
      contactForm: parseBoolean(formData, "features.contactForm"),
      localeSwitcher: parseBoolean(formData, "features.localeSwitcher"),
      analytics: parseBoolean(formData, "features.analytics"),
    },
    footerLinks: [] as { label: string; href: string }[],
  };

  // Validate before writing, using the same schema the read path uses — so
  // it's impossible to persist a shape the site would later fail to load.
  const parsed = siteSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid settings." };
  }

  try {
    await withAdminMutation(
      "siteSettings.update",
      async () => {
        await db
          .update(siteSettings)
          .set({ data: parsed.data, updatedAt: new Date() })
          .where(eq(siteSettings.id, 1));
      },
      { entityType: "siteSettings" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  return { success: true };
}
