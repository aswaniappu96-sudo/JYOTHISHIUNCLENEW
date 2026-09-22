import { NextResponse } from "next/server";
import { proxyAuthGet } from "@/lib/server/session";

export async function GET(request: Request) {
  const data = await proxyAuthGet("/me/bookings", request);
  if (!data) {
    return NextResponse.json({ ok: false, message: "Please log in." }, { status: 401 });
  }
  return NextResponse.json(data);
}
