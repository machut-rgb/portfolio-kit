import { getContent } from "@/lib/content";
import { t } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import type { SectionConfig, SectionVariants } from "@config/sections.config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export async function Certifications({
  locale,
  variant,
  config,
}: {
  locale: Locale;
  variant: SectionVariants["certifications"];
  config: SectionConfig & { type: "certifications" };
}) {
  const { certifications } = await getContent();
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="section-block page-shell">
      <SectionHeading
        eyebrow={config.eyebrow ?? { en: "Certifications", fr: "Certifications", mg: "Fanamarinana" }}
        title={config.title}
        intro={config.intro}
        locale={locale}
      />
      <Reveal>
        <div className={variant === "cards" ? "grid gap-5 sm:grid-cols-2" : "flex flex-col divide-y"} style={variant === "list" ? { borderColor: "var(--p-border)" } as never : undefined}>
          {certifications.map((cert) =>
            variant === "cards" ? (
              <div key={cert.id} className="card flex gap-4 items-start">
                <div
                  className="w-10 h-10 rounded-[var(--p-radius-sm)] flex items-center justify-center flex-none"
                  style={{ background: "var(--p-surface-alt)", color: "var(--p-accent)" }}
                >
                  <Icon name={cert.icon ?? "sparkle"} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ fontFamily: "var(--p-font-display)" }}>
                    {t(cert.name, locale)}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--p-accent)" }}>
                    {cert.issuer} · {cert.year}
                  </div>
                  <p className="text-sm mt-2" style={{ color: "var(--p-fg-muted)" }}>
                    {t(cert.description, locale)}
                  </p>
                </div>
              </div>
            ) : (
              <div key={cert.id} className="py-4 flex items-center gap-4" style={{ borderColor: "var(--p-border)" }}>
                <Icon name={cert.icon ?? "sparkle"} className="flex-none" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{t(cert.name, locale)}</div>
                  <div className="text-xs" style={{ color: "var(--p-fg-muted)" }}>
                    {cert.issuer}
                  </div>
                </div>
                <div className="text-xs font-mono" style={{ color: "var(--p-accent)" }}>
                  {cert.year}
                </div>
              </div>
            ),
          )}
        </div>
      </Reveal>
    </section>
  );
}
