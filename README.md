# Portfolio Kit

A portfolio site with a hidden admin backoffice, built to be forked. Content,
appearance, and page structure are three separate layers — change your
identity, your look, or your layout without touching the other two.

Visitors see a fast, statically-generated multilingual site. You log in at a
secret URL and edit everything from a CMS. Nothing about the running site
requires a code change or a redeploy.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Drizzle ORM · libSQL/Turso · Zod

---

## Quick start

```bash
npm install
cp .env.example .env       # set ADMIN_PATH at minimum
npm run db:migrate         # creates ./local.db — no account, no setup
npm run dev                # http://localhost:3000
```

Then open your `ADMIN_PATH` in a browser. With no account yet, it opens a
setup wizard: create your login, enter your name and role, pick a theme.
Nothing else is required, and the site renders with placeholders in the
meantime.

Two optional commands remain for people who prefer a terminal:

```bash
npm run seed-content       # load the example content in /content as a starting point
npm run create-admin       # create the account from the CLI instead of the wizard
```

Your admin panel is at `http://localhost:3000` + whatever `ADMIN_PATH` you
set. Nothing on the public site links to it — bookmark it.

> **The database must exist and be seeded before `npm run build`**, not just
> before `dev`. The public site reads content from the database at build time
> to generate static pages. `db:migrate` + `seed-content` is a one-time setup
> per environment, same as migrations for any database-backed app.

---

## How it fits together

```
Visitor  →  static pages (ISR, 5-min safety net)
                 ↑
           getContent() / getSiteSettings()   ← cached, tagged "content"
                 ↑
              database  ←  admin panel Server Actions
                              └─ updateTag("content") on every save
```

Every admin mutation goes through one chokepoint,
`withAdminMutation()` in `src/lib/admin/mutation.ts`, which always:

1. **Re-checks the session.** The page-level guard isn't the only thing
   between a request and a write — an action is reachable independently of
   how its page rendered.
2. Runs the mutation.
3. **Audits it**, then calls `updateTag("content")`.

That third step is deliberate. `revalidateTag` uses stale-while-revalidate
semantics in Next 16, meaning the admin could hit Save and still see the old
version on the very next load. `updateTag` expires the tag immediately and
only works inside a Server Action — which every mutation here is. You get
read-your-own-writes: save, and it's live on the next request, not
"eventually."

---

## Make it yours

### 1. Content — the admin panel

Once seeded, content lives in the database. `/content/*.ts` is read **only**
by `seed-content`, never by the running app.

| Editor | What it covers |
|---|---|
| Profile | Name, headline, roles, summary, photo, résumé link |
| About | Bio paragraphs, pull quote |
| Experience | Roles — create, edit, delete, reorder |
| Projects | Cards + optional long-form detail pages |
| Skills | Groups and their skills |
| Certifications | Issuer, year, credential link |
| Contact | Heading/body, social links, contact channels |

**Editing conventions:**

- Translated fields show as **EN / FR / MG tabs**. Only English is required —
  blank translations fall back to it, so partial translation is a normal
  state, not an error.
- **List fields** (bullets, paragraphs, highlights) are one item per line in a
  textarea, matched by line position across languages.
- **Skills:** `Name` or `Name|Level` per line, level 1–5.
  `Zero Trust / ZTNA|5`
- **Social links:** `Label|https://url|icon|handle` per line, handle optional.

None of this needs JavaScript to submit — every field is a plain form input.

**Bulk editing:** if you'd rather edit files than forms, change `/content/*.ts`
and run `npm run seed-content -- --force`. That wipes and reseeds every
content table, **overwriting anything edited through the admin panel**. Fine
for initial setup; not for a site you're actively maintaining through the UI.

### 2. Look — Theme Studio and the Theme admin

Nothing in a component hardcodes a colour, font, radius, or spacing value.
Everything resolves to CSS custom properties generated from design tokens.
That's what makes live theme switching work without a rebuild, and why two
forks of this repo can look nothing alike.

**Six presets ship:**

| Preset | Character |
|---|---|
| `terminal` | Amber and teal on near-black. Engineering console. |
| `blueprint` | Drafting paper, ink-blue rules, redline annotations. |
| `signal` | White space, black type, one electric blue. |
| `dusk` | Plum shadows, soft gold. Editorial. |
| `phosphor` | CRT green, hard corners, scanlines. |
| `verdant` | Forest green and sand, raised cards, generous curves. |

- **Theme Studio** (palette icon, public nav) edits colours, fonts, radius,
  density, card style, motion and icon style live. Changes save to that
  visitor's browser only. "Export config" produces a snippet for
  `config/theme.config.ts`.
- **Theme admin** sets what *everyone* sees by default: preset, light/dark/
  system, whether visitors may switch, which presets they're offered, and
  whether the Studio is visible at all.
- **Add a preset:** copy any file in `src/lib/theme/presets/`, change the
  `id`, register it in that folder's `index.ts`. It's immediately selectable
  everywhere, including via `?theme=your-id`.

