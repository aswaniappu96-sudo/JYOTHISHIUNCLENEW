const EARLY_MS = 10 * 60 * 1000;
const LATE_MS = 10 * 60 * 1000;

export type RoomPhase = "early" | "live" | "ended" | "closed";

export type ConsultationClock = {
  bookingDate: string;
  startTime: string;
  endTime?: string;
  slotOffer?: string;
  status?: string;
  timeZone: string;
  slotMinutes?: number;
  now?: Date;
};

export type ConsultationWindow = {
  phase: RoomPhase;
  bookedLabel: string;
  startsAt: string;
  endsAt: string;
  opensAt: string;
  closesAt: string;
};

function clockTime(value: string) {
  const match = /^(\d{2}):(\d{2})/.exec(value.trim());
  return match ? `${match[1]}:${match[2]}` : "";
}

function bookingDate(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

export function zonedInstant(date: string, time: string, timeZone: string) {
  const day = bookingDate(date);
  const hm = clockTime(time);
  if (!day || !hm) return null;
  const guess = new Date(`${day}T${hm}:00Z`);
  if (Number.isNaN(guess.getTime())) return null;
  try {
    Intl.DateTimeFormat("en-US", { timeZone }).format(guess);
  } catch {
    return null;
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(guess);
  const pick = (type: Intl.DateTimeFormatPartTypes) => {
    const raw = Number(parts.find((part) => part.type === type)?.value || "0");
    return type === "hour" && raw === 24 ? 0 : raw;
  };
  const asUtc = Date.UTC(pick("year"), pick("month") - 1, pick("day"), pick("hour"), pick("minute"), pick("second"));
  return new Date(guess.getTime() - (asUtc - guess.getTime()));
}

function wallClock(instant: Date, timeZone: string) {
  const hm = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(instant);
  return hm === "24:00" ? "00:00" : hm;
}

export function describeConsultationRoom(input: ConsultationClock): ConsultationWindow | null {
  const date = bookingDate(input.bookingDate);
  const startTime = clockTime(input.startTime);
  if (!date || !startTime || !input.timeZone) return null;
  const starts = zonedInstant(date, startTime, input.timeZone);
  if (!starts) return null;

  const offeredEnd = clockTime(input.endTime || "");
  const parsedEnd = offeredEnd ? zonedInstant(date, offeredEnd, input.timeZone) : null;
  const freeMinutes = /10\s*MIN/i.test(input.slotOffer || "") ? 10 : 0;
  const minutes = freeMinutes || Math.max(10, Number(input.slotMinutes) || 30);
  const ends =
    parsedEnd && parsedEnd.getTime() > starts.getTime()
      ? parsedEnd
      : new Date(starts.getTime() + minutes * 60 * 1000);

  const opens = new Date(starts.getTime() - EARLY_MS);
  const closes = new Date(ends.getTime() + LATE_MS);
  const now = input.now || new Date();
  const status = (input.status || "").toLowerCase();
  let phase: RoomPhase = "live";
  if (status === "completed" || status === "cancelled") phase = "closed";
  else if (now.getTime() < opens.getTime()) phase = "early";
  else if (now.getTime() > closes.getTime()) phase = "ended";

  const [year, month, day] = date.split("-").map(Number);
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));

  return {
    phase,
    bookedLabel: `${dateLabel}, ${startTime}–${wallClock(ends, input.timeZone)}`,
    startsAt: starts.toISOString(),
    endsAt: ends.toISOString(),
    opensAt: opens.toISOString(),
    closesAt: closes.toISOString(),
  };
}

export function consultationVideoPath(id: number, roomKey?: string) {
  const params = new URLSearchParams();
  if (roomKey) params.set("k", roomKey);
  const query = params.toString();
  return `/consult/${id}${query ? `?${query}` : ""}`;
}
