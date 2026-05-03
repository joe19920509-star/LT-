import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getPublicSiteUrl } from "@/lib/site-url";
import { SECTIONS } from "@/lib/sections";

/** 站点地图随稿件更新；缓存一段时间减轻数据库压力 */
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getPublicSiteUrl();
  const articles = await getAllArticles();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/subscribe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

  const sectionPages: MetadataRoute.Sitemap = SECTIONS.map((s) => ({
    url: `${base}/section/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.88,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.92,
  }));

  return [...staticPages, ...sectionPages, ...articlePages];
}
