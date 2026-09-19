import Link from "next/link";
import { getContent, getFullName } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Icon } from "@/components/ui/Icon";
import { getNavSections, getSiteSettings } from "@/lib/settings";

export async function Footer({ locale }: { locale: Locale }) {
  const content = await getContent();
  const dict = getDictionary(locale);
  const name = await getFullName();
  const siteConfig = await getSiteSettings();
  const navItems = (await getNavSections()).slice(0, 3);
  // The resume page was previously unreachable: nothing linked to it and the
  // profile's `resume` field was stored but never rendered. An explicit link
  // here makes both the field and the feature flag meaningful. A custom value
  // (an external PDF, say) wins over the built-in page.
  const resumeHref = siteConfig.features.resume
    ? content.profile.resume || `/${locale}/resume`
    : null;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ borderColor: "var(--p-border)" }}>
      <div className="page-shell py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs" style={{ color: "var(--p-fg-muted)" }}>
          © {year} <span style={{ color: "var(--p-primary)" }}>{name}</span>
        </p>

        <div className="flex items-center gap-5">
          {navItems.map((s) => (
              <Link
                key={s.id}
                href={`/${locale}#${s.id}`}
                className="font-mono text-xs"
                style={{ color: "var(--p-fg-muted)" }}
              >
                {dict.nav[s.id as keyof typeof dict.nav] ?? s.id}
              </Link>
            ))}
          {resumeHref &&
            (resumeHref.startsWith("http") ? (
              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-xs"
                style={{ color: "var(--p-fg-muted)" }}
              >
                {dict.nav.resume}
              </a>
            ) : (
              <Link href={resumeHref} className="font-mono text-xs" style={{ color: "var(--p-fg-muted)" }}>
                {dict.nav.resume}
              </Link>
            ))}
          {content.social.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="font-mono text-xs inline-flex items-center gap-1.5"
              style={{ color: "var(--p-fg-muted)" }}
              aria-label={link.label}
            >
              <Icon name={link.icon} />
              <span className="hidden sm:inline">{link.label}</span>
            </a>
          ))}
          {siteConfig.repository && (
            <a
              href={siteConfig.repository}
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-xs"
              style={{ color: "var(--p-fg-muted)" }}
            >
              {dict.footer.builtWith} GitLab
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
