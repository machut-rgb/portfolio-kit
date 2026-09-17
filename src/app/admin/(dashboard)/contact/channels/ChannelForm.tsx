import { AdminForm, type FormActionState } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { SelectField, TextField } from "@/components/admin/forms/Fields";
import { localizedDefaults } from "@/lib/admin/formData";
import { iconOptions } from "@/lib/admin/iconOptions";
import type { contactChannels } from "@/lib/db/schema";

export function ChannelForm({
  action,
  defaults,
}: {
  action: (prev: FormActionState, formData: FormData) => Promise<FormActionState>;
  defaults?: typeof contactChannels.$inferSelect;
}) {
  return (
    <AdminForm action={action}>
      <SelectField name="icon" label="Icon" defaultValue={defaults?.icon ?? "sparkle"} options={iconOptions} />
      <LocalizedField name="label" label="Label" defaultValues={localizedDefaults(defaults?.label)} required />
      <LocalizedField name="value" label="Value" defaultValues={localizedDefaults(defaults?.value)} required />
      <TextField
        name="href"
        label="Link (optional)"
        defaultValue={defaults?.href ?? undefined}
        hint="Leave blank to show as plain text, not a link."
      />
    </AdminForm>
  );
}
