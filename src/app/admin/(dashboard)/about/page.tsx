import { db } from "@/lib/db/client";
import { AdminForm } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { localizedDefaults, localizedListDefaults } from "@/lib/admin/formData";
import { updateAboutAction } from "./actions";

export default async function AboutEditorPage() {
  const row = await db.query.about.findFirst();
  if (!row) {
    return <p style={{ color: "var(--p-danger)" }}>No about row found. Run the seed script first.</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">About</h1>

      <AdminForm action={updateAboutAction}>
        <LocalizedField
          name="paragraphs"
          label="Paragraphs"
          defaultValues={localizedListDefaults(row.paragraphs)}
          multiline
          rows={8}
          hint="One paragraph per line — blank lines are skipped."
          required
        />
        <LocalizedField
          name="quote"
          label="Pull quote (optional)"
          defaultValues={localizedDefaults(row.quote ?? undefined)}
          multiline
          rows={2}
        />
      </AdminForm>
    </div>
  );
}
