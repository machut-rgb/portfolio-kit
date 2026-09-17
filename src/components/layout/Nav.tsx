import Link from "next/link";
import { t } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFullName } from "@/lib/content";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ModeToggle } from "./ModeToggle";
import { MobileMenu } from "./MobileMenu";
import { ThemeStudioTrigger } from "@/components/studio/ThemeStudioTrigger";
import { isStudioEnabled } from "@/lib/theme/studio-visibility";
import { getNavSections, getSiteSettings, getThemeSettings } from "@/lib/settings";

export async function Nav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const siteConfig = await getSiteSettings();
  const themeConfig = await getThemeSettings();
  const items = (await getNavSections()).map((s) => ({
    href: `/${locale}#${s.id}`,
    label: s.navLabel ? t(s.navLabel, locale) : dict.nav[s.id as keyof typeof dict.nav] ?? s.id,
  }));
  const name = await getFullName();

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b"
      style={{
        background: "var(--p-bg-elevated)",
        borderColor: "var(--p-border)",
        backdropFilter: "blur(var(--p-nav-blur))",
        WebkitBackdropFilter: "blur(var(--p-nav-blur))",
      }}
    >
      <a href="#main" className="skip-link">
        {dict.a11y.skipToContent}
      </a>
      <nav className="page-shell flex items-center justify-between gap-4 h-16">
        <Link
          href={`/${locale}`}
          className="font-mono text-sm tracking-[var(--p-tracking-label)]"
          style={{ color: "var(--p-primary)" }}
        >
          <span style={{ color: "var(--p-fg-muted)" }}>{"~/"}</span>
          {name.split(" ")[0]?.toLowerCase()}.dev
        </Link>

        <ul className="hidden md:flex items-center gap-7">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-xs uppercase tracking-[var(--p-tracking-label)] transition-colors"
                style={{ color: "var(--p-fg-muted)" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {siteConfig.features.localeSwitcher && (
            <LocaleSwitcher current={locale} label={dict.a11y.changeLanguage} />
          )}
          <ModeToggle label={dict.a11y.toggleMode} />
          {isStudioEnabled(themeConfig.studio) && <ThemeStudioTrigger label={dict.theme.open} />}
          <MobileMenu items={items} openLabel={dict.nav.menu} closeLabel={dict.nav.close} />
        </div>
      </nav>
    </header>
  );
}
