import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  about,
  certifications,
  contact,
  contactChannels,
  education,
  experience,
  profile,
  projects,
  sections as sectionsTable,
  siteSettings,
  skillGroups,
  skillItems,
  socialLinks,
  stats,
  themeSettings,
} from "@/lib/db/schema";
import type {
  Certification,
  ContactChannel,
  EducationItem,
  ExperienceItem,
  Photo,
  Profile,
  Project,
  SiteContent,
  SkillGroup,
  SocialLink,
  Stat,
} from "./types";

/**
 * Pulls every content table and reassembles the same `SiteContent` shape
 * that `/content/*.ts` used to export directly. Every component downstream
 * of `getContent()` was written against that shape, not against "a file" or
 * "a database" — that boundary is what makes this swap possible without
 * touching a single section component's rendering logic.
 */
export async function loadContentFromDb(): Promise<SiteContent> {
  const [
    profileRow,
    aboutRow,
    contactRow,
    statsRows,
    experienceRows,
    educationRows,
    projectRows,
    skillGroupRows,
    certificationRows,
    socialRows,
    contactChannelRows,
  ] = await Promise.all([
    db.query.profile.findFirst(),
    db.query.about.findFirst(),
    db.query.contact.findFirst(),
    db.query.stats.findMany({ orderBy: [asc(stats.position)] }),
    db.query.experience.findMany({ orderBy: [asc(experience.position)] }),
    db.query.education.findMany({ orderBy: [asc(education.position)] }),
    db.query.projects.findMany({ orderBy: [asc(projects.position)] }),
    db.query.skillGroups.findMany({
      orderBy: (t, { asc }) => [asc(t.position)],
      with: { items: { orderBy: (t, { asc }) => [asc(t.position)] } },
    }),
    db.query.certifications.findMany({ orderBy: [asc(certifications.position)] }),
    db.query.socialLinks.findMany({ orderBy: [asc(socialLinks.position)] }),
    db.query.contactChannels.findMany({ orderBy: [asc(contactChannels.position)] }),
  ]);

  // A migrated-but-unseeded database is a legitimate state: it is what a
  // fresh install looks like before the setup wizard runs. Throwing here
  // made the build fail and left no way in, so the singletons fall back to
  // neutral placeholders instead. Collections deliberately do not fall
  // back: an owner who deletes every project means it.
  return {
    profile: profileRow ? rowToProfile(profileRow) : PLACEHOLDER_PROFILE,
    about: aboutRow
      ? { paragraphs: aboutRow.paragraphs, quote: aboutRow.quote ?? undefined }
      : PLACEHOLDER_ABOUT,
    stats: statsRows.map(rowToStat),
    experience: experienceRows.map(rowToExperience),
    education: educationRows.map(rowToEducation),
    projects: projectRows.map(rowToProject),
    skills: skillGroupRows.map(rowToSkillGroup),
    certifications: certificationRows.map(rowToCertification),
    social: socialRows.map(rowToSocialLink),
    contact: {
      heading: contactRow?.heading ?? PLACEHOLDER_CONTACT.heading,
      body: contactRow?.body ?? PLACEHOLDER_CONTACT.body,
      channels: contactChannelRows.map(rowToContactChannel),
    },
  };
}

/**
 * Shown only between `db:migrate` and the setup wizard being completed.
 * Deliberately generic rather than the seed content, so a fork never
 * publishes someone else's name while waiting to be configured.
 */
const PLACEHOLDER_PROFILE: Profile = {
  firstName: "Your",
  lastName: "Name",
  handle: "~/your.site",
  headline: "This site has not been set up yet.",
  roles: ["Set your role in the admin panel"],
  summary: "Sign in to the admin panel to replace this placeholder with your own details.",
  availability: "Not set up yet",
  location: "Not set up yet",
  // A reserved TLD that can never resolve, so the placeholder cannot leak a
  // working address or be scraped into a real mailing list.
  email: "setup@example.invalid",
};

const PLACEHOLDER_ABOUT = {
  paragraphs: ["Add your bio from the admin panel."],
  quote: undefined,
};

const PLACEHOLDER_CONTACT = {
  heading: "Get in touch",
  body: "Add your contact text from the admin panel.",
};

function photoFrom(
  src: string | null,
  alt: unknown,
  width: number | null,
  height: number | null,
): Photo | undefined {
  if (!src || !width || !height) return undefined;
  return { src, alt: alt as Photo["alt"], width, height };
}

function rowToProfile(row: typeof profile.$inferSelect): Profile {
  return {
    firstName: row.firstName,
    lastName: row.lastName,
    handle: row.handle,
    headline: row.headline,
    roles: row.roles,
    summary: row.summary,
    availability: row.availability,
    location: row.location,
    email: row.email,
    phone: row.phone ?? undefined,
    photo: photoFrom(row.photoSrc, row.photoAlt, row.photoWidth, row.photoHeight),
    resume: row.resume ?? undefined,
  };
}

function rowToStat(row: typeof stats.$inferSelect): Stat {
  return { id: row.id, value: row.value, label: row.label };
}

function rowToExperience(row: typeof experience.$inferSelect): ExperienceItem {
  return {
    id: row.id,
    role: row.role,
    org: row.org,
    orgUrl: row.orgUrl ?? undefined,
    location: row.location,
    start: row.start,
    end: row.end ?? undefined,
    current: row.current,
    bullets: row.bullets,
    stack: row.stack,
  };
}

function rowToEducation(row: typeof education.$inferSelect): EducationItem {
  return {
    id: row.id,
    degree: row.degree,
    school: row.school,
    location: row.location,
    start: row.start,
    end: row.end,
    note: row.note ?? undefined,
  };
}

function rowToProject(row: typeof projects.$inferSelect): Project {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    summary: row.summary,
    body: row.body ?? undefined,
    highlights: row.highlights ?? undefined,
    year: row.year,
    role: row.role ?? undefined,
    tags: row.tags,
    links: row.links ?? undefined,
    featured: row.featured,
    status: row.status ?? undefined,
    cover: photoFrom(row.coverSrc, row.coverAlt, row.coverWidth, row.coverHeight),
  };
}

function rowToSkillGroup(
  row: typeof skillGroups.$inferSelect & { items: (typeof skillItems.$inferSelect)[] },
): SkillGroup {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon ?? undefined,
    items: row.items.map((item) => ({
      name: item.name,
      level: item.level ?? undefined,
    })),
  };
}

function rowToCertification(row: typeof certifications.$inferSelect): Certification {
  return {
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    year: row.year,
    description: row.description,
    icon: row.icon ?? undefined,
    url: row.url ?? undefined,
  };
}

function rowToSocialLink(row: typeof socialLinks.$inferSelect): SocialLink {
  return { id: row.id, label: row.label, href: row.href, icon: row.icon, handle: row.handle ?? undefined };
}

function rowToContactChannel(row: typeof contactChannels.$inferSelect): ContactChannel {
  return { id: row.id, icon: row.icon, label: row.label, value: row.value, href: row.href ?? undefined };
}

/** Raw JSON blobs for the settings/sections tables — read by Phase 4 admin
 *  screens; not consumed by the public site yet (it still reads the static
 *  config files for these). Exported now so the seed script and future
 *  admin editors share one place that knows the table shape. */
export async function loadSiteSettingsRow() {
  return db.query.siteSettings.findFirst();
}
export async function loadThemeSettingsRow() {
  return db.query.themeSettings.findFirst();
}
export async function loadSectionsRows() {
  return db.query.sections.findMany({ orderBy: [asc(sectionsTable.position)] });
}
