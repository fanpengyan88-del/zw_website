import type { MetadataRoute } from "next";
import { news as fallbackNews } from "@/data/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let articles = fallbackNews.map((article) => ({
    slug: article.slug,
    lastModified: new Date(article.date),
  }));

  if (process.env.DATABASE_URL) {
    try {
      const published = await prisma.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: { slug: true, publishedAt: true, updatedAt: true },
      });
      if (published.length > 0) {
        articles = published.map((article) => ({
          slug: article.slug,
          lastModified: article.publishedAt || article.updatedAt,
        }));
      }
    } catch {
      // Keep the static fallback available when the database is unavailable.
    }
  }

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...articles.map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: article.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
