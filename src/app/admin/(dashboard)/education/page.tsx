import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { education } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { t } from "@/lib/i18n/localize";
import { Icon } from "@/components/ui/Icon";
import { DeleteButton } from "@/components/admin/forms/DeleteButton";
import { deleteEducationAction, moveEducationAction } from "./actions";

export default async function EducationListPage() {
  const rows = await db.query.education.findMany({ orderBy: [asc(education.position)] });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="eyebrow mb-2">Content</div>
          <h1 className="text-heading">Education</h1>
        </div>
        <Link href={adminHref("/education/new")} className="btn btn-primary btn-sm">
          <Icon name="graduation" />
          Add entry
        </Link>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--p-fg-muted)" }}>
        Shown on the résumé page.
      </p>

      {rows.length === 0 ? (
        <p style={{ color: "var(--p-fg-subtle)" }}>Nothing yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <div key={row.id} className="card flex items-center gap-4">
              <div className="flex flex-col">
                <form action={moveEducationAction.bind(null, row.id, "up")}>
                  <button type="submit" className="btn-ghost btn-sm px-1.5" disabled={i === 0} aria-label="Move up">
                    ▲
                  </button>
                </form>
                <form action={moveEducationAction.bind(null, row.id, "down")}>
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
              <Icon name="graduation" className="flex-none" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate" style={{ fontFamily: "var(--p-font-display)" }}>
                  {t(row.degree, "en")}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--p-fg-muted)" }}>
                  {row.school} · {row.start}–{row.end}
                </div>
              </div>
              <Link href={adminHref(`/education/${row.id}`)} className="btn-ghost btn-sm">
                Edit
              </Link>
              <DeleteButton
                action={deleteEducationAction.bind(null, row.id)}
                confirmMessage={`Delete the "${row.school}" entry?`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
