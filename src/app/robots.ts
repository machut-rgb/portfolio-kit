import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/settings";
import { authConfig } from "@/lib/auth/config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await getSiteSettings();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", authConfig.adminPath] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
