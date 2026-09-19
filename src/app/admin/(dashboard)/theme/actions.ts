"use server";

import { themeSettings } from "@/lib/db/schema";
import { saveSingleton } from "@/lib/db/singleton";
import { withAdminMutation } from "@/lib/admin/mutation";
import { parseBoolean, parseString } from "@/lib/admin/formData";
import { themeSettingsSchema } from "@/lib/settings/schema";
import { getThemeSettings } from "@/lib/settings";
import { presetMap } from "@/lib/theme/presets";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

export async function updateThemeSettingsAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const defaultPreset = parseString(formData, "defaultPreset");
  if (!presetMap[defaultPreset]) return { error: `Unknown preset "${defaultPreset}".` };

  const studioRaw = parseString(formData, "studio");
  const offered = formData.getAll("offeredPresets").map(String).filter(Boolean);

  // `overrides` isn't editable here — it's produced by the Theme Studio's
  // "Export config" flow and lives in config/theme.config.ts. Preserve
  // whatever is already stored rather than silently clearing it.
  const current = await getThemeSettings();

  const data = {
    defaultPreset,
    defaultMode: parseString(formData, "defaultMode") || "dark",
    overrides: (current.overrides ?? {}) as Record<string, unknown>,
    allowVisitorTheming: parseBoolean(formData, "allowVisitorTheming"),
    studio: studioRaw === "dev" ? ("dev" as const) : studioRaw === "true",
    offeredPresets: offered,
  };

  const parsed = themeSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid theme settings." };
  }

  try {
    await withAdminMutation(
      "themeSettings.update",
      async () => {
        await saveSingleton(themeSettings, { data: parsed.data, updatedAt: new Date() });
      },
      { entityType: "themeSettings" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  return { success: true };
}
