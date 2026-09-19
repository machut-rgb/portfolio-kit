/**
 * URL checks shared by every admin form that stores a link.
 *
 * These values end up as `href` attributes on the public site, so they are
 * validated on the server rather than relying on `type="url"` in the
 * browser, which a form post can skip entirely. Anything outside http,
 * https and mailto is refused: `javascript:` and `data:` URLs in an href
 * are a stored-XSS vector.
 */
export function isHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const { protocol } = new URL(trimmed);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

export function isMailtoUrl(value: string): boolean {
  return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value.trim());
}

/** Accepts web and mail links. Used for social and contact destinations. */
export function isAllowedHref(value: string): boolean {
  return isHttpUrl(value) || isMailtoUrl(value);
}

/**
 * Validates a set of optional link fields, returning the first problem.
 * Empty values are fine; a link is only checked when one was entered.
 */
export function firstInvalidLink(links: Record<string, string | undefined>): string | null {
  for (const [label, value] of Object.entries(links)) {
    if (value && !isHttpUrl(value)) {
      return `The ${label} link is not a valid address. Use a full https:// URL.`;
    }
  }
  return null;
}
