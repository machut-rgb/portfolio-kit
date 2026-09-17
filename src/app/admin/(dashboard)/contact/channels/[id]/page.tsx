import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { contactChannels } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { t } from "@/lib/i18n/localize";
import { Icon } from "@/components/ui/Icon";
import { ChannelForm } from "../ChannelForm";
import { updateChannelAction } from "../../actions";

export default async function EditChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.contactChannels.findFirst({ where: eq(contactChannels.id, id) });
  if (!row) notFound();

  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/contact/channels")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Channels
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">
        Edit <span style={{ color: "var(--p-primary)" }}>{t(row.label, "en")}</span>
      </h1>
      <ChannelForm action={updateChannelAction.bind(null, id)} defaults={row} />
    </div>
  );
}
