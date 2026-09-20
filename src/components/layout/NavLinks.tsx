"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface NavItem {
  /** Section anchor, e.g. "projects". */
  id: string;
  href: string;
  label: string;
}

/**
 * Highlights the section currently in view.
 *
 * Uses IntersectionObserver with a band across the middle of the viewport
 * rather than scroll maths: a section counts as active while it crosses the
 * middle, which is what a reader perceives as "where I am" and avoids the
 * flicker that top-edge detection causes on short sections.
 *
 * The URL hash is deliberately left alone. Updating it on scroll floods
 * browser history and hijacks the back button.
 */
export function NavLinks({ items, homeHref }: { items: NavItem[]; homeHref: string }) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Anchors only point at sections on the home page. Everywhere else
  // (a project page, the résumé) nothing should be highlighted. Compared
  // against the locale's own home path rather than a pattern, so adding a
  // locale like "pt-BR" cannot silently break the indicator.
  const isHome = pathname === homeHref || pathname === `${homeHref}/`;

  useEffect(() => {
    if (!isHome || typeof IntersectionObserver === "undefined") {
      setActiveId(null);
      return;
    }

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Several sections can straddle the band at once; the first in
        // document order is the one being read.
        const current = items.find((item) => visible.has(item.id));
        setActiveId(current?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [items, isHome, pathname]);

  return (
    <ul className="hidden md:flex items-center gap-7">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "true" : undefined}
              className="relative text-xs uppercase tracking-[var(--p-tracking-label)] transition-colors py-1"
              style={{ color: active ? "var(--p-fg)" : "var(--p-fg-muted)" }}
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-0.5 h-px origin-left transition-transform"
                style={{
                  background: "var(--p-primary)",
                  transform: `scaleX(${active ? 1 : 0})`,
                  transitionDuration: "var(--p-duration)",
                  transitionTimingFunction: "var(--p-easing)",
                }}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
