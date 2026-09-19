import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { stats } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { t } from "@/lib/i18n/localize";
import { Icon } from "@/components/ui/Icon";
import { StatForm } from "../StatForm";
import { updateStatAction } from "../actions";

export default async function EditStatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.stats.findFirst({ where: eq(stats.id, id) });
  if (!row) notFound();

  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/stats")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Stats
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">
        Edit <span style={{ color: "var(--p-primary)" }}>{t(row.label, "en")}</span>
      </h1>
      <StatForm action={updateStatAction.bind(null, id)} defaults={row} />
    </div>
  );
}
