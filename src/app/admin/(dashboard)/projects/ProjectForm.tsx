import { AdminForm, type FormActionState } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { CheckboxField, SelectField, TextField } from "@/components/admin/forms/Fields";
import { ImageField } from "@/components/admin/forms/ImageField";
import { localizedDefaults, localizedListDefaults } from "@/lib/admin/formData";
import type { projects } from "@/lib/db/schema";

export function ProjectForm({
  action,
  defaults,
  slugEditable,
}: {
  action: (prev: FormActionState, formData: FormData) => Promise<FormActionState>;
  defaults?: typeof projects.$inferSelect;
  slugEditable?: boolean;
}) {
  return (
    <AdminForm action={action}>
      {slugEditable ? (
        <TextField
          name="slug"
          label="Slug"
          defaultValue={defaults?.slug}
          hint="Lowercase, hyphenated. Used in the URL — can't be changed later."
          required
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          <span className="field-label">Slug</span>
          <div className="field opacity-60 cursor-not-allowed">{defaults?.slug}</div>
        </div>
      )}

      <TextField name="name" label="Name" defaultValue={defaults?.name} required />
      <LocalizedField name="category" label="Category" defaultValues={localizedDefaults(defaults?.category)} required />
      <LocalizedField
        name="summary"
        label="Summary"
        defaultValues={localizedDefaults(defaults?.summary)}
        multiline
        rows={2}
        required
      />
      <LocalizedField
        name="body"
        label="Body (optional — adds a detail page)"
        defaultValues={localizedListDefaults(defaults?.body ?? undefined)}
        multiline
        rows={6}
        hint="One paragraph per line."
      />
      <LocalizedField
        name="highlights"
        label="Highlights (optional)"
        defaultValues={localizedListDefaults(defaults?.highlights ?? undefined)}
        multiline
        rows={4}
        hint="One highlight per line."
      />

      <div className="grid sm:grid-cols-3 gap-5">
        <TextField name="year" label="Year" type="number" defaultValue={defaults?.year?.toString()} required />
        <SelectField
          name="status"
          label="Status"
          defaultValue={defaults?.status ?? "live"}
          options={[
            { value: "live", label: "Live" },
            { value: "wip", label: "Work in progress" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <div className="pt-6">
          <CheckboxField name="featured" label="Featured on home page" defaultChecked={defaults?.featured} />
        </div>
      </div>

      <LocalizedField name="role" label="Your role (optional)" defaultValues={localizedDefaults(defaults?.role ?? undefined)} />
      <TextField name="tags" label="Tags" defaultValue={defaults?.tags.join(", ")} hint="Comma-separated" />

      <div className="hairline my-2" />
      <div className="eyebrow -mb-2">Links</div>
      <div className="grid sm:grid-cols-3 gap-5">
        <TextField name="linkRepo" label="Repository" type="url" defaultValue={defaults?.links?.repo} />
        <TextField name="linkDemo" label="Live demo" type="url" defaultValue={defaults?.links?.demo} />
        <TextField name="linkWriteup" label="Write-up" type="url" defaultValue={defaults?.links?.writeup} />
      </div>

      <div className="hairline my-2" />
      <div className="eyebrow -mb-2">Cover image</div>
      <ImageField
        name="cover"
        label="Cover"
        currentUrl={defaults?.coverSrc}
        hint="Optional. Leave empty for a text-only card."
      />
      <LocalizedField name="coverAlt" label="Cover alt text" defaultValues={localizedDefaults(defaults?.coverAlt ?? undefined)} />
    </AdminForm>
  );
}
