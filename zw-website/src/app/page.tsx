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
      url: null,
    }));
  }

  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
      take: 6,
      select: {
        id: true,
        title: true,
        category: true,
        sourceUrl: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
    if (articles.length > 0) {
      return articles.map((article) => ({
        id: article.id,
        date: (article.publishedAt || article.updatedAt).toISOString().slice(0, 10),
        title: article.title,
        tag: article.category,
        url: article.sourceUrl,
      }));
    }
  } catch {
    // The public site remains available before the database or WeChat credentials are configured.
  }

  return fallbackNews.map((item, index) => ({
    id: `fallback-${index}`,
    ...item,
    url: null,
  }));
}

export default async function Page() {
  return <HomePage articles={await getNews()} />;
}
