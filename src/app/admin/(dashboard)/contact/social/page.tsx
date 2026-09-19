import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { socialLinks } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { DeleteButton } from "@/components/admin/forms/DeleteButton";
import { deleteSocialLinkAction, moveSocialLinkAction } from "./actions";

export default async function SocialLinksPage() {
  const rows = await db.query.socialLinks.findMany({ orderBy: [asc(socialLinks.position)] });

  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/contact")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Contact
      </Link>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-heading">Social links</h1>
        <Link href={adminHref("/contact/social/new")} className="btn btn-primary btn-sm">
          <Icon name="globe" />
          Add link
        </Link>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--p-fg-muted)" }}>
        Shown in the footer, in this order.
      </p>

      {rows.length === 0 ? (
        <p style={{ color: "var(--p-fg-subtle)" }}>No links yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <div key={row.id} className="card flex items-center gap-4">
              <div className="flex flex-col">
                <form action={moveSocialLinkAction.bind(null, row.id, "up")}>
                  <button type="submit" className="btn-ghost btn-sm px-1.5" disabled={i === 0} aria-label="Move up">
                    ▲
                  </button>
                </form>
                <form action={moveSocialLinkAction.bind(null, row.id, "down")}>
                  <button
                    type="submit"
                    className="btn-ghost btn-sm px-1.5"
                    disabled={i === rows.length - 1}
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </form>
              </div>

              <Icon name={row.icon} className="flex-none" />

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ fontFamily: "var(--p-font-display)" }}>
                  {row.label}
                  {row.handle && (
                    <span className="font-normal ml-2 text-xs" style={{ color: "var(--p-fg-subtle)" }}>
                      {row.handle}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5 truncate font-mono" style={{ color: "var(--p-fg-muted)" }}>
                  {row.href}
                </div>
              </div>

              <Link href={adminHref(`/contact/social/${row.id}`)} className="btn-ghost btn-sm">
                Edit
              </Link>
              <DeleteButton
                action={deleteSocialLinkAction.bind(null, row.id)}
                confirmMessage={`Remove the "${row.label}" link?`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
