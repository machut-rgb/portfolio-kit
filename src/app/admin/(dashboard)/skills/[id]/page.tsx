import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { skillGroups, skillItems } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { t } from "@/lib/i18n/localize";
import { Icon } from "@/components/ui/Icon";
import { SkillGroupForm } from "../SkillGroupForm";
import { updateSkillGroupAction } from "../actions";

export default async function EditSkillGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row, items] = await Promise.all([
    db.query.skillGroups.findFirst({ where: eq(skillGroups.id, id) }),
    db.query.skillItems.findMany({ where: eq(skillItems.groupId, id), orderBy: [asc(skillItems.position)] }),
  ]);
  if (!row) notFound();

  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/skills")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Skills
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">
        Edit <span style={{ color: "var(--p-primary)" }}>{t(row.title, "en")}</span>
      </h1>
      <SkillGroupForm action={updateSkillGroupAction.bind(null, id)} defaults={row} items={items} />
    </div>
  );
}
