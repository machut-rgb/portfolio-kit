import { z } from "zod";

/**
 * Runtime validation for `/content`.
 *
 * TypeScript already checks the shape when content is authored in `.ts`, but
 * this guards the cases TypeScript cannot: content pulled from JSON, a CMS,
 * or edited by someone who never runs `tsc`. `npm run validate:content`
 * fails loudly with the exact path of the bad field.
 */
const localized = z.union([z.string().min(1), z.record(z.string(), z.string().min(1))]);
const localizedList = z.array(localized);

const photo = z.object({
  src: z.string().min(1),
  alt: localized,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  handle: z.string().min(1),
  headline: localized,
  roles: localizedList.min(1),
  summary: localized,
  availability: localized,
  location: localized,
  email: z.string().regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "must be an email address"),
  phone: z.string().optional(),
  photo: photo.optional(),
  resume: z.string().optional(),
});

export const statSchema = z.object({
  id: z.string().min(1),
  value: z.string().min(1),
  label: localized,
});

export const experienceSchema = z.object({
  id: z.string().min(1),
  role: localized,
  org: z.string().min(1),
  orgUrl: z.string().url().optional(),
  location: z.string().min(1),
  start: z.string().regex(/^\d{4}(-\d{2})?$/, "use YYYY or YYYY-MM"),
  end: z.string().regex(/^\d{4}(-\d{2})?$/).optional(),
  current: z.boolean().optional(),
  bullets: localizedList,
  stack: z.array(z.string()),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slugs are lowercase and hyphenated"),
  name: z.string().min(1),
  category: localized,
  summary: localized,
  body: localizedList.optional(),
  highlights: localizedList.optional(),
  year: z.number().int().min(1990).max(2100),
  role: localized.optional(),
  tags: z.array(z.string()),
  links: z
    .object({ repo: z.string().url().optional(), demo: z.string().url().optional(), writeup: z.string().url().optional() })
    .optional(),
  featured: z.boolean().optional(),
  status: z.enum(["live", "archived", "wip"]).optional(),
  cover: photo.optional(),
});

export const skillGroupSchema = z.object({
  id: z.string().min(1),
  title: localized,
  icon: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        level: z.number().int().min(1).max(5).optional(),
        note: localized.optional(),
      }),
    )
    .min(1),
});

export const certificationSchema = z.object({
  id: z.string().min(1),
  name: localized,
  issuer: z.string().min(1),
  year: z.string().min(1),
  description: localized,
  icon: z.string().optional(),
  url: z.string().url().optional(),
});

export const educationSchema = z.object({
  id: z.string().min(1),
  degree: localized,
  school: z.string().min(1),
  location: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  note: localized.optional(),
});

export const socialSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1),
  handle: z.string().optional(),
});

export const siteContentSchema = z.object({
  profile: profileSchema,
  about: z.object({ paragraphs: localizedList.min(1), quote: localized.optional() }),
  stats: z.array(statSchema),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema).min(1),
  skills: z.array(skillGroupSchema),
  certifications: z.array(certificationSchema),
  social: z.array(socialSchema),
  contact: z.object({
    heading: localized,
    body: localized,
    channels: z.array(
      z.object({
        id: z.string().min(1),
        icon: z.string().min(1),
        label: localized,
        value: localized,
        href: z.string().optional(),
      }),
    ),
  }),
});

/** Human-readable report used by the CLI and the dev-time guard. */
export function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  content.${issue.path.join(".")} — ${issue.message}`)
    .join("\n");
}
