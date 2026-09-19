import { AdminForm, type FormActionState } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { TextField } from "@/components/admin/forms/Fields";
import { localizedDefaults } from "@/lib/admin/formData";
import type { stats } from "@/lib/db/schema";

export function StatForm({
  action,
  defaults,
}: {
  action: (prev: FormActionState, formData: FormData) => Promise<FormActionState>;
  defaults?: typeof stats.$inferSelect;
}) {
  return (
    <AdminForm action={action}>
      <TextField
        name="value"
        label="Figure"
        defaultValue={defaults?.value}
        hint="The large text, e.g. 3, 8+, M.Sc. Free text, not just numbers."
        required
      />
      <LocalizedField
        name="label"
        label="Label"
        defaultValues={localizedDefaults(defaults?.label)}
        hint="The small line underneath, e.g. Internships completed."
        required
      />
    </AdminForm>
  );
}
