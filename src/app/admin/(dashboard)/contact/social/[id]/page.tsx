import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { socialLinks } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { SocialLinkForm } from "../SocialLinkForm";
import { updateSocialLinkAction } from "../actions";

export default async function EditSocialLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.socialLinks.findFirst({ where: eq(socialLinks.id, id) });
  if (!row) notFound();

  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/contact/social")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Social links
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">
        Edit <span style={{ color: "var(--p-primary)" }}>{row.label}</span>
      </h1>
      <SocialLinkForm action={updateSocialLinkAction.bind(null, id)} defaults={row} />
    </div>
  );
}