**Fonts** are declared once in `src/lib/fonts.ts` via `next/font` (self-hosted,
no runtime request to Google). To add one: add the loader there, add its key
to the `FontKey` union in `src/lib/theme/types.ts`, and add its stack to
`src/lib/theme/font-stacks.ts`.

**Icons** are a dependency-free registry in `config/icons.config.ts` — inline
SVG plus an emoji fallback per icon. Swap the entire set (Lucide, Phosphor,
hand-drawn) by editing that one file.

### 3. Layout — the Sections admin

The home page is a list, not a template. Each section has an order, an
enabled flag, nav visibility, and a **layout variant** — the same content
rendered differently. Switching variants is the fastest way to make a fork
not look like the original.

| Section | Variants |
|---|---|
| hero | `split`, `stacked`, `console` |
| about | `columns`, `narrative` |
| stats | `grid`, `inline` |
| experience | `timeline`, `table` |
| projects | `grid`, `list` |
| skills | `groups`, `bars`, `cloud` |
| certifications | `cards`, `list` |
| contact | `split`, `centered` |

Adding a variant takes three edits: the `SectionVariants` type **and** the
`sectionVariantOptions` map in `config/sections.config.ts` (the type is what
components are checked against; the map is what the admin dropdown offers),
then handle it in that section's component.

---

## Admin panel & security

- **Single owner, no public sign-up.** Accounts are created only by
  `npm run create-admin`, run where you have database access. There is no
  registration endpoint. Use `npm run create-admin -- --reset-password` to
  change it later; that also revokes every active session.
- **Hidden, not merely password-protected.** `ADMIN_PATH` is the only URL
  that resolves. The real route tree (`/admin`) returns 404 on direct access,
  and the path is excluded from `robots.txt`. Change it any time — it's an
  env var, no migration. This is defence in depth, *not* the security
  boundary: every admin page and Server Action independently verifies the
  session.
- **Passwords:** argon2id at OWASP's current baseline (19 MiB memory, 2
  iterations, parallelism 1). An unknown email is still verified against a
  real argon2 hash, so a failed login costs the same either way — no user
  enumeration via timing.
- **Sessions:** 256-bit random token in an `httpOnly` / `secure` /
  `SameSite=Lax` cookie. Only a SHA-256 hash is stored server-side, so a
  database leak alone doesn't hand out valid sessions. Sliding renewal —
  active use extends, idle expires.
- **Login lockout is database-backed**, not in-memory: a process-local counter
  resets on every serverless cold start and isn't shared between concurrent
  instances, so it would look like protection while providing almost none.
  Tunable via `LOGIN_MAX_ATTEMPTS` / `LOGIN_LOCKOUT_SECONDS`.
- **Audit log** records every login, failed attempt, lockout, and content
  mutation with actor, entity, and a coarse IP hint (not the full address).

---

## Database

Drizzle ORM over libSQL — identical driver, schema and SQL locally and in
production. Only the connection target changes.

- **Local dev:** no setup. With `TURSO_DATABASE_URL` unset it uses a file at
  `./local.db` (gitignored).
