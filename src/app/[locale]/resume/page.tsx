import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteSettings } from "@/lib/settings";
import { getContent, getExperience, getFullName, getPrimaryRole } from "@/lib/content";
import { t, tAll } from "@/lib/i18n/localize";

export const metadata: Metadata = { title: "Résumé", robots: { index: false } };

export default async function ResumePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const { features } = await getSiteSettings();
  if (!features.resume) notFound();

  const content = await getContent();
  const dict = getDictionary(locale);
  const experience = await getExperience();
  const name = await getFullName();
  const primaryRole = await getPrimaryRole(locale);

  return (
    <div className="page-shell max-w-3xl py-16">
      <div className="no-print mb-8 flex justify-end">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          data-print-trigger
        >
          {dict.actions.print}
        </button>
      </div>

      <header className="mb-10">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--p-font-display)" }}>
          {name}
        </h1>
        <p className="text-md mt-1" style={{ color: "var(--p-primary)" }}>
          {primaryRole}
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--p-fg-muted)" }}>
          {t(content.profile.location, locale)} · {content.profile.email}
        </p>
      </header>

      <section className="mb-10">
        <h2 className="eyebrow mb-3">{dict.nav.about}</h2>
        <div className="prose-block measure">
          {tAll(content.about.paragraphs, locale).map((p, i) => (
            <p key={i} className="text-sm" style={{ color: "var(--p-fg-muted)" }} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="eyebrow mb-4">{dict.nav.experience}</h2>
        <div className="flex flex-col gap-6">
          {experience.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-baseline flex-wrap gap-x-3">
                <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--p-font-display)" }}>
                  {t(item.role, locale)} · {item.org}
                </h3>
                <span className="text-2xs font-mono" style={{ color: "var(--p-fg-subtle)" }}>
                  {item.start} — {item.current ? "—" : item.end}
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {tAll(item.bullets, locale).map((b, i) => (
                  <li key={i} className="text-sm" style={{ color: "var(--p-fg-muted)" }}>
                    · {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="eyebrow mb-4">{dict.nav.skills}</h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {content.skills.map((group) => (
            <p key={group.id} className="text-sm">
              <strong>{t(group.title, locale)}:</strong>{" "}
              <span style={{ color: "var(--p-fg-muted)" }}>{group.items.map((i) => i.name).join(", ")}</span>
            </p>
          ))}
        </div>
      </section>

      {content.education.length > 0 && (
        <section>
          <h2 className="eyebrow mb-4">Education</h2>
          {content.education.map((edu) => (
            <div key={edu.id} className="text-sm">
              <strong>{t(edu.degree, locale)}</strong> — {edu.school}, {edu.location} ({edu.start}–{edu.end})
              {edu.note && (
                <div style={{ color: "var(--p-fg-muted)" }}>{t(edu.note, locale)}</div>
              )}
            </div>
          ))}
        </section>
      )}

      <script
        dangerouslySetInnerHTML={{
          __html: `document.querySelector('[data-print-trigger]')?.addEventListener('click',()=>window.print());`,
        }}
      />
    </div>
  );
}
