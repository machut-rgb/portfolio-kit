import { db } from "@/lib/db/client";
import { AdminForm } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { localizedDefaults, localizedListDefaults } from "@/lib/admin/formData";
import { updateAboutAction } from "./actions";

export default async function AboutEditorPage() {
  const row = await db.query.about.findFirst();

  return (
    <div className="max-w-2xl">
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">About</h1>

      {!row && <EmptyNotice label="about section" />}

      <AdminForm action={updateAboutAction}>
        <LocalizedField
          name="paragraphs"
          label="Paragraphs"
          defaultValues={localizedListDefaults(row?.paragraphs)}
          multiline
          rows={8}
          hint="One paragraph per line — blank lines are skipped."
          required
        />
        <LocalizedField
          name="quote"
          label="Pull quote (optional)"
          defaultValues={localizedDefaults(row?.quote ?? undefined)}
          multiline
          rows={2}
        />
      </AdminForm>
    </div>
  );
}

/** Shown when the row does not exist yet. The form still renders with empty
 *  fields, because saving it is what creates the row. */
function EmptyNotice({ label }: { label: string }) {
  return (
    <p
      className="card mb-6 text-sm"
      style={{ borderColor: "var(--p-warning)", color: "var(--p-fg-muted)" }}
    >
      No {label} saved yet. Fill this in and save to create it.
    </p>
  );
}
