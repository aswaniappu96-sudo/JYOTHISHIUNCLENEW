import { NextResponse } from "next/server";
import { getSettings } from "@/lib/api/wordpress";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({
      whatsapp_number: settings.whatsapp_number || "",
      phone_number: settings.phone_number || "",
    });
  } catch {
    return NextResponse.json({ whatsapp_number: "", phone_number: "" });
  }
}
