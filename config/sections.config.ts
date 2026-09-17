import type { L } from "@/lib/i18n/localize";

/**
 * The home page is a list, not a template.
 *
 * Reorder these entries and the page reorders. Flip `enabled` and a section
 * disappears from the page, the nav, the command palette and the sitemap.
 * Change `variant` and the same content renders with a different layout —
 * which is the main lever for making a fork not look like this one.
 */
export interface SectionVariants {
  hero: "split" | "stacked" | "console";
  about: "columns" | "narrative";
  stats: "grid" | "inline";
  experience: "timeline" | "table";
  projects: "grid" | "list";
  skills: "groups" | "bars" | "cloud";
  certifications: "cards" | "list";
  contact: "split" | "centered";
}

export type SectionType = keyof SectionVariants;

/**
 * The runtime mirror of the `SectionVariants` type above. TypeScript types
 * vanish at build time, but the admin panel needs to *show* the available
 * variants in a dropdown — so the list has to exist as a value too. Keep
 * these two in sync when adding a variant; the type is what components are
 * checked against, this is what the admin offers.
 */
export const sectionVariantOptions: Record<SectionType, string[]> = {
  hero: ["split", "stacked", "console"],
  about: ["columns", "narrative"],
  stats: ["grid", "inline"],
  experience: ["timeline", "table"],
  projects: ["grid", "list"],
  skills: ["groups", "bars", "cloud"],
  certifications: ["cards", "list"],
  contact: ["split", "centered"],
};

interface BaseSection {
  /** Anchor id and nav target. Must be unique. */
  id: string;
  enabled: boolean;
  /** Include in the main nav. Hero and stats normally shouldn't be. */
  nav?: boolean;
  /** Nav label. Falls back to the dictionary entry for `id`. */
  navLabel?: L;
  /** Small line above the heading. `false` removes it entirely. */
  eyebrow?: L | false;
  /** Section heading. `false` renders the section without one. */
  title?: L | false;
  /** One or two supporting sentences under the heading. */
  intro?: L;
  /** Draw a hairline above the section. */
  divider?: boolean;
}

export type SectionConfig = {
  [K in SectionType]: BaseSection & { type: K; variant: SectionVariants[K] };
}[SectionType];

export const sections: SectionConfig[] = [
  {
    id: "hero",
    type: "hero",
    variant: "split",
    enabled: true,
    eyebrow: false,
    title: false,
  },
  {
    id: "about",
    type: "about",
    variant: "columns",
    enabled: true,
    nav: true,
    divider: true,
    title: { en: "Who I am", fr: "Qui je suis", mg: "Iza aho" },
  },
  {
    id: "stats",
    type: "stats",
    variant: "grid",
    enabled: true,
    title: false,
    eyebrow: false,
  },
  {
    id: "experience",
    type: "experience",
    variant: "timeline",
    enabled: true,
    nav: true,
    divider: true,
    title: { en: "Where I've worked", fr: "Où j'ai travaillé", mg: "Toerana niasako" },
  },
  {
    id: "projects",
    type: "projects",
    variant: "grid",
    enabled: true,
    nav: true,
    divider: true,
    title: { en: "What I've built", fr: "Ce que j'ai construit", mg: "Izay naoriko" },
    intro: {
      en: "Labs and shipped work. The infrastructure projects are the ones I'd talk about longest.",
      fr: "Des labs et du travail livré. Ce sont les projets d'infrastructure dont je parlerais le plus longtemps.",
      mg: "Lab sy asa vita. Ny tetikasa fotodrafitrasa no tiako resahina indrindra.",
    },
  },
  {
    id: "skills",
    type: "skills",
    variant: "groups",
    enabled: true,
    nav: true,
    divider: true,
    title: { en: "Tools I reach for", fr: "Les outils que j'utilise", mg: "Fitaovana ampiasaiko" },
  },
  {
    id: "certifications",
    type: "certifications",
    variant: "cards",
    enabled: true,
    nav: false,
    divider: true,
    title: { en: "Certifications", fr: "Certifications", mg: "Fanamarinana" },
  },
  {
    id: "contact",
    type: "contact",
    variant: "split",
    enabled: true,
    nav: true,
    divider: true,
    title: { en: "Let's work together", fr: "Travaillons ensemble", mg: "Aoka hiara-hiasa isika" },
  },
];

export const enabledSections = (): SectionConfig[] => sections.filter((s) => s.enabled);

export const navSections = (): SectionConfig[] => sections.filter((s) => s.enabled && s.nav);
