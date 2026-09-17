import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { experience } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { ExperienceForm } from "../ExperienceForm";
import { updateExperienceAction } from "../actions";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.experience.findFirst({ where: eq(experience.id, id) });
  if (!row) notFound();

  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/experience")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Experience
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">
        Edit <span style={{ color: "var(--p-primary)" }}>{row.org}</span>
      </h1>
      <ExperienceForm action={updateExperienceAction.bind(null, id)} defaults={row} />
    </div>
  );
}
