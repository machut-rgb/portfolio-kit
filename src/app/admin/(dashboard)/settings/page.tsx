import { getSiteSettings } from "@/lib/settings";
import { AdminForm } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { CheckboxField, SelectField, TextField } from "@/components/admin/forms/Fields";
import { localizedDefaults } from "@/lib/admin/formData";
import { locales, localeNames } from "@/lib/i18n/config";
import { updateSiteSettingsAction } from "./actions";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-2xl">
      <div className="eyebrow mb-2">Site</div>
      <h1 className="text-heading mb-6">Settings</h1>

      <AdminForm action={updateSiteSettingsAction}>
        <div className="grid sm:grid-cols-2 gap-5">
          <TextField name="name" label="Site name" defaultValue={settings.name} required />
          <TextField name="shortName" label="Short name" defaultValue={settings.shortName} required />
        </div>

        <LocalizedField
          name="description"
          label="Meta description"
          defaultValues={localizedDefaults(settings.description)}
          multiline
          rows={3}
          hint="Used for SEO and social previews."
          required
        />

        <TextField name="keywords" label="Keywords" defaultValue={settings.keywords.join(", ")} hint="Comma-separated" />

        <div className="grid sm:grid-cols-2 gap-5">
          <TextField
            name="repository"
            label="Repository URL"
            defaultValue={settings.repository ?? ""}
            hint="Leave blank to hide the footer link."
          />
          <SelectField
            name="defaultLocale"
            label="Default language"
            defaultValue={settings.defaultLocale}
            options={locales.map((l) => ({ value: l, label: localeNames[l] }))}
          />
        </div>

        <div className="hairline my-2" />
        <div className="eyebrow -mb-1">Features</div>
        <p className="text-2xs -mt-1" style={{ color: "var(--p-fg-subtle)" }}>
          Turning one off hides it across the whole site.
        </p>
        <div className="grid sm:grid-cols-2 gap-x-8">
          <CheckboxField name="features.projectPages" label="Project detail pages" defaultChecked={settings.features.projectPages} />
          <CheckboxField name="features.resume" label="Résumé page" defaultChecked={settings.features.resume} />
          <CheckboxField name="features.contactForm" label="Contact form" defaultChecked={settings.features.contactForm} />
          <CheckboxField name="features.localeSwitcher" label="Language switcher" defaultChecked={settings.features.localeSwitcher} />
          <CheckboxField name="features.analytics" label="Analytics" defaultChecked={settings.features.analytics} />
        </div>

        <div className="hairline my-2" />
        <p className="text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
          The site URL comes from the <code>NEXT_PUBLIC_SITE_URL</code> environment variable, not from here — it
          differs between preview and production deployments.
        </p>
      </AdminForm>
    </div>
  );
}
