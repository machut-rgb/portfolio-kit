import { siteContent } from "../content";
import { db } from "../src/lib/db/client";
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
} from "../src/lib/db/schema";
import { siteConfig } from "../config/site.config";
import { themeConfig } from "../config/theme.config";
import { sections } from "../config/sections.config";

/**
 * Migrates the static `/content/*.ts` files (today's live source) into the
 * database (tomorrow's live source — see `src/lib/content/db-loader.ts`).
 * Meant to run exactly once per environment, right after `db:push`/
 * `db:migrate` and alongside `create-admin`.
 *
 * Refuses to run against a database that already has a profile row, so a
 * second accidental run can't clobber content an owner has already started
 * editing through the admin panel. Pass `--force` to wipe and reseed anyway
 * (development only — this is destructive).
 */
async function main() {
  const force = process.argv.includes("--force");

  const existing = await db.query.profile.findFirst();
  if (existing && !force) {
    console.error(
      "✗ Content already exists in the database (profile row found). Refusing to overwrite it.\n" +
        "  Pass --force to wipe and reseed from /content — this deletes any edits made through the admin panel.",
    );
    process.exit(1);
  }

  if (existing && force) {
    console.log("--force: clearing existing content tables...");
    await Promise.all([
      db.delete(skillItems),
      db.delete(contactChannels),
    ]);
    await Promise.all([
      db.delete(profile),
      db.delete(about),
      db.delete(contact),
      db.delete(stats),
      db.delete(experience),
      db.delete(education),
      db.delete(projects),
      db.delete(skillGroups),
      db.delete(certifications),
      db.delete(socialLinks),
      db.delete(siteSettings),
      db.delete(themeSettings),
      db.delete(sectionsTable),
    ]);
  }

  console.log("Seeding profile...");
  await db.insert(profile).values({
    id: 1,
    firstName: siteContent.profile.firstName,
    lastName: siteContent.profile.lastName,
    handle: siteContent.profile.handle,
    headline: siteContent.profile.headline,
    roles: siteContent.profile.roles,
    summary: siteContent.profile.summary,
    availability: siteContent.profile.availability,
    location: siteContent.profile.location,
    email: siteContent.profile.email,
    phone: siteContent.profile.phone,
    photoSrc: siteContent.profile.photo?.src,
    photoAlt: siteContent.profile.photo?.alt,
    photoWidth: siteContent.profile.photo?.width,
    photoHeight: siteContent.profile.photo?.height,
    resume: siteContent.profile.resume,
  });

  console.log("Seeding about...");
  await db.insert(about).values({
    id: 1,
    paragraphs: siteContent.about.paragraphs,
    quote: siteContent.about.quote,
  });

  console.log("Seeding contact...");
  await db.insert(contact).values({
    id: 1,
    heading: siteContent.contact.heading,
    body: siteContent.contact.body,
  });
  if (siteContent.contact.channels.length > 0) {
    await db.insert(contactChannels).values(
      siteContent.contact.channels.map((c, position) => ({
        id: c.id,
        icon: c.icon,
        label: c.label,
        value: c.value,
        href: c.href,
        position,
      })),
    );
  }

  console.log(`Seeding ${siteContent.stats.length} stats...`);
  if (siteContent.stats.length > 0) {
    await db.insert(stats).values(
      siteContent.stats.map((s, position) => ({ id: s.id, value: s.value, label: s.label, position })),
    );
  }

  console.log(`Seeding ${siteContent.experience.length} experience entries...`);
  if (siteContent.experience.length > 0) {
    await db.insert(experience).values(
      siteContent.experience.map((e, position) => ({
        id: e.id,
        role: e.role,
        org: e.org,
        orgUrl: e.orgUrl,
        location: e.location,
        start: e.start,
        end: e.end,
        current: e.current ?? false,
        bullets: e.bullets,
        stack: e.stack,
        position,
      })),
    );
  }

  console.log(`Seeding ${siteContent.education.length} education entries...`);
  if (siteContent.education.length > 0) {
    await db.insert(education).values(
      siteContent.education.map((e, position) => ({
        id: e.id,
        degree: e.degree,
        school: e.school,
        location: e.location,
        start: e.start,
        end: e.end,
        note: e.note,
        position,
      })),
    );
  }

  console.log(`Seeding ${siteContent.projects.length} projects...`);
  if (siteContent.projects.length > 0) {
    await db.insert(projects).values(
      siteContent.projects.map((p, position) => ({
        slug: p.slug,
        name: p.name,
        category: p.category,
        summary: p.summary,
        body: p.body,
        highlights: p.highlights,
        year: p.year,
        role: p.role,
        tags: p.tags,
        links: p.links,
        featured: p.featured ?? false,
        status: p.status,
        coverSrc: p.cover?.src,
        coverAlt: p.cover?.alt,
        coverWidth: p.cover?.width,
        coverHeight: p.cover?.height,
        position,
      })),
    );
  }

  console.log(`Seeding ${siteContent.skills.length} skill groups...`);
  for (const [groupIndex, group] of siteContent.skills.entries()) {
    await db.insert(skillGroups).values({ id: group.id, title: group.title, icon: group.icon, position: groupIndex });
    if (group.items.length > 0) {
      await db.insert(skillItems).values(
        group.items.map((item, itemIndex) => ({
          // SkillItem has no natural id in /content — derive a stable one
          // from its group and position so re-seeding without --force is
          // at least deterministic, even though re-seeding isn't the
          // normal path once the admin panel is the source of truth.
          id: `${group.id}-${itemIndex}`,
          groupId: group.id,
          name: item.name,
          level: item.level,
          note: item.note,
          position: itemIndex,
        })),
      );
    }
  }

  console.log(`Seeding ${siteContent.certifications.length} certifications...`);
  if (siteContent.certifications.length > 0) {
    await db.insert(certifications).values(
      siteContent.certifications.map((c, position) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        year: c.year,
        description: c.description,
        icon: c.icon,
        url: c.url,
        position,
      })),
    );
  }

  console.log(`Seeding ${siteContent.social.length} social links...`);
  if (siteContent.social.length > 0) {
    await db.insert(socialLinks).values(
      siteContent.social.map((s, position) => ({
        id: s.id,
        label: s.label,
        href: s.href,
        icon: s.icon,
        handle: s.handle,
        position,
      })),
    );
  }

  // Site settings, theme default, and section layout — not read by the
  // public site yet (it still uses the static config files for these), but
  // seeded now so the tables have real starting data for the admin screens
  // that will read/write them.
  console.log("Seeding site settings, theme settings, and section layout...");
  await db.insert(siteSettings).values({
    id: 1,
    data: {
      name: siteConfig.name,
      shortName: siteConfig.shortName,
      description: siteConfig.description,
      keywords: siteConfig.keywords,
      defaultLocale: siteConfig.defaultLocale,
      repository: siteConfig.repository,
      faviconSrc: siteConfig.faviconSrc,
      mail: siteConfig.mail,
      features: siteConfig.features,
    },
  });
  await db.insert(themeSettings).values({
    id: 1,
    data: {
      defaultPreset: themeConfig.defaultPreset,
      defaultMode: themeConfig.defaultMode,
      overrides: themeConfig.overrides ?? {},
      allowVisitorTheming: themeConfig.allowVisitorTheming,
      studio: themeConfig.studio,
      offeredPresets: themeConfig.offeredPresets ?? [],
    },
  });
  await db.insert(sectionsTable).values(
    sections.map((s, position) => ({
      id: s.id,
      type: s.type,
      variant: s.variant,
      enabled: s.enabled,
      nav: s.nav ?? false,
      divider: s.divider ?? false,
      navLabel: s.navLabel,
      eyebrow: s.eyebrow,
      title: s.title,
      intro: s.intro,
      position,
    })),
  );

  console.log("✓ Content seeded. The public site now reads from the database.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Seeding failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
