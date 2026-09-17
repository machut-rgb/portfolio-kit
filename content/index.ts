import type { SiteContent } from "@/lib/content/types";
import { profile } from "./profile";
import { about, stats } from "./about";
import { education, experience } from "./experience";
import { projects } from "./projects";
import { skills } from "./skills";
import { certifications } from "./certifications";
import { contact, social } from "./contact";

/**
 * The single source of truth for the whole app.
 *
 * Every page, section, OG image, résumé and JSON-LD block reads from here.
 * To make this site yours, edit the files in `/content` — you should not need
 * to open anything under `/src`.
 */
export const siteContent: SiteContent = {
  profile,
  about,
  stats,
  experience,
  education,
  projects,
  skills,
  certifications,
  social,
  contact,
};
