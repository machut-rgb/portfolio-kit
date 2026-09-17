import { AdminForm, type FormActionState } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { SelectField, TextField } from "@/components/admin/forms/Fields";
import { localizedDefaults } from "@/lib/admin/formData";
import { iconOptions } from "@/lib/admin/iconOptions";
import type { certifications } from "@/lib/db/schema";

export function CertificationForm({
  action,
  defaults,
}: {
  action: (prev: FormActionState, formData: FormData) => Promise<FormActionState>;
  defaults?: typeof certifications.$inferSelect;
}) {
  return (
    <AdminForm action={action}>
      <LocalizedField name="name" label="Name" defaultValues={localizedDefaults(defaults?.name)} required />
      <div className="grid sm:grid-cols-2 gap-5">
        <TextField name="issuer" label="Issuer" defaultValue={defaults?.issuer} required />
        <TextField name="year" label="Year" defaultValue={defaults?.year} required />
      </div>
      <LocalizedField
        name="description"
        label="Description"
        defaultValues={localizedDefaults(defaults?.description)}
        multiline
        rows={3}
        required
      />
      <div className="grid sm:grid-cols-2 gap-5">
        <SelectField name="icon" label="Icon" defaultValue={defaults?.icon ?? "sparkle"} options={iconOptions} />
        <TextField name="url" label="Credential URL (optional)" type="url" defaultValue={defaults?.url ?? undefined} />
      </div>
    </AdminForm>
  );
}
