/**
 * The design-token contract for the whole app.
 *
 * Everything visual — colour, type, shape, density, motion, iconography — is
 * expressed here and nowhere else. Components never hardcode a colour or a
 * pixel value; they consume the CSS custom properties generated from these
 * tokens (see `tokens.ts`).
 *
 * A `ThemePreset` is a complete, named look. A `ThemeOverrides` object is a
 * deep-partial patch applied on top of a preset — that is what the Theme
 * Studio edits and what you paste back into `config/theme.config.ts` when you
 * are happy with a fork's identity.
 */

export type ThemeMode = "light" | "dark";

/** Semantic colour roles. Values are any valid CSS colour. */
export interface ColorTokens {
  /** Page background. */
  bg: string;
  /** Background of raised regions (nav, sticky bars). */
  bgElevated: string;
  /** Card / panel background. */
  surface: string;
  /** Secondary surface: inputs, tags, wells. */
  surfaceAlt: string;
  /** Hairline borders. */
  border: string;
  /** Emphasised borders (hover, focus containers). */
  borderStrong: string;
  /** Primary text. */
  fg: string;
  /** Secondary text — body copy in most presets. */
  fgMuted: string;
  /** Tertiary text — captions, disabled. */
  fgSubtle: string;
  /** Brand colour: primary buttons, key emphasis. */
  primary: string;
  /** Text/icon colour on top of `primary`. */
  primaryFg: string;
  /** Secondary brand colour: labels, links, chart accents. */
  accent: string;
  /** Text/icon colour on top of `accent`. */
  accentFg: string;
  /** Focus ring. */
  ring: string;
  success: string;
  warning: string;
  danger: string;
  /** Decorative gradient endpoints (rules, photo frames, hover bars). */
  gradientFrom: string;
  gradientTo: string;
}

/** Keys into the font registry in `src/lib/fonts.ts`. */
export type FontKey =
  | "dm-sans"
  | "jetbrains-mono"
  | "ibm-plex-sans"
  | "ibm-plex-mono"
  | "space-grotesk"
  | "inter"
  | "fraunces"
  | "work-sans";

export type TextCase = "none" | "uppercase" | "lowercase";

export interface TypographyTokens {
  /** Headings, hero, statistics. */
  display: FontKey;
  /** Body copy and UI. */
  body: FontKey;
  /** Code, metadata, eyebrows. */
  mono: FontKey;
  /** Root font size in px. Every step of the scale derives from it. */
  baseSize: number;
  /** Modular-scale ratio, e.g. 1.25 (major third), 1.333 (perfect fourth). */
  scaleRatio: number;
  displayWeight: number;
  bodyWeight: number;
  /** Letter-spacing for display type, e.g. "-0.02em". */
  displayTracking: string;
  /** Letter-spacing for small eyebrow/label type. */
  labelTracking: string;
  displayLeading: number;
  bodyLeading: number;
  /** Casing applied to section eyebrows and small labels. */
  labelCase: TextCase;
  /** Measure (max line length) for prose, in characters. */
  measure: number;
}

export interface ShapeTokens {
  /** Base corner radius in px. The scale (xs…xl) derives from it. */
  radius: number;
  /** Border width in px used by outlined surfaces. */
  borderWidth: number;
}

export type Density = "compact" | "comfortable" | "spacious";

export interface LayoutTokens {
  /** Max content width in px. */
  contentWidth: number;
  /** Horizontal page padding in px (desktop). */
  gutter: number;
  /** Vertical rhythm between sections in px. */
  sectionSpacing: number;
  density: Density;
  /** Alignment of section headers and hero copy. */
  align: "left" | "center";
}

export type CardStyle = "outline" | "solid" | "elevated" | "ghost" | "underline";

export interface EffectTokens {
  /** Blueprint grid behind the hero. */
  grid: boolean;
  /** Soft radial colour bloom behind the hero. */
  glow: boolean;
  /** Film-grain overlay. */
  noise: boolean;
  /** CRT scanlines. */
  scanlines: boolean;
  /** How cards separate themselves from the page. */
  cardStyle: CardStyle;
  /** Backdrop blur strength for the nav, in px. 0 disables it. */
  navBlur: number;
}

export interface MotionTokens {
  /** Master switch. `prefers-reduced-motion` always wins over this. */
  enabled: boolean;
  /** Base duration in ms. */
  duration: number;
  easing: string;
  /** Reveal-on-scroll animation for sections. */
  reveal: boolean;
}

export type IconSetId = "line" | "solid" | "duotone" | "emoji";

export interface IconTokens {
  set: IconSetId;
  strokeWidth: number;
  /** Default icon size in px. */
  size: number;
}

export interface ThemePreset {
  id: string;
  name: string;
  /** One line shown in the Theme Studio picker. */
  description: string;
  /** Mode the preset was designed in; used when the visitor has no preference. */
  defaultMode: ThemeMode;
  colors: Record<ThemeMode, ColorTokens>;
  typography: TypographyTokens;
  shape: ShapeTokens;
  layout: LayoutTokens;
  effects: EffectTokens;
  motion: MotionTokens;
  icons: IconTokens;
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** A patch applied on top of a preset. */
export type ThemeOverrides = DeepPartial<Omit<ThemePreset, "id" | "name" | "description">>;

/** The fully-resolved theme a page renders with. */
export interface ResolvedTheme extends ThemePreset {
  mode: ThemeMode;
}

/** What we persist for a visitor, and what the Studio exports. */
export interface ThemeState {
  presetId: string;
  mode: ThemeMode | "system";
  overrides: ThemeOverrides;
}

/** Shape of `config/theme.config.ts`. */
export interface ThemeConfig {
  /** Preset id from `src/lib/theme/presets`. */
  defaultPreset: string;
  defaultMode: ThemeMode | "system";
  /** Patch applied on top of the preset for every visitor. */
  overrides?: ThemeOverrides;
  /** Let visitors switch preset and mode. Turn off for a fixed brand look. */
  allowVisitorTheming: boolean;
  /** Show the Theme Studio panel. `"dev"` means development builds only. */
  studio: boolean | "dev";
  /** Presets offered in the switcher. Empty means all of them. */
  offeredPresets?: string[];
}
