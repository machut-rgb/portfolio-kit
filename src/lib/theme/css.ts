import type { ThemeMode, ThemePreset } from "./types";
import { colorVars, declarations, structureVars } from "./tokens";

/**
 * Emits one stylesheet containing every preset, keyed by `data-theme` /
 * `data-mode` on <html>. Because all looks are already in the document,
 * switching theme is a single attribute write — no flash, no re-request, and
 * it works for visitors with JavaScript disabled (they get the default).
 */
export function generateThemeCss(
  presets: ThemePreset[],
  defaultPresetId: string,
  defaultMode: ThemeMode,
): string {
  const fallback = presets.find((p) => p.id === defaultPresetId) ?? presets[0];
  if (!fallback) return "";

  const blocks: string[] = [
    `:root {\n${declarations({
      ...structureVars(fallback),
      ...colorVars(fallback.colors[defaultMode]),
    })}\n}`,
  ];

  for (const preset of presets) {
    blocks.push(`html[data-theme="${preset.id}"] {\n${declarations(structureVars(preset))}\n}`);
    for (const mode of ["light", "dark"] as ThemeMode[]) {
      blocks.push(
        `html[data-theme="${preset.id}"][data-mode="${mode}"] {\n${declarations(
          colorVars(preset.colors[mode]),
        )}\n}`,
      );
    }
    // No-JS / pre-hydration fallback when the visitor asked for "system".
    blocks.push(
      `@media (prefers-color-scheme: dark) {\n  html[data-theme="${preset.id}"][data-mode="system"] {\n${declarations(
        colorVars(preset.colors.dark),
        "    ",
      )}\n  }\n}`,
    );
    blocks.push(
      `@media (prefers-color-scheme: light) {\n  html[data-theme="${preset.id}"][data-mode="system"] {\n${declarations(
        colorVars(preset.colors.light),
        "    ",
      )}\n  }\n}`,
    );
  }

  return blocks.join("\n\n");
}
