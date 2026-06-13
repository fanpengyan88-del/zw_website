import type { MetadataRoute } from "next";
import { news } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...news.map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${base}/admin`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.1 },
  ];
}
