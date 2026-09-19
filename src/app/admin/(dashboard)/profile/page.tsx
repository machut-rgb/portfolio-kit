import { db } from "@/lib/db/client";
import { AdminForm } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { TextField } from "@/components/admin/forms/Fields";
import { localizedDefaults, localizedListDefaults } from "@/lib/admin/formData";
import { updateProfileAction } from "./actions";

export default async function ProfileEditorPage() {
  const row = await db.query.profile.findFirst();

  return (
    <div className="max-w-2xl">
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">Profile</h1>

      {!row && <EmptyNotice label="profile" />}

      <AdminForm action={updateProfileAction}>
        <div className="grid sm:grid-cols-2 gap-5">
          <TextField name="firstName" label="First name" defaultValue={row?.firstName} required />
          <TextField name="lastName" label="Last name" defaultValue={row?.lastName} required />
        </div>

        <TextField
          name="handle"
          label="Handle"
          defaultValue={row?.handle}
          hint="Shown in the nav, e.g. ~/machut.dev"
        />

        <LocalizedField name="headline" label="Headline" defaultValues={localizedDefaults(row?.headline)} multiline rows={2} required />

        <LocalizedField
          name="roles"
          label="Roles"
          defaultValues={localizedListDefaults(row?.roles)}
          multiline
          rows={4}
          hint="One role per line — the first is shown first in the hero."
          required
        />

        <LocalizedField name="summary" label="Summary" defaultValues={localizedDefaults(row?.summary)} multiline rows={4} required />

        <div className="grid sm:grid-cols-2 gap-5">
          <LocalizedField name="availability" label="Availability" defaultValues={localizedDefaults(row?.availability)} />
          <LocalizedField name="location" label="Location" defaultValues={localizedDefaults(row?.location)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <TextField name="email" label="Email" type="email" defaultValue={row?.email} required />
          <TextField name="phone" label="Phone" type="tel" defaultValue={row?.phone ?? ""} />
        </div>

        <div className="hairline my-2" />
        <div className="eyebrow -mb-2">Photo</div>
        <div className="grid sm:grid-cols-2 gap-5">
          <TextField
            name="photoSrc"
            label="Photo path"
            defaultValue={row?.photoSrc ?? ""}
            hint="e.g. /images/profile.png — upload support is coming later"
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField name="photoWidth" label="Width" type="number" defaultValue={row?.photoWidth?.toString() ?? ""} />
            <TextField name="photoHeight" label="Height" type="number" defaultValue={row?.photoHeight?.toString() ?? ""} />
          </div>
        </div>
        <LocalizedField name="photoAlt" label="Photo alt text" defaultValues={localizedDefaults(row?.photoAlt ?? undefined)} />

        <div className="hairline my-2" />
        <TextField
          name="resume"
          label="Résumé link"
          defaultValue={row?.resume ?? ""}
          hint="Leave blank to use the built-in résumé page. Set a URL to link an external file instead."
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
