import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { auditLog, sessions } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/guard";

function timeAgo(date: Date): string {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default async function DashboardPage() {
  const session = await requireSession();

  const [recentActivity, activeSessions] = await Promise.all([
    db.query.auditLog.findMany({ orderBy: [desc(auditLog.createdAt)], limit: 10 }),
    db.query.sessions.findMany({ where: eq(sessions.userId, session.id) }),
  ]);

  return (
    <div className="max-w-3xl">
      <div className="eyebrow mb-2">Dashboard</div>
      <h1 className="text-heading mb-1">Signed in as {session.email}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--p-fg-muted)" }}>
        Auth and the database are wired up end to end. Content management —
        profile, projects, experience, and the rest — lands in the next
        phase; this confirms the foundation it'll sit on.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <div className="card">
          <div className="text-2xl font-bold" style={{ fontFamily: "var(--p-font-display)", color: "var(--p-primary)" }}>
            {activeSessions.length}
          </div>
          <div className="text-xs uppercase tracking-[var(--p-tracking-label)] mt-1" style={{ color: "var(--p-fg-muted)" }}>
            Active session{activeSessions.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold" style={{ fontFamily: "var(--p-font-display)", color: "var(--p-primary)" }}>
            {recentActivity.length}
          </div>
          <div className="text-xs uppercase tracking-[var(--p-tracking-label)] mt-1" style={{ color: "var(--p-fg-muted)" }}>
            Recent audit entries
          </div>
        </div>
      </div>

      <h2 className="eyebrow mb-3">Recent activity</h2>
      <div className="card p-0 overflow-hidden">
        {recentActivity.length === 0 ? (
          <p className="text-sm p-5" style={{ color: "var(--p-fg-subtle)" }}>
            Nothing logged yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {recentActivity.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0" style={{ borderColor: "var(--p-border)" }}>
                  <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--p-accent)" }}>
                    {entry.action}
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--p-fg-muted)" }}>
                    {entry.ipHint || "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs" style={{ color: "var(--p-fg-subtle)" }}>
                    {timeAgo(entry.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
