import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getContent } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getContent();
  const siteConfig = await getSiteSettings();
  const { projectPages, resume } = siteConfig.features;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({ url: `${siteConfig.url}/${locale}`, changeFrequency: "monthly", priority: 1 });
    if (resume) {
      entries.push({
        url: `${siteConfig.url}/${locale}/resume`,
        changeFrequency: "yearly",
        priority: 0.5,
      });
    }
    for (const project of projects) {
      if (projectPages && (project.body?.length || project.highlights?.length)) {
        entries.push({
          url: `${siteConfig.url}/${locale}/projects/${project.slug}`,
          changeFrequency: "yearly",
          priority: 0.6,
        });
      }
    }
  }
  return entries;
}
