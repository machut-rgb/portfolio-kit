import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { t, tAll } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { SectionVariants } from "@config/sections.config";
import { ButtonLink } from "@/components/ui/Button";
import { RolePills } from "./hero/RolePills";

/**
 * Three interchangeable hero layouts. All read the same `profile` content —
 * pick a `variant` in `config/sections.config.ts` and nothing else changes.
 */
export async function Hero({ locale, variant }: { locale: Locale; variant: SectionVariants["hero"] }) {
  const { profile } = await getContent();
  const dict = getDictionary(locale);
  const roles = tAll(profile.roles, locale);

  if (variant === "console") return <HeroConsole locale={locale} roles={roles} />;
  if (variant === "stacked") return <HeroStacked locale={locale} roles={roles} />;
  return <HeroSplit locale={locale} roles={roles} />;

  function HeroSplit({ locale: l, roles: r }: { locale: Locale; roles: string[] }) {
    return (
      <section id="hero" className="relative overflow-hidden pt-28 pb-16 md:pt-40 md:pb-20">
        <div className="layer-grid" />
        <div className="layer-glow" />
        <div className="page-shell relative grid gap-10 md:grid-cols-[1fr_auto] items-center">
          <div className="enter enter-1 order-2 md:order-1">
            <div className="eyebrow mb-5">{t(profile.availability, l)}</div>
            <h1 className="text-hero" style={{ lineHeight: "var(--p-leading-display)" }}>
              <span className="block">{profile.firstName}</span>
              <span className="block text-gradient">{profile.lastName}</span>
            </h1>
            <RolePills roles={r} className="mt-8" />
            <p className="measure mt-8 text-md" style={{ color: "var(--p-fg-muted)" }}>
              {t(profile.summary, l)}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href={`/${l}#contact`} variant="primary">
                {dict.actions.getInTouch}
              </ButtonLink>
              <ButtonLink href={`/${l}#projects`} variant="outline">
                {dict.actions.viewProjects}
              </ButtonLink>
            </div>
          </div>
          <HeroPhoto locale={l} className="order-1 md:order-2" />
        </div>
      </section>
    );
  }

  function HeroStacked({ locale: l, roles: r }: { locale: Locale; roles: string[] }) {
    return (
      <section id="hero" className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24 text-center">
        <div className="layer-grid" />
        <div className="layer-glow" />
        <div className="page-shell relative flex flex-col items-center">
          <HeroPhoto locale={l} rounded className="mb-8 enter" />
          <div className="eyebrow mb-5 justify-center">{t(profile.availability, l)}</div>
          <h1 className="text-hero">
            {profile.firstName} <span className="text-gradient">{profile.lastName}</span>
          </h1>
          <RolePills roles={r} className="mt-7 justify-center" />
          <p className="measure mt-7 text-md mx-auto" style={{ color: "var(--p-fg-muted)" }}>
            {t(profile.summary, l)}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={`/${l}#contact`} variant="primary">
              {dict.actions.getInTouch}
            </ButtonLink>
            <ButtonLink href={`/${l}#projects`} variant="outline">
              {dict.actions.viewProjects}
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  function HeroConsole({ locale: l, roles: r }: { locale: Locale; roles: string[] }) {
    return (
      <section id="hero" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="layer-grid" />
        <div className="page-shell relative">
          <div
            className="card font-mono text-sm max-w-2xl"
            style={{ borderColor: "var(--p-border-strong)" }}
          >
            <div className="flex items-center gap-1.5 pb-3 mb-4 border-b" style={{ borderColor: "var(--p-border)" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--p-danger)" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--p-warning)" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--p-success)" }} />
              <span className="ml-3 text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
                whoami
              </span>
            </div>
            <p style={{ color: "var(--p-accent)" }}>
              $ whoami
            </p>
            <h1 className="text-heading mt-2 mb-1 font-mono" style={{ fontFamily: "var(--p-font-display)" }}>
              {profile.firstName} {profile.lastName}
            </h1>
            <p style={{ color: "var(--p-fg-muted)" }}>{r.join(" · ")}</p>
            <p className="mt-4" style={{ color: "var(--p-accent)" }}>
              $ cat summary.txt
            </p>
            <p className="mt-2 measure">{t(profile.summary, l)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`/${l}#contact`} variant="primary" size="sm">
                {dict.actions.getInTouch}
              </ButtonLink>
              <ButtonLink href={`/${l}#projects`} variant="outline" size="sm">
                {dict.actions.viewProjects}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function HeroPhoto({ locale: l, rounded, className }: { locale: Locale; rounded?: boolean; className?: string }) {
    if (!profile.photo) return null;
    return (
      <div
        className={`relative flex-none w-[220px] h-[260px] md:w-[260px] md:h-[300px] ${rounded ? "rounded-full overflow-hidden" : ""} ${className ?? ""}`}
      >
        {!rounded && (
          <div
            className="absolute -inset-[3px] rounded-[var(--p-radius-lg)]"
            style={{ background: "linear-gradient(135deg, var(--p-gradient-from), var(--p-gradient-to))" }}
          />
        )}
        <div
          className={`relative w-full h-full ${rounded ? "rounded-full" : "rounded-[var(--p-radius-lg)]"} overflow-hidden`}
          style={{ background: "var(--p-surface-alt)" }}
        >
          <Image
            src={profile.photo.src}
            alt={t(profile.photo.alt, l)}
            fill
            sizes="(max-width: 768px) 220px, 260px"
            className="object-cover object-top"
            priority
          />
        </div>
      </div>
    );
  }
}
