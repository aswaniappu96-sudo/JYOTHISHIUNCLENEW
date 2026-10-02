import { NextResponse } from "next/server";
import { wpFetch } from "@/lib/api/client";

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const juPath = `/${path.join("/")}`;
  const query = new URL(request.url).search;
  try {
    const data = await wpFetch(`${juPath}${query}`, { cache: "no-store" });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "WordPress list failed.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
