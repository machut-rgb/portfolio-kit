import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { ProjectForm } from "../ProjectForm";
import { updateProjectAction } from "../actions";

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await db.query.projects.findFirst({ where: eq(projects.slug, slug) });
  if (!row) notFound();

  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/projects")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Projects
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">
        Edit <span style={{ color: "var(--p-primary)" }}>{row.name}</span>
      </h1>
      <ProjectForm action={updateProjectAction.bind(null, slug)} defaults={row} />
    </div>
  );
}
