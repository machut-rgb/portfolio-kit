import {
  DM_Sans,
  Fraunces,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inter,
  JetBrains_Mono,
  Space_Grotesk,
  Syne,
  Work_Sans,
} from "next/font/google";

/**
 * Every family any preset can reference. `next/font` self-hosts these at build
 * time, so there is no request to Google at runtime and no layout shift.
 *
 * Only the families used by the default preset are preloaded; the rest are
 * fetched when a visitor actually switches to a theme that needs them. If you
 * fork this and only ever ship one preset, delete the others here — that is
 * the single place fonts are declared.
 */

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: false,
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  preload: false,
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: false,
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  preload: false,
});

/** Applied once on <html>; presets pick from these via `FONT_STACKS`. */
export const fontVariables = [
  syne.variable,
  dmSans.variable,
  jetbrainsMono.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
  spaceGrotesk.variable,
  inter.variable,
  fraunces.variable,
  workSans.variable,
].join(" ");
