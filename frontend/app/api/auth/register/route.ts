import { NextResponse } from "next/server";
import { WordpressApiError } from "@/lib/api/client";
import { jsonBody, proxyPost, sessionCookie } from "@/lib/server/session";

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request);
    const data = await proxyPost<{ ok: boolean; token: string; user: unknown }>("/auth/register", body, request);
    const response = NextResponse.json(data);
    if (data.token) {
      response.headers.set("Set-Cookie", sessionCookie(data.token));
    }
    return response;
  } catch (error) {
    const message = error instanceof WordpressApiError ? error.message : "Unable to register.";
    const status = error instanceof WordpressApiError ? error.status || 400 : 400;
    return NextResponse.json({ ok: false, message }, { status });
  }
}
