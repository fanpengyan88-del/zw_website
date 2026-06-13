import { ArrowLeft, ArrowRight, ArrowUpRight, Phone } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { NewsDetailImage } from "@/components/NewsDetailImage";
import { news as fallbackNews } from "@/data/content";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type NewsDetail = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  cover: string | null;
  paragraphs: string[];
  sourceUrl: string | null;
};

export function generateStaticParams() {
  return fallbackNews.map((article) => ({ slug: article.slug }));
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'");
}

function contentToParagraphs(contentHtml: string) {
  return contentHtml
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((paragraph) => decodeHtmlEntities(paragraph).replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

async function getArticle(slug: string): Promise<NewsDetail | null> {
  const fallback = fallbackNews.find((article) => article.slug === slug);
  if (fallback) {
    return {
      slug: fallback.slug,
      title: fallback.title,
      summary: fallback.summary,
      date: fallback.date,
      source: fallback.tag,
      cover: fallback.cover,
      paragraphs: fallback.content,
      sourceUrl: null,
    };
  }

  if (!process.env.DATABASE_URL) return null;

  try {
    const article = await prisma.article.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: {
        slug: true,
        title: true,
        summary: true,
        contentHtml: true,
        cover: true,
        category: true,
        source: true,
        sourceUrl: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
    if (!article) return null;

    return {
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      date: (article.publishedAt || article.updatedAt).toISOString().slice(0, 10),
      source: article.source === "wechat" ? "中网华信" : article.category,
      cover: article.cover,
      paragraphs: contentToParagraphs(article.contentHtml),
      sourceUrl: article.sourceUrl,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) return { title: "新闻详情" };

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.date,
      images: article.cover ? [{ url: article.cover }] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();

  return (
    <main className="news-detail-page">
      <header className="news-detail-header">
        <Link href="/" aria-label="返回中网官网首页"><Logo /></Link>
        <nav aria-label="新闻详情导航">
          <Link href="/">首页</Link>
          <Link href="/#news">新闻动态</Link>
          <a href="tel:03518330236"><Phone weight="fill" /> 0351-8330236</a>
        </nav>
      </header>

      <section className="news-detail-hero">
        <div>
          <Link className="news-detail-back" href="/#news"><ArrowLeft /> 返回新闻动态</Link>
          <p className="eyebrow">NEWS & INSIGHTS</p>
          <h1>{article.title}</h1>
          <div className="news-detail-meta">
            <time dateTime={article.date}>{article.date}</time>
            <span>{article.source}</span>
          </div>
        </div>
      </section>

      <article className="news-detail-article">
        <div className="news-detail-lead">{article.summary}</div>
        <figure className="news-detail-cover">
          <NewsDetailImage src={article.cover} alt={`${article.title}封面`} />
        </figure>

        <div className="news-detail-content">
          {article.paragraphs.length > 0
            ? article.paragraphs.map((paragraph, index) => <p key={`${article.slug}-${index}`}>{paragraph}</p>)
            : <p>{article.summary}</p>}
        </div>

        <div className="news-detail-end">
          <span>ZW / NEWS</span>
          <p>以可信技术连接产业场景，持续记录中网华信的创新实践与发展进程。</p>
        </div>

        <div className="news-detail-actions">
          <Link href="/#news"><ArrowLeft /> 返回新闻列表</Link>
          {article.sourceUrl && (
            <a href={article.sourceUrl} target="_blank" rel="noreferrer">
              查看原文 <ArrowUpRight />
            </a>
          )}
        </div>
      </article>

      <aside className="news-detail-next">
        <div>
          <p className="eyebrow">KEEP EXPLORING</p>
          <h2>了解中网更多动态</h2>
        </div>
        <Link href="/#news">浏览新闻动态 <ArrowRight /></Link>
      </aside>

      <footer className="news-detail-footer">
        <div><Logo /><p>中网华信科技股份有限公司<br />让数据更安全，让决策更智慧</p></div>
        <div><b>联系我们</b><p>0351-8330236<br />山西省太原市综改示范区南中环街 529 号 D 座 20 层</p></div>
        <small>© 2002-{new Date().getFullYear()} 中网华信科技股份有限公司 版权所有</small>
      </footer>
    </main>
  );
}
