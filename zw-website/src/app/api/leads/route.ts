import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  clientIp,
  isRateLimited,
  privateNoStoreHeaders,
  readJsonObject,
} from "@/lib/request-security";
import { isPhone, sanitizePlainText } from "@/lib/security";

const allowedInterests = new Set([
  "AI与大模型",
  "数据治理",
  "信息安全",
  "数字化转型",
  "校园安全",
  "其他",
]);

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (isRateLimited(`lead:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ message: "提交过于频繁，请稍后再试。" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonObject(request, 16_384);
  } catch (error) {
    const status = error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? 413 : 400;
    return NextResponse.json({ message: "请求格式不正确。" }, { status });
  }

  const name = sanitizePlainText(body.name, 30);
  const company = sanitizePlainText(body.company, 80);
  const phone = sanitizePlainText(body.phone, 30);
  const interest = sanitizePlainText(body.interest, 50);
  const message = sanitizePlainText(body.message, 500);
  const privacy = body.privacy === "accepted";
  const honeypot = sanitizePlainText(body.website, 100);

  if (honeypot) return NextResponse.json({ ok: true });
  if (!name || !company || !allowedInterests.has(interest) || !privacy || !isPhone(phone)) {
    return NextResponse.json({ message: "请完整填写信息，并检查联系电话。" }, { status: 422 });
  }

  const ipHash = process.env.IP_HASH_SECRET
    ? createHmac("sha256", process.env.IP_HASH_SECRET).update(ip).digest("hex")
    : null;
  try {
    await prisma.lead.create({ data: { name, company, phone, interest, message, ipHash } });
  } catch {
    return NextResponse.json({ message: "服务暂时不可用，请稍后再试。" }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "未授权。" }, { status: 401 });
  }
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        name: true,
        company: true,
        phone: true,
        interest: true,
        createdAt: true,
      },
    });
    return NextResponse.json(leads, { headers: privateNoStoreHeaders() });
  } catch {
    return NextResponse.json({ message: "数据库暂时不可用。" }, { status: 503 });
  }
}
