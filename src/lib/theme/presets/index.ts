import type { ThemePreset } from "../types";
import { terminal } from "./terminal";
import { blueprint } from "./blueprint";
import { signal } from "./signal";
import { dusk } from "./dusk";
import { phosphor } from "./phosphor";
import { verdant } from "./verdant";

/**
 * Every look the site ships with. Add yours here and it appears in the Theme
 * Studio, gets its CSS emitted at build time, and becomes selectable by
 * `?theme=<id>` — no other file needs to change.
 */
export const presets: ThemePreset[] = [terminal, blueprint, signal, dusk, phosphor, verdant];

export const presetMap: Record<string, ThemePreset> = Object.fromEntries(
  presets.map((p) => [p.id, p]),
);

export function getPreset(id: string | undefined | null): ThemePreset {
  return (id && presetMap[id]) || presets[0]!;
}

export { terminal, blueprint, signal, dusk, phosphor, verdant };
