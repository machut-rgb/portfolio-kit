import type { ThemeConfig } from "@/lib/theme/types";

/**
 * How the site looks out of the box.
 *
 * `defaultPreset` picks one of `src/lib/theme/presets`. `overrides` patches
 * any token on top of it — this is what the Theme Studio's "Export config"
 * button generates, so the loop is: tweak in the browser, export, paste here.
 */
export const themeConfig: ThemeConfig = {
  defaultPreset: "terminal",
  defaultMode: "dark",
  overrides: {},
  allowVisitorTheming: true,
  studio: true,
  offeredPresets: [],
};
