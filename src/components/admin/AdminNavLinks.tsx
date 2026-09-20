"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";

export interface AdminNavItem {
  label: string;
  icon: string;
  /** Already resolved through `adminHref`, so it includes the secret path. */
  href: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

/**
 * Marks the screen you are on.
 *
 * Matching is longest-prefix rather than exact, so a nested route keeps its
 * own entry lit: `/contact/social` highlights "Social links", not
 * "Contact", even though it sits underneath it. Exact matching would leave
 * every nested screen with nothing highlighted, and plain `startsWith`
 * would light up both.
 */
export function AdminNavLinks({ groups }: { groups: AdminNavGroup[] }) {
  const pathname = usePathname();

  const activeHref = useMemo(() => {
    const matches = groups
      .flatMap((group) => group.items)
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length);
    return matches[0]?.href ?? null;
  }, [groups, pathname]);

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="eyebrow px-2 mb-2">{group.label}</div>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--p-radius-sm)] text-sm transition-colors"
                  style={{
                    color: active ? "var(--p-fg)" : "var(--p-fg-muted)",
                    background: active ? "var(--p-surface-alt)" : "transparent",
                  }}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full"
                      style={{ background: "var(--p-primary)" }}
                    />
                  )}
                  <Icon name={item.icon} className="flex-none" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
