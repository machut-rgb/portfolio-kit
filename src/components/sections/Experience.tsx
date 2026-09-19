import { getExperience } from "@/lib/content";
import { t, tAll } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import type { SectionConfig, SectionVariants } from "@config/sections.config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

function formatRange(start: string, end: string | undefined, current: boolean | undefined, locale: Locale) {
  const fmt = (v: string) => {
    const [y, m] = v.split("-");
    if (!m) return y;
    const date = new Date(Number(y), Number(m) - 1, 1);
    return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(date);
  };
  const startLabel = fmt(start)?.toUpperCase();
  const endLabel = current ? { en: "Present", fr: "Présent", mg: "Ankehitriny" }[locale] : end ? fmt(end)?.toUpperCase() : startLabel;
  return `${startLabel} — ${endLabel}`;
}

export async function Experience({
  locale,
  variant,
  config,
}: {
  locale: Locale;
  variant: SectionVariants["experience"];
  config: SectionConfig & { type: "experience" };
}) {
  const items = await getExperience();

  return (
    <section id="experience" className="section-block page-shell">
      <SectionHeading
        eyebrow={config.eyebrow ?? { en: "Experience", fr: "Expérience", mg: "Traikefa" }}
        title={config.title}
        intro={config.intro}
        locale={locale}
      />

      {variant === "timeline" ? (
        <div
          className="relative pl-8 md:pl-10 border-l"
          style={{ borderColor: "var(--p-border)" }}
        >
          {items.map((item) => (
            <Reveal key={item.id} as="div" className="relative mb-12 last:mb-0">
              <span
                className="absolute -left-[calc(2rem+5px)] md:-left-[calc(2.5rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--p-primary)", boxShadow: "0 0 0 4px color-mix(in oklab, var(--p-primary) 18%, transparent)" }}
              />
              <div className="font-mono text-2xs tracking-[var(--p-tracking-label)]" style={{ color: "var(--p-accent)" }}>
                {formatRange(item.start, item.end, item.current, locale)}
              </div>
              <h3 className="text-lg font-semibold mt-1" style={{ fontFamily: "var(--p-font-display)" }}>
                {t(item.role, locale)}
              </h3>
              <div className="text-sm mt-0.5 mb-3" style={{ color: "var(--p-fg-muted)" }}>
                {item.orgUrl ? (
                  <a
                    href={item.orgUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-quiet"
                    style={{ color: "var(--p-primary)" }}
                  >
                    {item.org}
                  </a>
                ) : (
                  <span style={{ color: "var(--p-primary)" }}>{item.org}</span>
                )}{" "}
                · {item.location}
              </div>
              <ul className="space-y-1.5">
                {tAll(item.bullets, locale).map((b, i) => (
                  <li key={i} className="text-sm pl-4 relative measure" style={{ color: "var(--p-fg-muted)" }}>
                    <span className="absolute left-0" style={{ color: "var(--p-primary)" }}>
                      ›
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              {item.stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.stack.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t" style={{ borderColor: "var(--p-border)" }}>
                    <td className="py-4 pr-6 font-mono text-2xs whitespace-nowrap align-top" style={{ color: "var(--p-accent)" }}>
                      {formatRange(item.start, item.end, item.current, locale)}
                    </td>
                    <td className="py-4 pr-6 align-top">
                      <div className="font-semibold" style={{ fontFamily: "var(--p-font-display)", color: "var(--p-fg)" }}>
                        {t(item.role, locale)}
                      </div>
                      <div style={{ color: "var(--p-fg-muted)" }}>
                        {item.org} · {item.location}
                      </div>
                    </td>
                    <td className="py-4 align-top" style={{ color: "var(--p-fg-muted)" }}>
                      {tAll(item.bullets, locale)[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      )}
    </section>
  );
}
