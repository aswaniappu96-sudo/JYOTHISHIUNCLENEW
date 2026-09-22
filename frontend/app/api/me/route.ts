import { NextResponse } from "next/server";
import { WordpressApiError } from "@/lib/api/client";
import { jsonBody, proxyMe, proxyPost } from "@/lib/server/session";

export async function GET(request: Request) {
  const data = await proxyMe(request);
  if (!data) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request);
    const data = await proxyPost("/me", body, request);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof WordpressApiError ? error.message : "Unable to save profile.";
    const status = error instanceof WordpressApiError ? error.status || 400 : 400;
    return NextResponse.json({ ok: false, message }, { status });
  }
}
