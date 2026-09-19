import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteSettings, getThemeSettings } from "@/lib/settings";
import { presets } from "@/lib/theme/presets";
import { generateThemeCss } from "@/lib/theme/css";
import { themeInitScript } from "@/lib/theme/script";
import { fontVariables } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/theme/provider";
import { StudioProvider } from "@/components/studio/context";
import { ThemeStudioPanel } from "@/components/studio/ThemeStudioPanel";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { getContent, getFullName, getPrimaryRole } from "@/lib/content";
import { t } from "@/lib/i18n/localize";
import { isStudioEnabled } from "@/lib/theme/studio-visibility";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const name = await getFullName();
  const role = await getPrimaryRole(locale);
  const siteConfig = await getSiteSettings();
  const description = t(siteConfig.description, locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${name} — ${role}`, template: `%s — ${name}` },
    description,
    keywords: siteConfig.keywords,
    authors: [{ name }],
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}`])),
    },
    openGraph: {
      type: "website",
      url: `${siteConfig.url}/${locale}`,
      title: `${name} — ${role}`,
      description,
      siteName: siteConfig.name,
      locale,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${role}`,
      description,
    },
    robots: { index: true, follow: true },
    ...(siteConfig.faviconSrc
      ? { icons: { icon: siteConfig.faviconSrc, shortcut: siteConfig.faviconSrc, apple: siteConfig.faviconSrc } }
      : {}),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  const themeConfig = await getThemeSettings();
  const siteConfig = await getSiteSettings();
  const themeCss = generateThemeCss(
    presets,
    themeConfig.defaultPreset,
    themeConfig.defaultMode === "system" ? "dark" : themeConfig.defaultMode,
  );
  const content = await getContent();
  const name = await getFullName();
  const role = await getPrimaryRole(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    url: `${siteConfig.url}/${locale}`,
    email: `mailto:${content.profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: t(content.profile.location, locale) },
    sameAs: content.social.map((s) => s.href).filter((href) => href.startsWith("http")),
  };

  return (
    <html lang={locale} suppressHydrationWarning className={fontVariables}>
      <head>
        <style id="theme-presets" dangerouslySetInnerHTML={{ __html: themeCss }} />
        {/* Plain inline script, not next/script: this must execute
            synchronously during HTML parsing, before first paint, or the
            visitor sees a flash of the default theme. It ships in the
            server-rendered HTML, which is where it actually runs.

            React logs "Encountered a script tag while rendering React
            component" for this in DEVELOPMENT ONLY. That warning fires when
            React *creates* a script client-side (during a soft navigation
            that remounts this layout) — it never applies to the SSR'd copy,
            and the production React build contains no such warning. It's
            also harmless on soft nav: data-theme is already on <html> and
            ThemeProvider owns it from then on. Don't "fix" this by adding a
            non-executable `type`; that silences the warning by stopping the
            browser from running it. */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: themeInitScript(themeConfig.defaultPreset, themeConfig.defaultMode),
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <ThemeProvider
          defaultPresetId={themeConfig.defaultPreset}
          defaultMode={themeConfig.defaultMode}
          defaultOverrides={themeConfig.overrides}
        >
          <StudioProvider>
            <Nav locale={locale} />
            <main id="main">{children}</main>
            <Footer locale={locale} />
            {isStudioEnabled(themeConfig.studio) && <ThemeStudioPanel dict={dict.theme} />}
            <div className="layer-noise" />
            <div className="layer-scanlines" />
          </StudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
