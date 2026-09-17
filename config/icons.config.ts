/**
 * The icon set.
 *
 * Each entry is the *inner* markup of a 24×24 SVG plus a text glyph used by
 * the `emoji` icon set. Nothing is imported from an icon library, so a fork
 * can paste in Lucide, Phosphor, Heroicons or hand-drawn paths without adding
 * a dependency — keep the viewBox at 24×24 and the stroke unset (the theme
 * supplies colour, width and fill).
 */
export interface IconDefinition {
  /** Inner SVG markup, 24×24 viewBox. */
  svg: string;
  /** Fallback for the `emoji` icon set. */
  glyph: string;
}

export const icons = {
  shield: {
    svg: '<path d="M12 3.2 19 6v5.6c0 4.3-2.9 7.5-7 9.2-4.1-1.7-7-4.9-7-9.2V6z"/><path d="M9.3 12.2l1.9 1.9 3.6-3.9"/>',
    glyph: "🛡",
  },
  cloud: {
    svg: '<path d="M7.2 18.5h8.9a3.9 3.9 0 0 0 .5-7.8 5.9 5.9 0 0 0-11.3-.7 3.4 3.4 0 0 0 1.9 8.5z"/>',
    glyph: "☁",
  },
  code: {
    svg: '<path d="M9 7.5 4.5 12 9 16.5"/><path d="M15 7.5 19.5 12 15 16.5"/><path d="M13.2 5.2 10.8 18.8"/>',
    glyph: "⌨",
  },
  network: {
    svg: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M12 7.2v4.3M12 11.5 6.4 16.3M12 11.5l5.6 4.8"/>',
    glyph: "🖧",
  },
  terminal: {
    svg: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M7 10l3 2.5L7 15M12.5 15.5h4"/>',
    glyph: "▮",
  },
  mail: {
    svg: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.8 7 7.3 5.4a1.5 1.5 0 0 0 1.8 0L20.2 7"/>',
    glyph: "✉",
  },
  pin: {
    svg: '<path d="M12 21c4-4.6 6-8 6-10.5a6 6 0 1 0-12 0C6 13 8 16.4 12 21z"/><circle cx="12" cy="10.4" r="2.3"/>',
    glyph: "📍",
  },
  check: {
    svg: '<path d="m5 12.8 4.4 4.2L19 7.4"/>',
    glyph: "✓",
  },
  git: {
    svg: '<circle cx="6.5" cy="6.5" r="2.2"/><circle cx="6.5" cy="17.5" r="2.2"/><circle cx="17.5" cy="12" r="2.2"/><path d="M6.5 8.7v6.6M8.7 6.9h4.1a2.5 2.5 0 0 1 2.5 2.5v.5"/>',
    glyph: "⑂",
  },
  linkedin: {
    svg: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 10.5v6M8 7.6v.1M12 16.5v-3.4a2 2 0 0 1 4 0v3.4"/><path d="M12 16.5v-6"/>',
    glyph: "in",
  },
  arrowRight: { svg: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>', glyph: "→" },
  arrowUpRight: { svg: '<path d="M7 17 17 7M8.5 7H17v8.5"/>', glyph: "↗" },
  download: { svg: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>', glyph: "⤓" },
  menu: { svg: '<path d="M4 7h16M4 12h16M4 17h16"/>', glyph: "≡" },
  close: { svg: '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>', glyph: "✕" },
  sun: {
    svg: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>',
    glyph: "☀",
  },
  moon: { svg: '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2z"/>', glyph: "☾" },
  monitor: {
    svg: '<rect x="3" y="4.5" width="18" height="12" rx="1.8"/><path d="M9 20.5h6M12 16.5v4"/>',
    glyph: "▭",
  },
  palette: {
    svg: '<path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.4 0 2-.9 2-1.8 0-1.3-1.1-1.6-1.1-2.7 0-.8.7-1.5 1.6-1.5h1.4a4.6 4.6 0 0 0 4.6-4.6c0-3.6-3.8-6.4-8.5-6.4z"/><circle cx="8.2" cy="10.4" r="1.1"/><circle cx="12" cy="7.8" r="1.1"/><circle cx="15.8" cy="10" r="1.1"/>',
    glyph: "🎨",
  },
  chevronDown: { svg: '<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>', glyph: "▾" },
  chevronRight: { svg: '<path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>', glyph: "›" },
  briefcase: {
    svg: '<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12.5h18"/>',
    glyph: "💼",
  },
  graduation: {
    svg: '<path d="M12 4 22 9l-10 5L2 9z"/><path d="M6.5 11.2V16c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.8"/>',
    glyph: "🎓",
  },
  scale: {
    svg: '<path d="M12 4.5v15M6 19.5h12M4 9h16M4 9l-2 5a3 3 0 0 0 6 0zM20 9l2 5a3 3 0 0 1-6 0z"/>',
    glyph: "⚖",
  },
  layers: {
    svg: '<path d="m12 3.5 8.5 4.3-8.5 4.3L3.5 7.8z"/><path d="m3.5 12.2 8.5 4.3 8.5-4.3"/>',
    glyph: "▤",
  },
  sparkle: {
    svg: '<path d="M12 3.5 13.9 9l5.6 2-5.6 2-1.9 5.5L10.1 13 4.5 11l5.6-2z"/>',
    glyph: "✦",
  },
  copy: {
    svg: '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 5.5h-9a2 2 0 0 0-2 2v9"/>',
    glyph: "⧉",
  },
  globe: {
    svg: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c4.5 4.8 4.5 12.2 0 17M12 3.5c-4.5 4.8-4.5 12.2 0 17"/>',
    glyph: "🌐",
  },
  filter: { svg: '<path d="M4 6h16l-6 7v6l-4-2v-4z"/>', glyph: "⏳" },
  clock: { svg: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', glyph: "◷" },
} satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;

/** Content files reference icons by string; this keeps a typo from crashing a page. */
export function isIconName(value: string | undefined): value is IconName {
  return !!value && value in icons;
}
