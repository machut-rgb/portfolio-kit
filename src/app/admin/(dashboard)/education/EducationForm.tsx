import { AdminForm, type FormActionState } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { TextField } from "@/components/admin/forms/Fields";
import { localizedDefaults } from "@/lib/admin/formData";
import type { education } from "@/lib/db/schema";

export function EducationForm({
  action,
  defaults,
}: {
  action: (prev: FormActionState, formData: FormData) => Promise<FormActionState>;
  defaults?: typeof education.$inferSelect;
}) {
  return (
    <AdminForm action={action}>
      <LocalizedField name="degree" label="Degree or programme" defaultValues={localizedDefaults(defaults?.degree)} required />

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField name="school" label="School" defaultValue={defaults?.school} required />
        <TextField name="location" label="Location" defaultValue={defaults?.location} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField name="start" label="Start" defaultValue={defaults?.start} hint="A year, e.g. 2022" required />
        <TextField name="end" label="End" defaultValue={defaults?.end} hint="A year, or 'Present'" required />
      </div>

      <LocalizedField
        name="note"
        label="Note (optional)"
        defaultValues={localizedDefaults(defaults?.note ?? undefined)}
        multiline
        rows={2}
        hint="Specialisation, honours, or anything worth adding."
      />
    </AdminForm>
  );
}
