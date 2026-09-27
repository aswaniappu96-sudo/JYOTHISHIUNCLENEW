import { NextResponse } from "next/server";
import { WordpressApiError } from "@/lib/api/client";
import { jsonBody, proxyPost } from "@/lib/server/session";

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request);
    const data = await proxyPost("/travel-bookings", body, request);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof WordpressApiError ? error.message : "Unable to send yatra enquiry.";
    const status = error instanceof WordpressApiError ? error.status || 400 : 400;
    return NextResponse.json({ ok: false, message }, { status });
  }
}
