import type {
  ColorTokens,
  Density,
  ThemeMode,
  ThemeOverrides,
  ThemePreset,
} from "./types";
import { FONT_STACKS } from "./font-stacks";

/** Prefix for every generated custom property. Change it once, everywhere follows. */
export const VAR = "--p";

const COLOR_VARS: Record<keyof ColorTokens, string> = {
  bg: "bg",
  bgElevated: "bg-elevated",
  surface: "surface",
  surfaceAlt: "surface-alt",
  border: "border",
  borderStrong: "border-strong",
  fg: "fg",
  fgMuted: "fg-muted",
  fgSubtle: "fg-subtle",
  primary: "primary",
  primaryFg: "primary-fg",
  accent: "accent",
  accentFg: "accent-fg",
  ring: "ring",
  success: "success",
  warning: "warning",
  danger: "danger",
  gradientFrom: "gradient-from",
  gradientTo: "gradient-to",
};

const DENSITY_SCALE: Record<Density, number> = {
  compact: 0.82,
  comfortable: 1,
  spacious: 1.22,
};

const round = (n: number) => Math.round(n * 100) / 100;

/** Modular type scale derived from `baseSize` and `scaleRatio`. */
export function typeScale(base: number, ratio: number): Record<string, number> {
  const step = (n: number) => round(base * Math.pow(ratio, n));
  return {
    "2xs": step(-2),
    xs: step(-1.5),
    sm: step(-1),
    base: base,
    md: step(0.5),
    lg: step(1),
    xl: step(2),
    "2xl": step(3),
    "3xl": step(4),
    "4xl": step(5),
    "5xl": step(6),
  };
}

/** Colour custom properties for one mode. */
export function colorVars(colors: ColorTokens): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, name] of Object.entries(COLOR_VARS)) {
    out[`${VAR}-${name}`] = colors[key as keyof ColorTokens];
  }
  return out;
}

