import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale, negotiateLocale } from "@/lib/i18n/config";
import { authConfig } from "@/lib/auth/config";

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Runs before routing. Three jobs, in order:
 *
 *  1. Block direct requests to the real internal admin path (`/admin/...`).
 *     The admin panel is only reachable through the configurable secret
 *     path below — a direct hit here means someone guessed the folder name,
 *     not the actual entry point, so it 404s rather than revealing a login
 *     page exists at a predictable URL.
 *  2. Rewrite the configured secret path (`ADMIN_PATH`, default
 *     `/admin-panel`) to `/admin/...` internally. The visitor's URL bar
 *     keeps showing the secret path; Next renders the real route tree.
 *  3. For everything else (the public, localized site), redirect unprefixed
 *     paths to a locale chosen from `Accept-Language`.
 *
 * Real access control still happens per-request in `requireSession()` —
 * this is routing and obscurity, not the security boundary.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname) ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname === authConfig.adminPath || pathname.startsWith(`${authConfig.adminPath}/`)) {
    const rest = pathname.slice(authConfig.adminPath.length);
    const url = request.nextUrl.clone();
    url.pathname = `/admin${rest}`;
    return NextResponse.rewrite(url);
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale || pathname === "/") {
    return NextResponse.next();
  }

  const locale = negotiateLocale(request.headers.get("accept-language")) || defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

