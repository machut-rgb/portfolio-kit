import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { DeleteButton } from "@/components/admin/forms/DeleteButton";
import { deleteProjectAction, moveProjectAction } from "./actions";

export default async function ProjectsListPage() {
  const rows = await db.query.projects.findMany({ orderBy: [asc(projects.position)] });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-2">Content</div>
          <h1 className="text-heading">Projects</h1>
        </div>
        <Link href={adminHref("/projects/new")} className="btn btn-primary btn-sm">
          <Icon name="layers" />
          Add project
        </Link>
      </div>

      {rows.length === 0 ? (
        <p style={{ color: "var(--p-fg-subtle)" }}>Nothing yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <div key={row.slug} className="card flex items-center gap-4">
              <div className="flex flex-col">
                <form action={moveProjectAction.bind(null, row.slug, "up")}>
                  <button type="submit" className="btn-ghost btn-sm px-1.5" disabled={i === 0} aria-label="Move up">
                    ▲
                  </button>
                </form>
                <form action={moveProjectAction.bind(null, row.slug, "down")}>
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
                <div className="font-semibold text-sm truncate flex items-center gap-2" style={{ fontFamily: "var(--p-font-display)" }}>
                  {row.name}
                  {row.featured && (
                    <span className="tag" style={{ color: "var(--p-primary)", borderColor: "var(--p-primary)" }}>
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--p-fg-muted)" }}>
                  {row.year} · {row.status ?? "live"} · {row.slug}
                </div>
              </div>

              <Link href={adminHref(`/projects/${row.slug}`)} className="btn-ghost btn-sm">
                Edit
              </Link>
              <DeleteButton
                action={deleteProjectAction.bind(null, row.slug)}
                confirmMessage={`Delete "${row.name}"?`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
