import Link from "next/link";
import { db } from "@/lib/db/client";
import { adminHref } from "@/lib/auth/config";
import { AdminForm } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { localizedDefaults } from "@/lib/admin/formData";
import { Icon } from "@/components/ui/Icon";
import { updateContactAction } from "./actions";

export default async function ContactEditorPage() {
  const row = await db.query.contact.findFirst();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-2">Content</div>
          <h1 className="text-heading">Contact</h1>
        </div>
        <div className="flex gap-2">
          <Link href={adminHref("/contact/channels")} className="btn btn-outline btn-sm">
            <Icon name="mail" />
            Channels
          </Link>
          <Link href={adminHref("/contact/social")} className="btn btn-outline btn-sm">
            <Icon name="globe" />
            Social links
          </Link>
        </div>
      </div>

      <AdminForm action={updateContactAction}>
        <LocalizedField name="heading" label="Heading" defaultValues={localizedDefaults(row?.heading)} required />
        <LocalizedField name="body" label="Body" defaultValues={localizedDefaults(row?.body)} multiline rows={3} required />

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
