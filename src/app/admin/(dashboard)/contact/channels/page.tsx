import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { contactChannels } from "@/lib/db/schema";
import { adminHref } from "@/lib/auth/config";
import { t } from "@/lib/i18n/localize";
import { Icon } from "@/components/ui/Icon";
import { DeleteButton } from "@/components/admin/forms/DeleteButton";
import { deleteChannelAction, moveChannelAction } from "../actions";

export default async function ChannelsListPage() {
  const rows = await db.query.contactChannels.findMany({ orderBy: [asc(contactChannels.position)] });

  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/contact")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Contact
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading">Contact channels</h1>
        <Link href={adminHref("/contact/channels/new")} className="btn btn-primary btn-sm">
          <Icon name="mail" />
          Add channel
        </Link>
      </div>

      {rows.length === 0 ? (
        <p style={{ color: "var(--p-fg-subtle)" }}>Nothing yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <div key={row.id} className="card flex items-center gap-4">
              <div className="flex flex-col">
                <form action={moveChannelAction.bind(null, row.id, "up")}>
                  <button type="submit" className="btn-ghost btn-sm px-1.5" disabled={i === 0} aria-label="Move up">
                    ▲
                  </button>
                </form>
                <form action={moveChannelAction.bind(null, row.id, "down")}>
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
                <div className="font-semibold text-sm truncate" style={{ fontFamily: "var(--p-font-display)" }}>
                  {t(row.label, "en")}
                </div>
                <div className="text-xs mt-0.5 truncate" style={{ color: "var(--p-fg-muted)" }}>
                  {t(row.value, "en")}
                </div>
              </div>
              <Link href={adminHref(`/contact/channels/${row.id}`)} className="btn-ghost btn-sm">
                Edit
              </Link>
              <DeleteButton
                action={deleteChannelAction.bind(null, row.id)}
                confirmMessage={`Delete the "${t(row.label, "en")}" channel?`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
