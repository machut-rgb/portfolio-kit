import type { L } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";

export interface SiteConfig {
  /** Absolute origin, no trailing slash. Drives canonical URLs and OG tags. */
  url: string;
  /** Used in <title> templates and structured data. */
  name: string;
  shortName: string;
  description: L;
  keywords: string[];
  defaultLocale: Locale;
  /** Repository link shown in the footer. Set to null to hide it. */
  repository: string | null;
  features: {
    projectPages: boolean;
    resume: boolean;
    contactForm: boolean;
    localeSwitcher: boolean;
  };
}

export const siteConfig: SiteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  name: "Machut Eliandraza",
  shortName: "machut.dev",
  description: {
    en: "Cybersecurity engineer and full-stack developer in Antananarivo. Zero Trust networks, SOC pipelines, and the applications that run on them.",
    fr: "Ingénieur cybersécurité et développeur full-stack à Antananarivo. Réseaux Zero Trust, pipelines SOC et les applications qui tournent dessus.",
    mg: "Injeniera cybersécurité sy mpamorona full-stack any Antananarivo. Tambajotra Zero Trust, pipeline SOC ary ny rindrambaiko mandeha ao anatiny.",
  },
  keywords: [
    "cybersecurity",
    "zero trust",
    "SOC",
    "Wazuh",
    "network engineer",
    "full-stack developer",
    "Madagascar",
  ],
  defaultLocale: "en",
  repository: "https://gitlab.com/emachut",
  features: {
    projectPages: true,
    resume: true,
    contactForm: true,
    localeSwitcher: true,
  },
};
