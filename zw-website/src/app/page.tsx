import { HomePage } from "@/components/HomePage";
import { news as fallbackNews } from "@/data/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getNews() {
  if (!process.env.DATABASE_URL) {
    return fallbackNews.map((item, index) => ({
      id: `fallback-${index}`,
      ...item,
      href: `/news/${item.slug}`,
    }));
  }

  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
      take: 6,
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        cover: true,
        category: true,
        source: true,
        sourceUrl: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
    if (articles.length > 0) {
      return articles.map((article) => ({
        id: article.id,
        href: `/news/${article.slug}`,
        date: (article.publishedAt || article.updatedAt).toISOString().slice(0, 10),
        title: article.title,
        summary: article.summary,
        cover: article.cover,
        tag: article.source === "wechat" ? "中网华信" : article.category,
      }));
    }
  } catch {
    // The public site remains available before the database or WeChat credentials are configured.
  }

  return fallbackNews.map((item, index) => ({
    id: `fallback-${index}`,
    ...item,
    href: `/news/${item.slug}`,
  }));
}

export default async function Page() {
  return <HomePage articles={await getNews()} />;
}
