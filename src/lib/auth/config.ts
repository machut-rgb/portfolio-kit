/**
 * Auth tuning, all overridable via env so a fork can tighten or relax
 * without touching code. Defaults are deliberately conservative.
 */
export const authConfig = {
  /** URL path the admin panel is served at. No leading/trailing slash after normalization. */
  adminPath: normalizePath(process.env.ADMIN_PATH || "/admin-panel"),
  /** Session cookie + DB session lifetime. */
  sessionTtlMs: Number(process.env.SESSION_TTL_HOURS || 168) * 60 * 60 * 1000,
  /** Failed logins allowed before a temporary lockout. */
  maxLoginAttempts: Number(process.env.LOGIN_MAX_ATTEMPTS || 5),
  /** Lockout duration once `maxLoginAttempts` is hit. */
  lockoutMs: Number(process.env.LOGIN_LOCKOUT_SECONDS || 900) * 1000,
  /** Cookie name — deliberately generic, gives nothing away if inspected. */
  cookieName: "__session",
} as const;

function normalizePath(path: string): string {
  const trimmed = path.trim().replace(/\/+$/, "");
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/**
 * Every link inside the admin UI must go through this — the real route
 * tree lives at `/admin/...`, but that path 404s directly (see `proxy.ts`).
 * Only `${adminPath}/...` resolves, so navigation has to target that, not
 * the internal folder name.
 */
export function adminHref(path = ""): string {
  return `${authConfig.adminPath}${path}`;
}
