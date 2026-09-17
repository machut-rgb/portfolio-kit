import { getContent } from "@/lib/content";
import { t } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import type { SectionVariants } from "@config/sections.config";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Rendered only for section variants that pull stats out of `About` and give
 * them their own strip — the `columns` About variant already shows stats
 * inline, so this section stays empty in that configuration.
 */
export async function Stats({ locale, variant }: { locale: Locale; variant: SectionVariants["stats"] }) {
  const { stats } = await getContent();

  return (
    <div className="page-shell -mt-2 mb-2">
      <Reveal>
        <div
          className={
            variant === "grid"
              ? "grid grid-cols-2 md:grid-cols-4 gap-4"
              : "flex flex-wrap gap-x-10 gap-y-4"
          }
        >
          {stats.map((stat) => (
            <div key={stat.id} className={variant === "grid" ? "card text-center" : ""}>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--p-font-display)", color: "var(--p-primary)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-[var(--p-tracking-label)] mt-1" style={{ color: "var(--p-fg-muted)" }}>
                {t(stat.label, locale)}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
