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
  /** Path to an uploaded favicon, or null to use no icon. */
  faviconSrc: string | null;
  mail: {
    provider: "console" | "smtp" | "resend" | "webhook";
    recipient: string;
    rateLimit: number;
    rateWindowSeconds: number;
  };
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
  faviconSrc: null,
  // Seeded from the environment on first run, then editable in the admin.
  mail: {
    provider: (process.env.MAIL_PROVIDER as "console" | "smtp" | "resend" | "webhook") || "console",
    recipient: process.env.MAIL_TO || "",
    rateLimit: Number(process.env.CONTACT_RATE_LIMIT || 5),
    rateWindowSeconds: Number(process.env.CONTACT_RATE_WINDOW_SECONDS || 3600),
  },
  features: {
    projectPages: true,
    resume: true,
    contactForm: true,
    localeSwitcher: true,
  },
};
