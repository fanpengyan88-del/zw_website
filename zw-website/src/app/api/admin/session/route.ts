import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  isAdminConfigured,
  isAdminRequest,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import {
  clientIp,
  isRateLimited,
  isSameOrigin,
  privateNoStoreHeaders,
  readJsonObject,
} from "@/lib/request-security";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { authenticated: isAdminRequest(request), configured: isAdminConfigured() },
    { headers: privateNoStoreHeaders() },
  );
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "请求来源无效。" }, { status: 403 });
  }
  if (isRateLimited(`admin-login:${clientIp(request)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ message: "登录尝试过于频繁，请稍后再试。" }, { status: 429 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({ message: "后台安全配置不完整。" }, { status: 503 });
  }

  try {
    const body = await readJsonObject(request, 2_048);
    if (!verifyAdminPassword(typeof body.password === "string" ? body.password : null)) {
      return NextResponse.json({ message: "管理员密码错误。" }, { status: 401 });
    }
  } catch (error) {
    const status = error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? 413 : 400;
    return NextResponse.json({ message: "请求格式不正确。" }, { status });
  }

  const session = createAdminSession();
  const response = NextResponse.json({ ok: true }, { headers: privateNoStoreHeaders() });
  response.cookies.set(ADMIN_SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "请求来源无效。" }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true }, { headers: privateNoStoreHeaders() });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
