import type { ThemePreset } from "../types";

type PresetInput = Pick<ThemePreset, "id" | "name" | "description"> &
  Partial<Omit<ThemePreset, "id" | "name" | "description" | "colors">> & {
    colors: ThemePreset["colors"];
  };

/**
 * Sensible defaults so a new preset only declares what makes it different.
 * Fork tip: copy any preset file, change the id, and add it to `index.ts`.
 */
const defaults: Omit<ThemePreset, "id" | "name" | "description" | "colors"> = {
  defaultMode: "dark",
  typography: {
    display: "inter",
    body: "inter",
    mono: "jetbrains-mono",
    baseSize: 16,
    scaleRatio: 1.25,
    displayWeight: 700,
    bodyWeight: 400,
    displayTracking: "-0.02em",
    labelTracking: "0.02em",
    displayLeading: 1.1,
    bodyLeading: 1.65,
    labelCase: "none",
    measure: 68,
  },
  shape: { radius: 10, borderWidth: 1 },
  layout: {
    contentWidth: 1100,
    gutter: 32,
    sectionSpacing: 96,
    density: "comfortable",
    align: "left",
  },
  effects: {
    grid: false,
    glow: false,
    noise: false,
    scanlines: false,
    cardStyle: "outline",
    navBlur: 12,
  },
  motion: { enabled: true, duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)", reveal: true },
  icons: { set: "line", strokeWidth: 1.75, size: 18 },
};

export function definePreset(input: PresetInput): ThemePreset {
  return {
    ...defaults,
    ...input,
    typography: { ...defaults.typography, ...input.typography },
    shape: { ...defaults.shape, ...input.shape },
    layout: { ...defaults.layout, ...input.layout },
    effects: { ...defaults.effects, ...input.effects },
    motion: { ...defaults.motion, ...input.motion },
    icons: { ...defaults.icons, ...input.icons },
  };
}
