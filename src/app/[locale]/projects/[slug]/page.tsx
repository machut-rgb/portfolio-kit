import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getContent, getProject } from "@/lib/content";
import { t, tAll } from "@/lib/i18n/localize";
import { getSiteSettings } from "@/lib/settings";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";

export async function generateStaticParams() {
  const { projects } = await getContent();
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const project = await getProject(slug);
  if (!project) return {};
  const description = t(project.summary, locale);
  const siteConfig = await getSiteSettings();
  return {
    title: project.name,
    description,
    alternates: { canonical: `${siteConfig.url}/${locale}/projects/${slug}` },
    openGraph: { title: project.name, description, type: "article" },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const { features } = await getSiteSettings();
  if (!features.projectPages) notFound();

  const project = await getProject(slug);
  if (!project) notFound();

  const dict = getDictionary(locale);
  const body = tAll(project.body, locale);
  const highlights = tAll(project.highlights, locale);

  return (
    <article className="section-block page-shell max-w-3xl">
      <Link href={`/${locale}#projects`} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-8">
        <Icon name="chevronRight" className="rotate-180" />
        {dict.actions.backToProjects}
      </Link>

      <div className="eyebrow mb-3">{t(project.category, locale)}</div>
      <h1 className="text-heading mb-4">{project.name}</h1>
      <div className="flex flex-wrap items-center gap-3 mb-8 text-sm" style={{ color: "var(--p-fg-muted)" }}>
        <span>{project.year}</span>
        {project.role && (
          <>
            <span aria-hidden="true">·</span>
            <span>{t(project.role, locale)}</span>
          </>
        )}
      </div>

      <p className="text-md measure" style={{ color: "var(--p-fg)" }}>
        {t(project.summary, locale)}
      </p>

      {body.length > 0 && (
        <div className="prose-block measure mt-8">
          {body.map((p, i) => (
            <p key={i} style={{ color: "var(--p-fg-muted)" }}>
              {p}
            </p>
          ))}
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-8">
          <h2 className="eyebrow mb-3">{dict.projects.highlights}</h2>
          <ul className="space-y-2">
            {highlights.map((h, i) => (
              <li key={i} className="text-sm flex gap-2 measure" style={{ color: "var(--p-fg-muted)" }}>
                <Icon name="check" className="flex-none mt-0.5" style={{ color: "var(--p-success)" }} />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mt-8">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-8">
        {project.links?.repo && (
          <ButtonLink href={project.links.repo} variant="outline" size="sm" icon="git">
            {dict.actions.openSource}
          </ButtonLink>
        )}
        {project.links?.demo && (
          <ButtonLink href={project.links.demo} variant="outline" size="sm" icon="arrowUpRight">
            {dict.actions.liveDemo}
          </ButtonLink>
        )}
        {project.links?.writeup && (
          <ButtonLink href={project.links.writeup} variant="outline" size="sm" icon="arrowUpRight">
            {dict.actions.readMore}
          </ButtonLink>
        )}
      </div>

      {project.links?.sourcePrivate && (
        <p className="text-sm mt-4 flex items-center gap-2" style={{ color: "var(--p-fg-subtle)" }}>
          <Icon name="shield" className="flex-none" />
          {project.links.sourceNote || dict.projects.sourcePrivate}
        </p>
      )}
    </article>
  );
}
