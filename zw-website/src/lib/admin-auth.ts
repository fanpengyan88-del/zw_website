import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "zw_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function matchesSecret(value: string | null, expected: string | undefined) {
  if (!value || !expected) return false;
  const valueDigest = createHash("sha256").update(value).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(valueDigest, expectedDigest);
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET;
}

function sign(value: string) {
  const secret = sessionSecret();
  if (!secret) return "";
  return createHmac("sha256", secret)
    .update(value)
    .update("\0")
    .update(process.env.ADMIN_PASSWORD || "")
    .digest("base64url");
}

export function isAdminConfigured() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = sessionSecret();
  return Boolean(
    password &&
    secret &&
    password.length >= 12 &&
    secret.length >= 32 &&
    password !== "change-this-password" &&
    secret !== "generate-at-least-32-random-characters",
  );
}

export function verifyAdminPassword(value: string | null) {
  return isAdminConfigured() && matchesSecret(value, process.env.ADMIN_PASSWORD);
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${expires}.${randomBytes(16).toString("base64url")}`;
  return {
    value: `${payload}.${sign(payload)}`,
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function isAdminRequest(request: NextRequest) {
  if (!isAdminConfigured()) return false;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  const [expires, nonce, signature, extra] = token.split(".");
  if (!expires || !nonce || !signature || extra || !/^\d+$/.test(expires)) return false;
  if (!/^[A-Za-z0-9_-]{22}$/.test(nonce)) return false;
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = Number(expires);
  if (expiresAt <= now || expiresAt > now + SESSION_TTL_SECONDS) return false;
  return matchesSecret(signature, sign(`${expires}.${nonce}`));
}

export function isWechatSyncRequest(request: NextRequest) {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null;
  return matchesSecret(bearer, process.env.WECHAT_SYNC_TOKEN) || isAdminRequest(request);
}