- **Production (serverless):** plain SQLite **cannot** work on Vercel or
  Netlify — function filesystems are ephemeral, so a `.db` file written during
  one request is gone on the next cold start. Use
  [Turso](https://turso.tech) (hosted libSQL, same engine and dialect):

  ```bash
  turso db create my-portfolio
  turso db show my-portfolio --url      # → TURSO_DATABASE_URL
  turso db tokens create my-portfolio   # → TURSO_AUTH_TOKEN
  ```

  Set both in your host's environment, then run `npm run db:migrate` once
  against production before the first deploy, and `npm run create-admin`
  (with `ADMIN_EMAIL` / `ADMIN_PASSWORD` set, for non-interactive use).

**Changing the schema:** edit `src/lib/db/schema.ts` → `npm run db:generate`
(writes a numbered migration file) → `npm run db:migrate`. Commit the
generated file; migrations are additive and never regenerated, so an existing
database can always upgrade.

`npm run db:push` applies a schema directly without recording anything. It is
convenient while iterating, but a database created that way has no migration
history, so a later `db:migrate` will try to create tables that already exist
and stop. If that happens:

```bash
npm run db:baseline   # marks already-applied migrations as such
npm run db:migrate    # applies the rest
```

`db:baseline` only reads the schema and writes journal rows. It never creates,
alters or drops a table, and it declines to run on a database that is empty or
already tracked.

> **Gotcha:** `TURSO_AUTH_TOKEN=` (empty string) is **not** the same as unset.
> drizzle-kit's turso dialect rejects an empty token with a confusing
> `Please provide required params` error. `.env.example` keeps those two
> variables commented out for exactly this reason, and `drizzle.config.ts`
> normalises empty to `undefined`. If you uncomment them, fill them in or
> re-comment them.

---

## Contact form

`src/app/api/contact/route.ts` validates with Zod, rate-limits per IP, drops
honeypot submissions silently, then delegates to a provider chosen by
`MAIL_PROVIDER`:

| Provider | Setup |
|---|---|
| `console` | None — logs to the server console. Default, so `dev` works immediately. |
| `smtp` | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (Gmail: use an [app password](https://myaccount.google.com/apppasswords)) |
| `resend` | `RESEND_API_KEY`, `MAIL_TO` |
| `webhook` | `CONTACT_WEBHOOK_URL` (Slack/Discord/n8n-compatible JSON) |

Add one by implementing the three-line `MailProvider` interface in
`src/lib/mail/providers.ts`.

Rate limiting uses a `rate_limits` table rather than an in-process counter,
for the same serverless reason as the login lockout — verified to still hold
after a full process restart. The honeypot returns success rather than an
error so bots don't learn the field is monitored.

---

## Environment variables

```bash
# Public
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_THEME_STUDIO=false     # force-show Theme Studio in production

# Database — leave commented out for local dev (see Gotcha above)
# TURSO_DATABASE_URL=
# TURSO_AUTH_TOKEN=

# Admin
ADMIN_PATH=/admin-panel            # set this to something non-guessable
SESSION_TTL_HOURS=168
LOGIN_MAX_ATTEMPTS=5
LOGIN_LOCKOUT_SECONDS=900

# Contact form
MAIL_PROVIDER=console              # console | smtp | resend | webhook
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
MAIL_TO=
RESEND_API_KEY=
CONTACT_WEBHOOK_URL=
CONTACT_RATE_LIMIT=5
CONTACT_RATE_WINDOW_SECONDS=3600
```

The site URL comes from the environment, never the database — it differs
between preview and production deployments.

---

## Project structure

```
config/                 What a fork is expected to edit
  site.config.ts          name, feature flags        (seed + fallback)
  theme.config.ts         default preset, overrides  (seed + fallback)
  sections.config.ts      page composition, variants (seed + fallback)
  icons.config.ts         the icon registry          (live)

content/                Seed data — profile, projects, experience, …
drizzle/                Generated SQL migrations — commit these

src/
  app/
    [locale]/             public localized routes (/en, /fr, /mg)
    admin/                the backoffice (reached only via ADMIN_PATH)
    api/contact/          contact form endpoint
  components/
    sections/             one file per section, multiple variants each
    admin/                admin shell + form primitives
    studio/               the live Theme Studio drawer
    layout/               nav, footer, locale switcher, mode toggle
    ui/                   buttons, icons, reveal-on-scroll
  lib/
    theme/                tokens, presets, CSS generation, React context
    content/              schema (Zod), DB loader, typed accessors
    settings/             site/theme/section settings with fallbacks
    i18n/                 locale config, dictionaries, resolution
    db/                   Drizzle schema + client
    auth/                 passwords, sessions, login, audit, guards
    admin/                mutation wrapper, FormData parsers
```

`config/*.ts` and `/content/*.ts` are **seed data and fallbacks**. If a table
is empty, the site reads the committed config. A clone of this repo renders
correctly before you seed anything — that's what keeps it forkable.

---

## Commands

```bash
npm run dev                  # local dev (Turbopack)
npm run build                # production build (needs a seeded database)
npm run start                # serve the production build
npm run typecheck            # tsc --noEmit

npm run db:migrate           # apply committed migrations (use everywhere)
npm run db:baseline          # adopt a push-created database into migration tracking
npm run db:push              # apply schema directly — dev only, no history
npm run db:generate          # write a migration from schema.ts
npm run db:studio            # browse the database

npm run seed-content         # load /content into the database
npm run seed-content -- --force   # wipe and reseed (destructive)
npm run create-admin         # bootstrap the single admin account
npm run create-admin -- --reset-password

npm run validate:content     # check the seed files against their schema
npm run theme:list           # list registered theme presets
```

---

## What's included beyond the obvious

- **Résumé at `/[locale]/resume`** — print-optimised, built from the same
  database content, so there's no separate document to keep in sync.
- **SEO**: `sitemap.xml`, `robots.txt`, per-locale `hreflang` alternates,
  JSON-LD `Person` schema, and a generated OG image — all driven by content
  and settings, not hardcoded.
- **Security headers**: `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`.
- **No visitor tracking.** Theme Studio choices live in `localStorage` only.
  The contact form is the only thing that talks to a server.

---

## Known limitations

Stated plainly, so nobody discovers them the hard way:

- **No automated tests.** Verification to date has been manual. For a kit
  meant to be forked and modified, this is the biggest gap — a few tests
  around the content loader, the localized-field parsers, and the auth flow
  would be the highest-value next contribution.
- **No image uploads.** Photo and cover paths are typed by hand, so adding a
  new image still needs a git commit. An S3-compatible provider following the
  same pattern as the mail providers is the intended fix.
- **The Theme admin doesn't edit individual design tokens** — it sets the
  default preset and visitor permissions. Token-level authoring is still the
  Theme Studio's export-and-paste flow.
- **Contact submissions aren't stored.** If mail delivery fails, the message
  is lost. Persisting them first (with an admin inbox) is a small, worthwhile
  change.
- **Malagasy translations** for UI strings written during the build — as
  opposed to those ported from the original site — should get a native
  speaker's review.

---

## Licence

MIT.
