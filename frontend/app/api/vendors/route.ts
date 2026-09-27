import { NextResponse } from "next/server";
import { wpFetch } from "@/lib/api/client";

export async function GET() {
  try {
    const data = await wpFetch("/vendors", { cache: "no-store" });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
