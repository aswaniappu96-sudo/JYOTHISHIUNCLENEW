import { NextResponse } from "next/server";
import { wpFetch } from "@/lib/api/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "";
  const month = searchParams.get("month") || "";
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (month) params.set("month", month);
  const query = params.toString();
  const data = await wpFetch(`/consultation/availability${query ? `?${query}` : ""}`, { cache: "no-store" });
  return NextResponse.json(data);
}
