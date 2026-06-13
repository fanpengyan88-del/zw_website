import { PublishStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { isSameOrigin, privateNoStoreHeaders, readJsonObject } from "@/lib/request-security";

const allowedStatuses = new Set<PublishStatus>([
  PublishStatus.DRAFT,
  PublishStatus.PUBLISHED,
  PublishStatus.ARCHIVED,
]);

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  try {
    const [articles, latestSync] = await Promise.all([
      prisma.article.findMany({
        orderBy: [{ status: "asc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
        take: 200,
        select: {
          id: true,
          title: true,
          summary: true,
          category: true,
          source: true,
          sourceUrl: true,
          status: true,
          featured: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.syncLog.findFirst({ where: { source: "wechat" }, orderBy: { createdAt: "desc" } }),
    ]);

    return NextResponse.json({
      articles,
      latestSync,
      wechatConfigured: Boolean(
        process.env.WECHAT_APP_ID && process.env.WECHAT_APP_SECRET,
      ),
    }, { headers: privateNoStoreHeaders() });
  } catch {
    return NextResponse.json({ message: "数据库暂不可用，文章管理已降级。" }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "未授权。" }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "请求来源无效。" }, { status: 403 });
  }

  let body: { id?: unknown; status?: unknown; featured?: unknown };
  try {
    body = await readJsonObject(request, 4_096);
  } catch (error) {
    const status = error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? 413 : 400;
    return NextResponse.json({ message: "请求格式不正确。" }, { status });
  }

  if (typeof body.id !== "string") {
    return NextResponse.json({ message: "缺少文章 ID" }, { status: 422 });
  }
  if (typeof body.status !== "string" || !allowedStatuses.has(body.status as PublishStatus)) {
    return NextResponse.json({ message: "文章状态不正确" }, { status: 422 });
  }

  const status = body.status as PublishStatus;
  try {
    const current = await prisma.article.findUnique({ where: { id: body.id } });
    if (!current) return NextResponse.json({ message: "文章不存在" }, { status: 404 });

    const article = await prisma.article.update({
      where: { id: body.id },
      data: {
        status,
        featured: typeof body.featured === "boolean" ? body.featured : current.featured,
        publishedAt: status === PublishStatus.PUBLISHED
          ? current.publishedAt || new Date()
          : current.publishedAt,
      },
    });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ message: "文章状态更新失败" }, { status: 500 });
  }
}
