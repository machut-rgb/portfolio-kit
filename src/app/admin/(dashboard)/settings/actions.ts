"use server";

import { siteSettings } from "@/lib/db/schema";
import { saveSingleton } from "@/lib/db/singleton";
import { withAdminMutation } from "@/lib/admin/mutation";
import { describeStorageError, fileFromForm, storeImage } from "@/lib/media/storage";
import { getSiteSettings } from "@/lib/settings";
import { parseBoolean, parseLocalized, parseList, parseString } from "@/lib/admin/formData";
import { siteSettingsSchema } from "@/lib/settings/schema";
import type { FormActionState } from "@/components/admin/forms/AdminForm";
import { defaultLocale } from "@/lib/i18n/config";

export async function updateSiteSettingsAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const repository = parseString(formData, "repository");

  let faviconSrc: string | null;
  try {
    const upload = await storeImage(fileFromForm(formData, "favicon"));
    if (upload.error) return { error: upload.error };
    const current = await getSiteSettings();
    faviconSrc = upload.stored
      ? upload.stored.url
      : parseBoolean(formData, "faviconRemove")
        ? null
        : (current.faviconSrc ?? null);
  } catch (err) {
    return { error: describeStorageError(err) };
  }

  const data = {
    name: parseString(formData, "name"),
    shortName: parseString(formData, "shortName"),
    description: parseLocalized(formData, "description"),
    keywords: parseList(formData, "keywords"),
    defaultLocale: parseString(formData, "defaultLocale") || defaultLocale,
    repository: repository || null,
    faviconSrc,
    features: {
      projectPages: parseBoolean(formData, "features.projectPages"),
      resume: parseBoolean(formData, "features.resume"),
      contactForm: parseBoolean(formData, "features.contactForm"),
      localeSwitcher: parseBoolean(formData, "features.localeSwitcher"),
    },
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
        await saveSingleton(siteSettings, { data: parsed.data, updatedAt: new Date() });
      },
      { entityType: "siteSettings" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  return { success: true };
}