/** Everything that does not depend on light/dark. */
export function structureVars(preset: ThemePreset): Record<string, string> {
  const { typography: t, shape, layout, effects, motion, icons } = preset;
  const fs = typeScale(t.baseSize, t.scaleRatio);
  const d = DENSITY_SCALE[layout.density];
  const r = shape.radius;

  const out: Record<string, string> = {
    [`${VAR}-font-display`]: FONT_STACKS[t.display],
    [`${VAR}-font-body`]: FONT_STACKS[t.body],
    [`${VAR}-font-mono`]: FONT_STACKS[t.mono],

    [`${VAR}-weight-display`]: String(t.displayWeight),
    [`${VAR}-weight-body`]: String(t.bodyWeight),
    [`${VAR}-tracking-display`]: t.displayTracking,
    [`${VAR}-tracking-label`]: t.labelTracking,
    [`${VAR}-leading-display`]: String(t.displayLeading),
    [`${VAR}-leading-body`]: String(t.bodyLeading),
    [`${VAR}-label-case`]: t.labelCase,
    [`${VAR}-measure`]: `${t.measure}ch`,

    [`${VAR}-radius-xs`]: `${round(r * 0.4)}px`,
    [`${VAR}-radius-sm`]: `${round(r * 0.7)}px`,
    [`${VAR}-radius-md`]: `${r}px`,
    [`${VAR}-radius-lg`]: `${round(r * 1.6)}px`,
    [`${VAR}-radius-xl`]: `${round(r * 2.4)}px`,
    [`${VAR}-radius-full`]: r === 0 ? "0px" : "999px",
    [`${VAR}-border-width`]: `${shape.borderWidth}px`,

    [`${VAR}-content-width`]: `${layout.contentWidth}px`,
    [`${VAR}-gutter`]: `${layout.gutter}px`,
    [`${VAR}-section-space`]: `${layout.sectionSpacing}px`,
    [`${VAR}-card-pad`]: `${round(26 * d)}px`,
    [`${VAR}-gap`]: `${round(24 * d)}px`,
    [`${VAR}-stack`]: `${round(16 * d)}px`,
    [`${VAR}-align`]: layout.align,

    [`${VAR}-duration`]: motion.enabled ? `${motion.duration}ms` : "0ms",
    [`${VAR}-duration-slow`]: motion.enabled ? `${Math.round(motion.duration * 2.4)}ms` : "0ms",
    [`${VAR}-easing`]: motion.easing,

    [`${VAR}-icon-stroke`]: String(icons.strokeWidth),
    [`${VAR}-icon-size`]: `${icons.size}px`,
    [`${VAR}-icon-svg-display`]: icons.set === "emoji" ? "none" : "inline-block",
    [`${VAR}-icon-glyph-display`]: icons.set === "emoji" ? "inline-block" : "none",
    [`${VAR}-icon-fill`]:
      icons.set === "solid"
        ? "currentColor"
        : icons.set === "duotone"
          ? "color-mix(in oklab, currentColor 16%, transparent)"
          : "none",
    [`${VAR}-nav-blur`]: `${effects.navBlur}px`,
  };

  // Effects are expressed as variables rather than alternate rule sets, so the
  // Theme Studio can flip them live by writing a single inline property.
  out[`${VAR}-grid-display`] = effects.grid ? "block" : "none";
  out[`${VAR}-glow-display`] = effects.glow ? "block" : "none";
  out[`${VAR}-noise-display`] = effects.noise ? "block" : "none";
  out[`${VAR}-scanlines-display`] = effects.scanlines ? "block" : "none";

  const card = {
    outline: {
      bg: `var(${VAR}-surface)`,
      border: `var(${VAR}-border)`,
      width: `var(${VAR}-border-width)`,
      shadow: "none",
    },
    solid: {
      bg: `var(${VAR}-surface-alt)`,
      border: "transparent",
      width: "0px",
      shadow: "none",
    },
    elevated: {
      bg: `var(${VAR}-surface)`,
      border: `var(${VAR}-border)`,
      width: `var(${VAR}-border-width)`,
      shadow: "0 1px 2px rgb(0 0 0 / 0.05), 0 14px 30px -18px rgb(0 0 0 / 0.35)",
    },
    ghost: {
      bg: "transparent",
      border: "transparent",
      width: "0px",
      shadow: "none",
    },
    underline: {
      bg: "transparent",
      border: `var(${VAR}-border)`,
      width: `0 0 var(${VAR}-border-width) 0`,
      shadow: "none",
    },
  }[effects.cardStyle];

  out[`${VAR}-card-bg`] = card.bg;
  out[`${VAR}-card-border-color`] = card.border;
  out[`${VAR}-card-border-width`] = card.width;
  out[`${VAR}-card-shadow`] = card.shadow;
  out[`${VAR}-card-border-hover`] =
    effects.cardStyle === "ghost" || effects.cardStyle === "solid"
      ? card.border
      : `color-mix(in oklab, var(${VAR}-primary) 45%, transparent)`;

  for (const [name, value] of Object.entries(fs)) {
    out[`${VAR}-fs-${name}`] = `${value}px`;
  }
  // Fluid display sizes used by the hero and section headings.
  out[`${VAR}-fs-hero`] = `clamp(${fs["3xl"]}px, 7.5vw, ${fs["5xl"]}px)`;
  out[`${VAR}-fs-heading`] = `clamp(${fs["xl"]}px, 4.4vw, ${fs["3xl"]}px)`;

  return out;
}

/** Serialise a variable map into a CSS declaration block body. */
export function declarations(vars: Record<string, string>, indent = "  "): string {
  return Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join("\n");
}

/** Deep-merge a `ThemeOverrides` patch onto a preset. Arrays are replaced. */
export function applyOverrides(preset: ThemePreset, overrides?: ThemeOverrides): ThemePreset {
  if (!overrides) return preset;
  const merge = <T,>(base: T, patch: unknown): T => {
    if (patch === undefined || patch === null) return base;
    if (typeof base !== "object" || base === null || Array.isArray(base)) return patch as T;
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
      out[k] = merge((base as Record<string, unknown>)[k], v);
    }
    return out as T;
  };
  return merge(preset, overrides);
}

/** Flat map of every variable for a resolved theme — used by the Studio. */
export function allVars(
  preset: ThemePreset,
  mode: ThemeMode,
): Record<string, string> {
  return { ...structureVars(preset), ...colorVars(preset.colors[mode]) };
}

export { DENSITY_SCALE, COLOR_VARS };
