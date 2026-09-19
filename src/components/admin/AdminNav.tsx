import Link from "next/link";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { logoutAction } from "@/app/admin/actions";

const NAV_GROUPS: { label: string; items: { label: string; icon: string; href?: string }[] }[] = [
  {
    label: "Content",
    items: [
      { label: "Profile", icon: "sparkle", href: "/profile" },
      { label: "About", icon: "code", href: "/about" },
      { label: "Stats", icon: "sparkle", href: "/stats" },
      { label: "Experience", icon: "briefcase", href: "/experience" },
      { label: "Education", icon: "graduation", href: "/education" },
      { label: "Projects", icon: "layers", href: "/projects" },
      { label: "Skills", icon: "network", href: "/skills" },
      { label: "Certifications", icon: "shield", href: "/certifications" },
      { label: "Contact", icon: "mail", href: "/contact" },
      { label: "Social links", icon: "globe", href: "/contact/social" },
    ],
  },
  {
    label: "Site",
    items: [
      { label: "Settings", icon: "globe", href: "/settings" },
      { label: "Sections & layout", icon: "menu", href: "/sections" },
      { label: "Theme", icon: "palette", href: "/theme" },
    ],
  },
];

export function AdminNav({ email }: { email: string }) {
  return (
    <aside
      className="w-64 flex-none border-r flex flex-col h-screen sticky top-0"
      style={{ borderColor: "var(--p-border)" }}
    >
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--p-border)" }}>
        <Link href={adminHref()} className="font-mono text-sm" style={{ color: "var(--p-primary)" }}>
          <span style={{ color: "var(--p-fg-muted)" }}>{"~/"}</span>admin
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="eyebrow px-2 mb-2">{group.label}</div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={adminHref(item.href)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--p-radius-sm)] text-sm transition-colors"
                    style={{ color: "var(--p-fg-muted)" }}
                  >
                    <Icon name={item.icon} className="flex-none" />
                    {item.label}
                  </Link>
                ) : (
                  <span
                    key={item.label}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--p-radius-sm)] text-sm cursor-not-allowed"
                    style={{ color: "var(--p-fg-subtle)" }}
                    title="Coming in the next phase"
                  >
                    <Icon name={item.icon} className="flex-none" />
                    {item.label}
                    <span className="ml-auto text-2xs font-mono" style={{ color: "var(--p-fg-subtle)" }}>
                      soon
                    </span>
                  </span>
                ),
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t flex flex-col gap-2" style={{ borderColor: "var(--p-border)" }}>
        <div className="px-2.5 text-2xs truncate" style={{ color: "var(--p-fg-subtle)" }}>
          {email}
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn-ghost btn-sm w-full justify-start">
            <Icon name="close" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
