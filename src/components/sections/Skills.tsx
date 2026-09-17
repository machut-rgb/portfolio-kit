import { getContent } from "@/lib/content";
import { t } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import type { SectionConfig, SectionVariants } from "@config/sections.config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export async function Skills({
  locale,
  variant,
  config,
}: {
  locale: Locale;
  variant: SectionVariants["skills"];
  config: SectionConfig & { type: "skills" };
}) {
  const { skills } = await getContent();

  return (
    <section id="skills" className="section-block page-shell">
      <SectionHeading
        eyebrow={config.eyebrow ?? { en: "Skills", fr: "Compétences", mg: "Fahaiza-manao" }}
        title={config.title}
        intro={config.intro}
        locale={locale}
      />
      <Reveal>
        {variant === "cloud" ? (
          <div className="flex flex-col gap-8">
            {skills.map((group) => (
              <div key={group.id}>
                <h3 className="eyebrow mb-3">{t(group.title, locale)}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item.name} className="tag">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((group) => (
              <div key={group.id}>
                <h3
                  className="flex items-center gap-2 pb-3 mb-4 border-b eyebrow"
                  style={{ borderColor: "var(--p-border)" }}
                >
                  {group.icon && <Icon name={group.icon} />}
                  {t(group.title, locale)}
                </h3>
                {variant === "bars" ? (
                  <div className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: "var(--p-fg)" }}>{item.name}</span>
                        </div>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: "var(--p-surface-alt)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${((item.level ?? 3) / 5) * 100}%`,
                              background: "var(--p-primary)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item.name} className="tag">
                        {item.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
