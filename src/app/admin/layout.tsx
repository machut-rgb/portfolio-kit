import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getPreset } from "@/lib/theme/presets";
import { colorVars, declarations, structureVars } from "@/lib/theme/tokens";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

/**
 * `/admin` is a separate top-level branch from `/[locale]` — it doesn't
 * inherit that segment's layout, so it needs its own `<html>/<body>` and
 * its own theme. Deliberately fixed (the `terminal` preset, dark, no
 * visitor overrides): the owner's tool shouldn't change look depending on
 * whatever preset a fork's public site currently has selected, and it
 * isn't exposed to the Theme Studio at all.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

const preset = getPreset("terminal");
const adminThemeCss = `:root {\n${declarations({ ...structureVars(preset), ...colorVars(preset.colors.dark) })}\n}`;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: adminThemeCss }} />
      </head>
      <body style={{ background: "var(--p-bg)", color: "var(--p-fg-muted)", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
