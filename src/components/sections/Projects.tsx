import { getProjects, getProjectTags } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { SectionConfig, SectionVariants } from "@config/sections.config";
import { getSiteSettings } from "@/lib/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectGrid } from "./projects/ProjectGrid";
import { ButtonLink } from "@/components/ui/Button";

export async function Projects({
  locale,
  variant,
  config,
}: {
  locale: Locale;
  variant: SectionVariants["projects"];
  config: SectionConfig & { type: "projects" };
}) {
  const projects = await getProjects();
  const tags = await getProjectTags();
  const dict = getDictionary(locale);
  const siteConfig = await getSiteSettings();

  return (
    <section id="projects" className="section-block page-shell">
      <SectionHeading
        eyebrow={config.eyebrow ?? { en: "Projects", fr: "Projets", mg: "Tetikasa" }}
        title={config.title}
        intro={config.intro}
        locale={locale}
      />
      <Reveal>
        <ProjectGrid
          projects={projects}
          tags={tags}
          locale={locale}
          variant={variant}
          allLabel={dict.projects.all}
          detailPagesEnabled={siteConfig.features.projectPages}
        />
      </Reveal>
      {siteConfig.repository && (
        <div className="mt-10 text-center">
          <ButtonLink href={siteConfig.repository} variant="outline" icon="arrowUpRight">
            {dict.actions.viewAll}
          </ButtonLink>
        </div>
      )}
    </section>
  );
}
