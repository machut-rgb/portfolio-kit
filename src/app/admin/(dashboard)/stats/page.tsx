import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { stats } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { t } from "@/lib/i18n/localize";
import { Icon } from "@/components/ui/Icon";
import { DeleteButton } from "@/components/admin/forms/DeleteButton";
import { deleteStatAction, moveStatAction } from "./actions";

export default async function StatsListPage() {
  const rows = await db.query.stats.findMany({ orderBy: [asc(stats.position)] });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="eyebrow mb-2">Content</div>
          <h1 className="text-heading">Stats</h1>
        </div>
        <Link href={adminHref("/stats/new")} className="btn btn-primary btn-sm">
          <Icon name="sparkle" />
          Add stat
        </Link>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--p-fg-muted)" }}>
        The figures shown near the top of the home page.
      </p>

      {rows.length === 0 ? (
        <p style={{ color: "var(--p-fg-subtle)" }}>Nothing yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <div key={row.id} className="card flex items-center gap-4">
              <div className="flex flex-col">
                <form action={moveStatAction.bind(null, row.id, "up")}>
                  <button type="submit" className="btn-ghost btn-sm px-1.5" disabled={i === 0} aria-label="Move up">
                    ▲
                  </button>
                </form>
                <form action={moveStatAction.bind(null, row.id, "down")}>
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
              <div
                className="text-lg font-bold flex-none w-16 text-center"
                style={{ fontFamily: "var(--p-font-display)", color: "var(--p-primary)" }}
              >
                {row.value}
              </div>
              <div className="flex-1 min-w-0 text-sm truncate" style={{ color: "var(--p-fg-muted)" }}>
                {t(row.label, "en")}
              </div>
              <Link href={adminHref(`/stats/${row.id}`)} className="btn-ghost btn-sm">
                Edit
              </Link>
              <DeleteButton
                action={deleteStatAction.bind(null, row.id)}
                confirmMessage={`Delete the "${t(row.label, "en")}" stat?`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
