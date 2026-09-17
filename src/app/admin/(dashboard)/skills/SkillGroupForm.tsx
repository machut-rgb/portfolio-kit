import { AdminForm, type FormActionState } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { SelectField, TextAreaField } from "@/components/admin/forms/Fields";
import { localizedDefaults } from "@/lib/admin/formData";
import { iconOptions } from "@/lib/admin/iconOptions";
import type { skillGroups, skillItems } from "@/lib/db/schema";

export function SkillGroupForm({
  action,
  defaults,
  items,
}: {
  action: (prev: FormActionState, formData: FormData) => Promise<FormActionState>;
  defaults?: typeof skillGroups.$inferSelect;
  items?: (typeof skillItems.$inferSelect)[];
}) {
  const itemsText = (items ?? []).map((i) => (i.level ? `${i.name}|${i.level}` : i.name)).join("\n");

  return (
    <AdminForm action={action}>
      <LocalizedField name="title" label="Group title" defaultValues={localizedDefaults(defaults?.title)} required />
      <SelectField name="icon" label="Icon" defaultValue={defaults?.icon ?? "code"} options={iconOptions} />
      <TextAreaField
        name="items"
        label="Skills"
        defaultValue={itemsText}
        rows={10}
        required
        hint={'One per line: "Name" or "Name|Level" where level is 1–5, e.g. "Zero Trust / ZTNA|5"'}
        placeholder={"Zero Trust / ZTNA|5\nWazuh SIEM/XDR|5\nPfSense"}
      />
    </AdminForm>
  );
}
