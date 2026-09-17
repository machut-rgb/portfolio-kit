import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { socialLinks } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { AdminForm } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { TextAreaField } from "@/components/admin/forms/Fields";
import { localizedDefaults } from "@/lib/admin/formData";
import { Icon } from "@/components/ui/Icon";
import { updateContactAction } from "./actions";

export default async function ContactEditorPage() {
  const [row, links] = await Promise.all([
    db.query.contact.findFirst(),
    db.query.socialLinks.findMany({ orderBy: [asc(socialLinks.position)] }),
  ]);
  if (!row) {
    return <p style={{ color: "var(--p-danger)" }}>No contact row found. Run the seed script first.</p>;
  }

  const socialText = links.map((l) => [l.label, l.href, l.icon, l.handle ?? ""].join("|")).join("\n");

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-2">Content</div>
          <h1 className="text-heading">Contact</h1>
        </div>
        <Link href={adminHref("/contact/channels")} className="btn btn-outline btn-sm">
          <Icon name="mail" />
          Manage channels
        </Link>
      </div>

      <AdminForm action={updateContactAction}>
        <LocalizedField name="heading" label="Heading" defaultValues={localizedDefaults(row.heading)} required />
        <LocalizedField name="body" label="Body" defaultValues={localizedDefaults(row.body)} multiline rows={3} required />

        <div className="hairline my-2" />
        <div className="eyebrow -mb-2">Social links</div>
        <TextAreaField
          name="social"
          label="One per line"
          defaultValue={socialText}
          rows={6}
          hint='Format: Label|https://url|icon|handle — handle is optional. Icon names come from config/icons.config.ts.'
          placeholder={"GitLab|https://gitlab.com/you|git|you\nLinkedIn|https://linkedin.com/in/you|linkedin"}
        />
      </AdminForm>
    </div>
  );
}
