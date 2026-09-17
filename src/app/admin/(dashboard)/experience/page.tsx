import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { experience } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { t } from "@/lib/i18n/localize";
import { Icon } from "@/components/ui/Icon";
import { DeleteButton } from "@/components/admin/forms/DeleteButton";
import { deleteExperienceAction, moveExperienceAction } from "./actions";

export default async function ExperienceListPage() {
  const rows = await db.query.experience.findMany({ orderBy: [asc(experience.position)] });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-2">Content</div>
          <h1 className="text-heading">Experience</h1>
        </div>
        <Link href={adminHref("/experience/new")} className="btn btn-primary btn-sm">
          <Icon name="briefcase" />
          Add role
        </Link>
      </div>

      {rows.length === 0 ? (
        <p style={{ color: "var(--p-fg-subtle)" }}>Nothing yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <div key={row.id} className="card flex items-center gap-4">
              <div className="flex flex-col">
                <form action={moveExperienceAction.bind(null, row.id, "up")}>
                  <button type="submit" className="btn-ghost btn-sm px-1.5" disabled={i === 0} aria-label="Move up">
                    ▲
                  </button>
                </form>
                <form action={moveExperienceAction.bind(null, row.id, "down")}>
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

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate" style={{ fontFamily: "var(--p-font-display)" }}>
                  {t(row.role, "en")} <span style={{ color: "var(--p-fg-subtle)" }}>·</span> {row.org}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--p-fg-muted)" }}>
                  {row.start} — {row.current ? "Present" : row.end || "—"}
                </div>
              </div>

              <Link href={adminHref(`/experience/${row.id}`)} className="btn-ghost btn-sm">
                Edit
              </Link>
              <DeleteButton
                action={deleteExperienceAction.bind(null, row.id)}
                confirmMessage={`Delete the "${row.org}" entry?`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
