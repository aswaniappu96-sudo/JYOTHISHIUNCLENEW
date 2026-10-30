import { NextResponse } from "next/server";
import { wpRequest } from "@/lib/api/client";
import { describeConsultationRoom } from "@/lib/consultationRoom";
import { tokenFromCookie } from "@/lib/server/session";
import { generateToken04 } from "@/lib/zegoToken";

export const runtime = "nodejs";

type WpRoom = {
  code?: string;
  message?: string;
  role?: string;
  customer_name?: string;
  service_title?: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  slot_offer?: string;
  status?: string;
  timezone?: string;
  slot_minutes?: number;
  room_id?: string;
  meeting_provider?: string;
  meeting_status?: string;
};

type BookingRow = {
  id?: number | string;
  customer_name?: string;
  service_title?: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  slot_offer?: string;
  status?: string;
};

function displayName(value: string | undefined, fallback: string) {
  const clean = (value || "").replace(/[\u0000-\u001f]/g, "").trim().slice(0, 40);
  return clean || fallback;
}

function videoCredentials(roomId: string, userId: string) {
  const appId = Number(process.env.ZEGO_APP_ID);
  const secret = (process.env.ZEGO_SERVER_SECRET || "").trim();
  if (!Number.isInteger(appId) || appId <= 0 || secret.length !== 32) return null;
  const token = generateToken04(
    appId,
    userId,
    secret,
    3 * 60 * 60,
    JSON.stringify({
      room_id: roomId,
      privilege: { 1: 1, 2: 1 },
      stream_id_list: null,
    }),
  );
  return { appId, token };
}

async function roomFromBookings(id: string, token: string) {
  const listed = await wpRequest("/me/bookings", token);
  const settings = await wpRequest("/settings", token);
  if (!listed.ok || !settings.ok) return { error: "The consultation could not be loaded. Refresh in a moment.", status: 503 as const };
  const body = listed.data as { consultations?: BookingRow[] };
  const row = (body.consultations || []).find((item) => String(item.id) === id);
  if (!row) return { error: "This consultation was not found.", status: 404 as const };
  const prefs = settings.data as { consultation_timezone?: string; consultation_slot_minutes?: number };
  return {
    booking: {
      role: "guest",
      customer_name: row.customer_name,
      service_title: row.service_title,
      booking_date: row.booking_date,
      start_time: row.start_time,
      end_time: row.end_time,
      slot_offer: row.slot_offer,
      status: row.status,
      timezone: prefs.consultation_timezone,
      slot_minutes: prefs.consultation_slot_minutes,
    } satisfies WpRoom,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  const key = (url.searchParams.get("k") || "").toLowerCase();
  if (!/^\d+$/.test(id) || (key && !/^[a-f0-9]{32}$/.test(key))) {
    return NextResponse.json({ ok: false, message: "This video link is not valid." }, { status: 403 });
  }

  const token = tokenFromCookie(request.headers.get("cookie"));
  const query = key ? `?k=${key}` : "";
  const primary = await wpRequest(`/consultation-room/${id}${query}`, token);
  let booking: WpRoom | null = null;

  if (primary.status === 503) {
    return NextResponse.json(
      { ok: false, message: "The consultation could not be loaded. Refresh in a moment." },
      { status: 503 },
    );
  }

  if (primary.ok) {
    booking = primary.data as WpRoom;
  } else {
    const miss = primary.data as { code?: string; message?: string } | null;
    if (miss?.code === "rest_no_route" && token) {
      const fallback = await roomFromBookings(id, token);
      if ("error" in fallback) {
        return NextResponse.json({ ok: false, message: fallback.error }, { status: fallback.status });
      }
      booking = fallback.booking;
    } else if (primary.status === 404) {
      return NextResponse.json({ ok: false, message: "This consultation was not found." }, { status: 404 });
    } else {
      return NextResponse.json({ ok: false, message: "This video link is not valid." }, { status: 403 });
    }
  }

  const slot = describeConsultationRoom({
    bookingDate: booking.booking_date || "",
    startTime: booking.start_time || "",
    endTime: booking.end_time,
    slotOffer: booking.slot_offer,
    status: booking.status,
    timeZone: booking.timezone || "",
    slotMinutes: booking.slot_minutes,
  });
  if (!slot) {
    return NextResponse.json({ ok: false, message: "This booking has no scheduled time." }, { status: 422 });
  }

  const role = booking.role === "host" ? "host" : "guest";
  const payload: Record<string, unknown> = {
    ok: true,
    phase: slot.phase,
    role,
    title: booking.service_title || "Consultation",
    bookedLabel: slot.bookedLabel,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    opensAt: slot.opensAt,
    closesAt: slot.closesAt,
    videoReady: false,
  };

  if (slot.phase === "live") {
    const storedRoom = booking.room_id || "";
    const roomId = storedRoom === `consult${id}` ? storedRoom : `consult${id}`;
    const userId = role === "host" ? `h${id}` : `c${id}`;
    const creds = videoCredentials(roomId, userId);
    if (creds) {
      payload.videoReady = true;
      payload.appId = creds.appId;
      payload.token = creds.token;
      payload.roomId = roomId;
      payload.userId = userId;
      payload.userName = role === "host" ? "MaharshiOm" : displayName(booking.customer_name, "Guest");
    }
  }

  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
