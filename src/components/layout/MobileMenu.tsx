"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

export function MobileMenu({
  items,
  openLabel,
  closeLabel,
}: {
  items: { id: string; href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="btn-ghost w-9 h-9 inline-flex items-center justify-center rounded-[var(--p-radius-sm)]"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>

      {open && (
        <div
          className={cn(
            "fixed inset-0 top-[64px] z-40 flex flex-col p-6 gap-1",
          )}
          style={{ background: "var(--p-bg)" }}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setOpen(false);
                setActive(item.id);
              }}
              aria-current={active === item.id ? "true" : undefined}
              className="py-3 text-lg border-b flex items-center justify-between"
              style={{
                borderColor: "var(--p-border)",
                color: active === item.id ? "var(--p-primary)" : "var(--p-fg)",
              }}
            >
              {item.label}
              {active === item.id && (
                <span aria-hidden="true" className="text-sm">
                  &bull;
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
