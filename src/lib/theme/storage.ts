export const THEME_STORAGE_KEY = "portfolio-kit:theme";

/** Shape written to localStorage. `vars` is precomputed so the pre-paint
 *  script can restore a customised theme without importing the token code. */
export interface PersistedTheme {
  presetId: string;
  mode: "light" | "dark" | "system";
  overrides: Record<string, unknown>;
  vars: Record<string, string>;
}
