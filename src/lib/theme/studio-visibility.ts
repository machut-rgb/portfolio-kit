import type { ThemeConfig } from "./types";

/** Resolves the `studio` config flag against the current environment. */
export function isStudioEnabled(studio: ThemeConfig["studio"]): boolean {
  if (studio === true) return true;
  if (studio === false) return false;
  return process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_THEME_STUDIO === "true";
}
