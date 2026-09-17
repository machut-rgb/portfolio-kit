import { AdminForm, type FormActionState } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { CheckboxField, TextField } from "@/components/admin/forms/Fields";
import { localizedDefaults, localizedListDefaults } from "@/lib/admin/formData";
import type { experience } from "@/lib/db/schema";

export function ExperienceForm({
  action,
  defaults,
}: {
  action: (prev: FormActionState, formData: FormData) => Promise<FormActionState>;
  defaults?: typeof experience.$inferSelect;
}) {
  return (
    <AdminForm action={action}>
      <LocalizedField name="role" label="Role" defaultValues={localizedDefaults(defaults?.role)} required />

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField name="org" label="Organization" defaultValue={defaults?.org} required />
        <TextField name="orgUrl" label="Organization URL" type="url" defaultValue={defaults?.orgUrl ?? undefined} />
      </div>

      <TextField name="location" label="Location" defaultValue={defaults?.location} />

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField name="start" label="Start" defaultValue={defaults?.start} hint="YYYY or YYYY-MM" required />
        <TextField name="end" label="End" defaultValue={defaults?.end ?? undefined} hint="Leave blank if current" />
      </div>

      <CheckboxField name="current" label="This is my current role" defaultChecked={defaults?.current} />

      <LocalizedField
        name="bullets"
        label="Highlights"
        defaultValues={localizedListDefaults(defaults?.bullets)}
        multiline
        rows={5}
        hint="One bullet per line."
      />

      <TextField
        name="stack"
        label="Stack"
        defaultValue={defaults?.stack.join(", ")}
        hint="Comma-separated, e.g. PfSense, FreeRADIUS, Wazuh"
      />
    </AdminForm>
  );
}
