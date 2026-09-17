import { getThemeSettings } from "@/lib/settings";
import { presets } from "@/lib/theme/presets";
import { AdminForm } from "@/components/admin/forms/AdminForm";
import { CheckboxField, SelectField } from "@/components/admin/forms/Fields";
import { updateThemeSettingsAction } from "./actions";

export default async function ThemeSettingsPage() {
  const settings = await getThemeSettings();
  const offered = settings.offeredPresets ?? [];

  return (
    <div className="max-w-2xl">
      <div className="eyebrow mb-2">Site</div>
      <h1 className="text-heading mb-2">Theme</h1>
      <p className="text-sm mb-8 measure" style={{ color: "var(--p-fg-muted)" }}>
        Sets what every visitor sees before they change anything. To design a new look, use the Theme Studio on
        the public site — it edits live and exports a config snippet.
      </p>

      <AdminForm action={updateThemeSettingsAction}>
        <div className="grid sm:grid-cols-2 gap-5">
          <SelectField
            name="defaultPreset"
            label="Default preset"
            defaultValue={settings.defaultPreset}
            options={presets.map((p) => ({ value: p.id, label: p.name }))}
          />
          <SelectField
            name="defaultMode"
            label="Default mode"
            defaultValue={settings.defaultMode}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
              { value: "system", label: "Follow system" },
            ]}
          />
        </div>

        <div className="hairline my-2" />

        <CheckboxField
          name="allowVisitorTheming"
          label="Let visitors switch theme and mode"
          defaultChecked={settings.allowVisitorTheming}
          hint="Turn off for a fixed brand look."
        />

        <SelectField
          name="studio"
          label="Theme Studio"
          defaultValue={settings.studio === "dev" ? "dev" : String(settings.studio)}
          options={[
            { value: "true", label: "Always visible" },
            { value: "dev", label: "Development only" },
            { value: "false", label: "Off" },
          ]}
        />

        <div className="hairline my-2" />

        <div className="flex flex-col gap-1.5">
          <span className="field-label">Presets offered to visitors</span>
          <span className="text-2xs mb-1" style={{ color: "var(--p-fg-subtle)" }}>
            Select none to offer all of them.
          </span>
          <div className="grid sm:grid-cols-2 gap-x-8">
            {presets.map((preset) => (
              <label key={preset.id} className="flex items-center gap-2.5 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  name="offeredPresets"
                  value={preset.id}
                  defaultChecked={offered.includes(preset.id)}
                  className="w-4 h-4 accent-[var(--p-primary)]"
                />
                <span className="text-sm" style={{ color: "var(--p-fg)" }}>
                  {preset.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </AdminForm>
    </div>
  );
}
