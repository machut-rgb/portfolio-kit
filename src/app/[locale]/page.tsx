import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getEnabledSections } from "@/lib/settings";
import { renderSection } from "@/components/sections/registry";
import { getContent } from "@/lib/content";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  // Touch content once so a bad edit in the database (or a missing seed)
  // fails the page render immediately (via schema validation in
  // getContent) instead of silently shipping broken data.
  await getContent();
  const sections = await getEnabledSections();

  return (
    <>
      {sections.map((section, i) => (
        <div key={section.id}>
          {section.divider && i > 0 && <div className="page-shell"><div className="hairline" /></div>}
          {renderSection(section, locale)}
        </div>
      ))}
    </>
  );
}
