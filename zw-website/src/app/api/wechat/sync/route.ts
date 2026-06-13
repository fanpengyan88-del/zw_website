import { NextRequest, NextResponse } from "next/server";
import { isWechatSyncRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { isSameOrigin, safeExternalUrl } from "@/lib/request-security";
import { sanitizePlainText } from "@/lib/security";

const MAX_SYNC_ARTICLES = 1_000;
const MAX_SYNC_PAGES = 50;
const MAX_ARTICLE_HTML_LENGTH = 500_000;
let syncInProgress = false;

type WechatArticle = {
  article_id?: string;
  update_time?: number;
  content?: {
    news_item?: Array<{
      title?: string;
      author?: string;
      digest?: string;
      content?: string;
      content_source_url?: string;
      thumb_url?: string;
      url?: string;
    }>;
  };
};

function safeArticleHtml(html = "") {
  const text = html
    .slice(0, MAX_ARTICLE_HTML_LENGTH)
    .replace(/<(script|style|iframe|object|embed|svg|math)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|section|article|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, 200_000);

  return text
    .split("\n")
    .map((line) => `<p>${line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")}</p>`)
    .join("");
}

function slug(sourceId: string, index: number) {
  return `wechat-${sourceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40)}-${index}`;
}

export async function POST(request: NextRequest) {
  if (!isWechatSyncRequest(request)) {
    return NextResponse.json({ message: "未授权。" }, { status: 401 });
  }
  if (!request.headers.get("authorization") && !isSameOrigin(request)) {
    return NextResponse.json({ message: "请求来源无效。" }, { status: 403 });
  }
  if (!process.env.WECHAT_APP_ID || !process.env.WECHAT_APP_SECRET) {
    return NextResponse.json({ message: "微信公众号凭证尚未配置" }, { status: 503 });
  }
  if (syncInProgress) {
    return NextResponse.json({ message: "同步任务正在执行，请稍后再试。" }, { status: 409 });
  }

  syncInProgress = true;
  try {
    const authResponse = await fetch(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${encodeURIComponent(process.env.WECHAT_APP_ID)}&secret=${encodeURIComponent(process.env.WECHAT_APP_SECRET)}`,
      { cache: "no-store", signal: AbortSignal.timeout(10_000) },
    );
    const auth = await authResponse.json() as { access_token?: string; errcode?: number; errmsg?: string };
    if (!authResponse.ok || !auth.access_token) {
      throw new Error(`微信鉴权失败：${auth.errmsg || auth.errcode || authResponse.status}`);
    }

    let count = 0;
    let offset = 0;
    const pageSize = 20;
    let totalCount = 0;
    let pageCount = 0;

    do {
      pageCount += 1;
      if (pageCount > MAX_SYNC_PAGES || count >= MAX_SYNC_ARTICLES) break;
      const articleResponse = await fetch(
        `https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${encodeURIComponent(auth.access_token)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ offset, count: pageSize, no_content: 0 }),
          cache: "no-store",
          signal: AbortSignal.timeout(20_000),
        },
      );
      const payload = await articleResponse.json() as {
        item?: WechatArticle[];
        total_count?: number;
        item_count?: number;
        errcode?: number;
        errmsg?: string;
      };
      if (!articleResponse.ok || payload.errcode) {
        throw new Error(`微信文章拉取失败：${payload.errmsg || payload.errcode || articleResponse.status}`);
      }

      const groups = payload.item || [];
      totalCount = payload.total_count || 0;
      for (const group of groups) {
        const sourceId = group.article_id || String(group.update_time || Date.now());
        for (const [index, item] of (group.content?.news_item || []).entries()) {
          if (count >= MAX_SYNC_ARTICLES) break;
          if (!item.title) continue;
          const articleSourceId = `${sourceId}-${index}`;
          const sourceUrl = safeExternalUrl(item.url || item.content_source_url);
          const title = sanitizePlainText(item.title, 200);
          if (!title) continue;
          await prisma.article.upsert({
            where: { sourceId: articleSourceId },
            update: {
              title,
              summary: sanitizePlainText(item.digest, 500),
              contentHtml: safeArticleHtml(item.content),
              cover: safeExternalUrl(item.thumb_url),
              sourceUrl,
            },
            create: {
              title,
              slug: slug(sourceId, index),
              summary: sanitizePlainText(item.digest, 500),
              contentHtml: safeArticleHtml(item.content),
              cover: safeExternalUrl(item.thumb_url),
              category: "公司动态",
              source: "wechat",
              sourceId: articleSourceId,
              sourceUrl,
              status: "DRAFT",
            },
          });
          count += 1;
        }
      }
      const fetchedCount = payload.item_count ?? groups.length;
      if (groups.length === 0 || fetchedCount <= 0) break;
      offset += fetchedCount;
    } while (offset < totalCount);

    await prisma.syncLog.create({
      data: { source: "wechat", status: "success", message: `同步完成，共处理 ${count} 篇文章`, itemCount: count },
    });
    return NextResponse.json({ ok: true, count, totalCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    try { await prisma.syncLog.create({ data: { source: "wechat", status: "failed", message } }); } catch {}
    return NextResponse.json({ message }, { status: 502 });
  } finally {
    syncInProgress = false;
  }
}
