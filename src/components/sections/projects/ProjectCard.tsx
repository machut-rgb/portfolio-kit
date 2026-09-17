import Link from "next/link";
import { t } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import type { Project } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";

export function ProjectCard({ project, locale, list }: { project: Project; locale: Locale; list?: boolean }) {
  const hasDetail = !!(project.body?.length || project.highlights?.length);
  const className = `card card-interactive relative group ${list ? "flex flex-col md:flex-row md:items-start md:gap-6" : ""}`;

  const inner = <ProjectCardBody project={project} locale={locale} list={list} hasDetail={hasDetail} />;

  if (hasDetail) {
    return (
      <Link href={`/${locale}/projects/${project.slug}`} className={className}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

function ProjectCardBody({
  project,
  locale,
  list,
  hasDetail,
}: {
  project: Project;
  locale: Locale;
  list?: boolean;
  hasDetail: boolean;
}) {
  return (
    <>
      <span
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(90deg, var(--p-gradient-from), var(--p-gradient-to))" }}
      />
      <div className={list ? "md:w-48 flex-none" : ""}>
        <div className="font-mono text-2xs uppercase tracking-[var(--p-tracking-label)] mb-2" style={{ color: "var(--p-accent)" }}>
          {t(project.category, locale)}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-md font-semibold" style={{ fontFamily: "var(--p-font-display)", color: "var(--p-fg)" }}>
            {project.name}
          </h3>
          {hasDetail && (
            <Icon
              name="arrowUpRight"
              className="flex-none opacity-0 group-hover:opacity-100 transition-opacity"
            />
          )}
        </div>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--p-fg-muted)" }}>
          {t(project.summary, locale)}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
