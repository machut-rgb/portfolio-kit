import { ImageResponse } from "next/og";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getFullName, getPrimaryRole } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Static, dependency-free OG card. Uses system fonts only — `ImageResponse`
 *  runs at the edge and cannot load the site's `next/font` files. */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const name = await getFullName();
  const role = await getPrimaryRole(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0f",
          color: "#f0f0f0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#f59e0b", letterSpacing: 4 }}>PORTFOLIO</div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, marginTop: 24 }}>{name}</div>
        <div style={{ display: "flex", fontSize: 34, color: "#2dd4bf", marginTop: 16 }}>{role}</div>
      </div>
    ),
    size,
  );
}
