import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { L } from "@/lib/i18n/localize";

/**
 * Schema for the whole app, SQLite/libSQL dialect (works unchanged against
 * a local file in dev and Turso in production — same driver, same SQL).
 *
 * Two groups of tables:
 *  - auth/system (users, sessions, audit_log) — live and enforced from Phase 1.
 *  - content (profile, projects, experience, ...) — shaped now so the
 *    migration is written once, populated by the Phase 2 seed script, and
 *    read by the public site once `getContent()` moves off the static files.
 *
 * JSON columns hold localized values (`L = string | {en, fr, mg}`) and
 * arrays, matching the shape already used by `/content` and validated by
 * `src/lib/content/schema.ts` — the same Zod schemas guard both today's
 * static files and tomorrow's admin form submissions.
 */

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('subsec') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('subsec') * 1000)`),
};

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  /** Consecutive failed logins. Reset to 0 on success. */
  failedAttempts: integer("failed_attempts").notNull().default(0),
  /** Set on lockout; login is refused until this passes even with the right password. */
  lockedUntil: integer("locked_until", { mode: "timestamp_ms" }),
  ...timestamps,
});

export const sessions = sqliteTable("sessions", {
  /** SHA-256 hex of the session token. The raw token lives only in the
   *  visitor's cookie — a DB read never yields a usable credential. */
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp_ms" }).notNull(),
  userAgent: text("user_agent"),
  /** Truncated/hashed, not the raw IP — enough to eyeball "is this me" without storing PII verbatim. */
  ipHint: text("ip_hint"),
  createdAt: timestamps.createdAt,
});

export const auditLog = sqliteTable("audit_log", {
  id: text("id").primaryKey(),
  actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(), // e.g. "login", "login_failed", "project.update"
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  meta: text("meta", { mode: "json" }).$type<Record<string, unknown>>(),
  ipHint: text("ip_hint"),
  createdAt: timestamps.createdAt,
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  auditEntries: many(auditLog),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  actor: one(users, { fields: [auditLog.actorId], references: [users.id] }),
}));

/**
 * Fixed-window rate limiting, in the database rather than in memory.
 *
 * An in-process Map resets on every serverless cold start and isn't shared
 * between concurrent instances, so on Vercel/Netlify it would throttle
 * almost nothing. Same reasoning as the login lockout on `users`.
 */
export const rateLimits = sqliteTable("rate_limits", {
  /** Scope + identifier, e.g. `contact:203.0.*`. */
  key: text("key").primaryKey(),
  hits: integer("hits").notNull().default(0),
  windowStart: integer("window_start", { mode: "timestamp_ms" }).notNull(),
});

// ---------------------------------------------------------------------------
// Content — singletons
// ---------------------------------------------------------------------------

export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey({ autoIncrement: false }).default(1),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  handle: text("handle").notNull(),
  headline: text("headline", { mode: "json" }).$type<L>().notNull(),
  roles: text("roles", { mode: "json" }).$type<L[]>().notNull(),
  summary: text("summary", { mode: "json" }).$type<L>().notNull(),
  availability: text("availability", { mode: "json" }).$type<L>().notNull(),
  location: text("location", { mode: "json" }).$type<L>().notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  photoSrc: text("photo_src"),
  photoAlt: text("photo_alt", { mode: "json" }).$type<L>(),
  photoWidth: integer("photo_width"),
  photoHeight: integer("photo_height"),
  resume: text("resume"),
  ...timestamps,
});

export const about = sqliteTable("about", {
  id: integer("id").primaryKey({ autoIncrement: false }).default(1),
  paragraphs: text("paragraphs", { mode: "json" }).$type<L[]>().notNull(),
  quote: text("quote", { mode: "json" }).$type<L>(),
  ...timestamps,
});

export const contact = sqliteTable("contact", {
  id: integer("id").primaryKey({ autoIncrement: false }).default(1),
  heading: text("heading", { mode: "json" }).$type<L>().notNull(),
  body: text("body", { mode: "json" }).$type<L>().notNull(),
  ...timestamps,
});

/** JSON blob mirroring `config/site.config.ts`'s editable fields. */
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: false }).default(1),
  data: text("data", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  ...timestamps,
});

/** JSON blob mirroring `config/theme.config.ts` — the sitewide default. */
export const themeSettings = sqliteTable("theme_settings", {
  id: integer("id").primaryKey({ autoIncrement: false }).default(1),
  data: text("data", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Content — collections
// ---------------------------------------------------------------------------

export const stats = sqliteTable("stats", {
  id: text("id").primaryKey(),
  value: text("value").notNull(),
  label: text("label", { mode: "json" }).$type<L>().notNull(),
  position: integer("position").notNull().default(0),
});

export const experience = sqliteTable("experience", {
  id: text("id").primaryKey(),
  role: text("role", { mode: "json" }).$type<L>().notNull(),
  org: text("org").notNull(),
  orgUrl: text("org_url"),
  location: text("location").notNull(),
  start: text("start").notNull(),
  end: text("end"),
  current: integer("current", { mode: "boolean" }).notNull().default(false),
  bullets: text("bullets", { mode: "json" }).$type<L[]>().notNull(),
  stack: text("stack", { mode: "json" }).$type<string[]>().notNull(),
  position: integer("position").notNull().default(0),
});

export const education = sqliteTable("education", {
  id: text("id").primaryKey(),
  degree: text("degree", { mode: "json" }).$type<L>().notNull(),
  school: text("school").notNull(),
  location: text("location").notNull(),
  start: text("start").notNull(),
  end: text("end").notNull(),
  note: text("note", { mode: "json" }).$type<L>(),
  position: integer("position").notNull().default(0),
});

export const projects = sqliteTable("projects", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  category: text("category", { mode: "json" }).$type<L>().notNull(),
  summary: text("summary", { mode: "json" }).$type<L>().notNull(),
  body: text("body", { mode: "json" }).$type<L[]>(),
  highlights: text("highlights", { mode: "json" }).$type<L[]>(),
  year: integer("year").notNull(),
  role: text("role", { mode: "json" }).$type<L>(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  links: text("links", { mode: "json" }).$type<{ repo?: string; demo?: string; writeup?: string }>(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  status: text("status", { enum: ["live", "archived", "wip"] }),
  coverSrc: text("cover_src"),
  coverAlt: text("cover_alt", { mode: "json" }).$type<L>(),
  coverWidth: integer("cover_width"),
  coverHeight: integer("cover_height"),
  position: integer("position").notNull().default(0),
  ...timestamps,
});

export const skillGroups = sqliteTable("skill_groups", {
  id: text("id").primaryKey(),
  title: text("title", { mode: "json" }).$type<L>().notNull(),
  icon: text("icon"),
  position: integer("position").notNull().default(0),
});

export const skillItems = sqliteTable("skill_items", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => skillGroups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  level: integer("level"),
  note: text("note", { mode: "json" }).$type<L>(),
  position: integer("position").notNull().default(0),
});

export const skillGroupsRelations = relations(skillGroups, ({ many }) => ({
  items: many(skillItems),
}));

export const skillItemsRelations = relations(skillItems, ({ one }) => ({
  group: one(skillGroups, { fields: [skillItems.groupId], references: [skillGroups.id] }),
}));

export const certifications = sqliteTable("certifications", {
  id: text("id").primaryKey(),
  name: text("name", { mode: "json" }).$type<L>().notNull(),
  issuer: text("issuer").notNull(),
  year: text("year").notNull(),
  description: text("description", { mode: "json" }).$type<L>().notNull(),
  icon: text("icon"),
  url: text("url"),
  position: integer("position").notNull().default(0),
});

export const socialLinks = sqliteTable("social_links", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: text("icon").notNull(),
  handle: text("handle"),
  position: integer("position").notNull().default(0),
});

export const contactChannels = sqliteTable("contact_channels", {
  id: text("id").primaryKey(),
  icon: text("icon").notNull(),
  label: text("label", { mode: "json" }).$type<L>().notNull(),
  value: text("value", { mode: "json" }).$type<L>().notNull(),
  href: text("href"),
  position: integer("position").notNull().default(0),
});

/** Mirrors `config/sections.config.ts` — order, visibility, and variant per section. */
export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(), // section id, e.g. "hero", "projects"
  type: text("type").notNull(),
  variant: text("variant").notNull(),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  nav: integer("nav", { mode: "boolean" }).notNull().default(false),
  divider: integer("divider", { mode: "boolean" }).notNull().default(false),
  navLabel: text("nav_label", { mode: "json" }).$type<L>(),
  eyebrow: text("eyebrow", { mode: "json" }).$type<L | false>(),
  title: text("title", { mode: "json" }).$type<L | false>(),
  intro: text("intro", { mode: "json" }).$type<L>(),
  position: integer("position").notNull().default(0),
});
