"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

/** Swaps the leading `/[locale]` segment and keeps the rest of the path. */
function withLocale(pathname: string, locale: Locale): string {
  const parts = pathname.split("/");
  parts[1] = locale;
  return parts.join("/") || "/";
}

export function LocaleSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="inline-flex gap-0.5 rounded-[var(--p-radius-sm)] border p-0.5"
      style={{ borderColor: "var(--p-border)", background: "var(--p-surface-alt)" }}
      role="group"
      aria-label={label}
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => router.push(withLocale(pathname, locale))}
          aria-current={locale === current ? "true" : undefined}
          className={cn(
            "px-2.5 py-1 rounded-[var(--p-radius-xs)] text-2xs font-mono tracking-[var(--p-tracking-label)] uppercase transition-colors",
            locale === current ? "bg-primary text-primary-fg" : "text-muted hover:text-fg",
          )}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}
