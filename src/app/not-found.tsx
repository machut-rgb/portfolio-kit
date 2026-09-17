import Link from "next/link";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Root-level 404 (no locale in the URL). The localized experience for a
 *  bad path under `/[locale]/...` also resolves here since Next has no
 *  nested not-found without a matching layout — good enough for a 404. */
export default function NotFound() {
  const dict = getDictionary(defaultLocale);
  return (
    <html lang={defaultLocale}>
      <body style={{ background: "#0a0a0f", color: "#f0f0f0", fontFamily: "sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <h1 style={{ fontSize: 20, letterSpacing: 2 }}>404</h1>
          <p style={{ color: "#888899" }}>{dict.notFound.body}</p>
          <Link href={`/${defaultLocale}`} style={{ color: "#f59e0b" }}>
            {dict.notFound.home}
          </Link>
        </div>
      </body>
    </html>
  );
}
