import { getContent } from "@/lib/content";
import { t, tAll } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import type { SectionConfig, SectionVariants } from "@config/sections.config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export async function About({
  locale,
  variant,
  config,
}: {
  locale: Locale;
  variant: SectionVariants["about"];
  config: SectionConfig & { type: "about" };
}) {
  const { about } = await getContent();
  const paragraphs = tAll(about.paragraphs, locale);
  const mid = Math.ceil(paragraphs.length / 2);
  const columns = variant === "columns" ? [paragraphs.slice(0, mid), paragraphs.slice(mid)] : null;

  return (
    <section id="about" className="section-block page-shell">
      <SectionHeading
        eyebrow={config.eyebrow ?? { en: "About", fr: "À propos", mg: "Momba ahy" }}
        title={config.title}
        intro={config.intro}
        locale={locale}
      />
      <Reveal>
        {columns ? (
          <div className="grid gap-12 md:grid-cols-2 items-start">
            {columns.map((group, i) => (
              <div key={i} className="prose-block measure">
                {group.map((p, j) => (
                  <p key={j} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="prose-block measure">
            {paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            {about.quote && (
              <blockquote
                className="mt-6 pl-5 border-l-2 text-lg italic"
                style={{ borderColor: "var(--p-primary)", color: "var(--p-fg)" }}
              >
                {t(about.quote, locale)}
              </blockquote>
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}
