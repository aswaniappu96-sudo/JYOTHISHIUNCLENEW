import { NextResponse } from "next/server";
import { wpFetch } from "@/lib/api/client";
import { presentVendors } from "@/lib/api/wordpress";

export async function GET() {
  try {
    const data = await wpFetch("/vendors", { cache: "no-store" });
    return NextResponse.json(presentVendors(data));
  } catch {
    return NextResponse.json([]);
  }
}
