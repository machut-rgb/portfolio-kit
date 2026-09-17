import type { Locale } from "@/lib/i18n/config";
import type { SectionConfig } from "@config/sections.config";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Stats } from "@/components/sections/Stats";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";

/**
 * The only place that knows every section component exists. `HomePage`
 * itself just loops over `enabledSections()` and calls this — add a new
 * section type by adding one case here and one entry in
 * `config/sections.config.ts`.
 */
export function renderSection(config: SectionConfig, locale: Locale) {
  switch (config.type) {
    case "hero":
      return <Hero locale={locale} variant={config.variant} />;
    case "about":
      return <About locale={locale} variant={config.variant} config={config} />;
    case "stats":
      return <Stats locale={locale} variant={config.variant} />;
    case "experience":
      return <Experience locale={locale} variant={config.variant} config={config} />;
    case "projects":
      return <Projects locale={locale} variant={config.variant} config={config} />;
    case "skills":
      return <Skills locale={locale} variant={config.variant} config={config} />;
    case "certifications":
      return <Certifications locale={locale} variant={config.variant} config={config} />;
    case "contact":
      return <Contact locale={locale} variant={config.variant} config={config} />;
    default:
      return null;
  }
}
