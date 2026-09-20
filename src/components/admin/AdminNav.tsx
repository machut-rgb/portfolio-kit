import Link from "next/link";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { AdminNavLinks } from "./AdminNavLinks";
import { logoutAction } from "@/app/admin/actions";

const NAV_GROUPS: { label: string; items: { label: string; icon: string; href: string }[] }[] = [
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
      { label: "Contact form", icon: "mail", href: "/mail" },
      { label: "Sections & layout", icon: "menu", href: "/sections" },
      { label: "Theme", icon: "palette", href: "/theme" },
    ],
  },
];

export function AdminNav({ email }: { email: string }) {
  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, href: adminHref(item.href) })),
  }));

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

      <AdminNavLinks groups={groups} />

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
