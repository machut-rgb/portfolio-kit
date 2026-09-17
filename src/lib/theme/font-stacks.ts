import type { FontKey } from "./types";

/**
 * Each key maps to the CSS variable produced by `next/font` in
 * `src/lib/fonts.ts`, plus a system fallback so the page is readable before
 * webfonts land (and if a fork removes the font entirely).
 */
export const FONT_STACKS: Record<FontKey, string> = {
  syne: "var(--font-syne), ui-sans-serif, system-ui, sans-serif",
  "dm-sans": "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
  "jetbrains-mono": "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
  "ibm-plex-sans": "var(--font-ibm-plex-sans), ui-sans-serif, system-ui, sans-serif",
  "ibm-plex-mono": "var(--font-ibm-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
  "space-grotesk": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
  inter: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  fraunces: "var(--font-fraunces), ui-serif, Georgia, serif",
  "work-sans": "var(--font-work-sans), ui-sans-serif, system-ui, sans-serif",
};

export const FONT_LABELS: Record<FontKey, string> = {
  syne: "Syne",
  "dm-sans": "DM Sans",
  "jetbrains-mono": "JetBrains Mono",
  "ibm-plex-sans": "IBM Plex Sans",
  "ibm-plex-mono": "IBM Plex Mono",
  "space-grotesk": "Space Grotesk",
  inter: "Inter",
  fraunces: "Fraunces",
  "work-sans": "Work Sans",
};
