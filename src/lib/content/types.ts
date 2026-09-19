import type { L } from "@/lib/i18n/localize";

/**
 * The shape of everything the site knows about you.
 *
 * These types are the contract between `/content` (data) and `/src`
 * (presentation). Add a field here, fill it in `/content`, and every section
 * variant can use it. Nothing in `/src` should ever hardcode a fact.
 */

export interface Photo {
  src: string;
  alt: L;
  width: number;
  height: number;
}

export interface Profile {
  firstName: string;
  lastName: string;
  /** Short mark for the nav, e.g. "~/machut.dev". */
  handle: string;
  headline: L;
  /** Rotating role labels in the hero. The first one is the primary. */
  roles: L[];
  summary: L;
  availability: L;
  location: L;
  email: string;
  phone?: string;
  photo?: Photo;
  /** Path or URL to a downloadable CV. */
  resume?: string;
}

export interface Stat {
  id: string;
  value: string;
  label: L;
}

export interface AboutContent {
  paragraphs: L[];
  /** Optional pull quote rendered by the `feature` variant. */
  quote?: L;
}

export interface ExperienceItem {
  id: string;
  role: L;
  org: string;
  orgUrl?: string;
  location: string;
  /** ISO-ish `YYYY-MM`. Used for sorting and for the printed résumé. */
  start: string;
  end?: string;
  current?: boolean;
  bullets: L[];
  stack: string[];
}

export type ProjectStatus = "live" | "archived" | "wip";

export interface Project {
  slug: string;
  name: string;
  category: L;
  summary: L;
  /** Long-form paragraphs for the detail page. */
  body?: L[];
  highlights?: L[];
  year: number;
  role?: L;
  tags: string[];
  links?: { repo?: string; demo?: string; writeup?: string; sourcePrivate?: boolean; sourceNote?: string };
  featured?: boolean;
  status?: ProjectStatus;
  cover?: Photo;
}

export interface SkillItem {
  name: string;
  /** 1–5, only rendered by variants that show proficiency. */
  level?: number;
  note?: L;
}

export interface SkillGroup {
  id: string;
  title: L;
  icon?: string;
  items: SkillItem[];
}

export interface Certification {
  id: string;
  name: L;
  issuer: string;
  year: string;
  description: L;
  icon?: string;
  url?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: string;
  handle?: string;
}

export interface ContactChannel {
  id: string;
  icon: string;
  label: L;
  value: L;
  href?: string;
}

export interface EducationItem {
  id: string;
  degree: L;
  school: string;
  location: string;
  start: string;
  end: string;
  note?: L;
}

export interface SiteContent {
  profile: Profile;
  about: AboutContent;
  stats: Stat[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: Project[];
  skills: SkillGroup[];
  certifications: Certification[];
  social: SocialLink[];
  contact: {
    heading: L;
    body: L;
    channels: ContactChannel[];
  };
}
