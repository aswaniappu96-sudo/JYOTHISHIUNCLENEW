import { wpAuthGet, wpMutate } from "@/lib/api/client";
import type { CustomerUser } from "@/types/forms";

const COOKIE = "ju_token";

export function tokenFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function sessionCookie(token: string) {
  const maxAge = 14 * 24 * 60 * 60;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export async function jsonBody(request: Request) {
  return (await request.json()) as Record<string, unknown>;
}

export async function proxyPost<T>(path: string, body: unknown, request: Request) {
  const token = tokenFromCookie(request.headers.get("cookie"));
  return wpMutate<T>(path, body, token);
}

export async function proxyMe(request: Request) {
  const token = tokenFromCookie(request.headers.get("cookie"));
  if (!token) return null;
  try {
    return await wpAuthGet<{ ok: boolean; user: CustomerUser }>("/me", token);
  } catch {
    return null;
  }
}

export async function proxyAuthGet<T>(path: string, request: Request) {
  const token = tokenFromCookie(request.headers.get("cookie"));
  if (!token) return null;
  try {
    return await wpAuthGet<T>(path, token);
  } catch {
    return null;
  }
}
