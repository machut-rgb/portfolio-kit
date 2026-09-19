/**
 * Suggests an icon and a label from a link's URL.
 *
 * The icon registry uses internal names like `git` and `globe`, which mean
 * nothing to someone pasting their GitHub profile. Detecting the platform
 * means the common cases need no decision at all, while the icon picker
 * stays available for anything unrecognised.
 */
export interface PlatformMatch {
  icon: string;
  label: string;
}

const PLATFORMS: { test: RegExp; icon: string; label: string }[] = [
  { test: /(^|\.)github\.com$/i, icon: "git", label: "GitHub" },
  { test: /(^|\.)gitlab\.com$/i, icon: "git", label: "GitLab" },
  { test: /(^|\.)bitbucket\.org$/i, icon: "git", label: "Bitbucket" },
  { test: /(^|\.)linkedin\.com$/i, icon: "linkedin", label: "LinkedIn" },
  { test: /(^|\.)stackoverflow\.com$/i, icon: "layers", label: "Stack Overflow" },
  { test: /(^|\.)(x|twitter)\.com$/i, icon: "globe", label: "X" },
  { test: /(^|\.)mastodon\.[a-z.]+$/i, icon: "globe", label: "Mastodon" },
  { test: /(^|\.)dev\.to$/i, icon: "code", label: "DEV" },
  { test: /(^|\.)medium\.com$/i, icon: "code", label: "Medium" },
  { test: /(^|\.)youtube\.com$/i, icon: "monitor", label: "YouTube" },
  { test: /(^|\.)credly\.com$/i, icon: "shield", label: "Credly" },
];

/** Returns null when the URL is unparseable or the host is unknown. */
export function detectPlatform(href: string): PlatformMatch | null {
  const value = href.trim();
  if (!value) return null;

  if (value.toLowerCase().startsWith("mailto:")) {
    return { icon: "mail", label: "Email" };
  }

  let host: string;
  try {
    host = new URL(value.includes("://") ? value : `https://${value}`).hostname;
  } catch {
    return null;
  }

  const match = PLATFORMS.find((platform) => platform.test.test(host));
  if (match) return match;

  return { icon: "globe", label: host.replace(/^www\./, "") };
}

/** Accepts web and mail links only. Anything else (javascript:, data:) is refused. */
export function isAllowedSocialHref(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (value.toLowerCase().startsWith("mailto:")) return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value);
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}
