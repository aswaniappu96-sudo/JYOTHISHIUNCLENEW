/** Lahiri sidereal nakshatra / tithi for a visitor timezone. Default: India. */

export const DEFAULT_TIMEZONE = "Asia/Kolkata";

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

const TITHI_NAMES = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
] as const;

const ZONE_LABELS: Record<string, string> = {
  "Asia/Kolkata": "India",
  "Asia/Calcutta": "India",
  "Asia/Dubai": "Dubai",
  "Asia/Muscat": "Gulf",
  "Asia/Qatar": "Qatar",
  "Asia/Riyadh": "Riyadh",
  "Asia/Kuwait": "Kuwait",
  "Asia/Bahrain": "Bahrain",
  "Asia/Singapore": "Singapore",
  "Asia/Kuala_Lumpur": "Malaysia",
  "Asia/Colombo": "Sri Lanka",
  "Asia/Kathmandu": "Nepal",
  "Asia/Dhaka": "Bangladesh",
  "America/New_York": "New York",
  "America/Chicago": "Chicago",
  "America/Denver": "Denver",
  "America/Los_Angeles": "Los Angeles",
  "America/Toronto": "Toronto",
  "America/Vancouver": "Vancouver",
  "Europe/London": "London",
  "Australia/Sydney": "Sydney",
};

const NAKSHATRA_SPAN = 360 / 27;
const PADA_SPAN = NAKSHATRA_SPAN / 4;

export type PanchangSnapshot = {
  timezone: string;
  zoneLabel: string;
  nakshatraLabel: string;
  tithiLabel: string;
};

export function visitorTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export function zoneDisplayName(tz: string): string {
  if (ZONE_LABELS[tz]) return ZONE_LABELS[tz];
  const city = tz.split("/").pop()?.replace(/_/g, " ");
  return city || "India";
}

function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function norm360(value: number): number {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

function sind(degrees: number): number {
  return Math.sin((degrees * Math.PI) / 180);
}

function sunLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const mean = norm360(280.460 + 0.9856474 * n);
  const anomaly = norm360(357.528 + 0.9856003 * n);
  return norm360(mean + 1.915 * sind(anomaly) + 0.02 * sind(2 * anomaly));
}

function moonLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  const l = 218.3164477 + 481267.88123421 * t;
  const d = 297.8501921 + 445267.1114034 * t;
  const m = 357.5291092 + 35999.0502909 * t;
  const mp = 134.9633964 + 477198.8673981 * t;
  const f = 93.272095 + 483202.0175233 * t;
  return norm360(
    l +
      6.289 * sind(mp) +
      1.274 * sind(2 * d - mp) +
      0.658 * sind(2 * d) +
      0.214 * sind(2 * mp) +
      0.186 * sind(m) +
      0.114 * sind(2 * f) +
      0.059 * sind(2 * d - 2 * mp) +
      0.057 * sind(2 * d - m - mp) +
      0.053 * sind(2 * d + mp) +
      0.046 * sind(2 * d - m) +
      0.041 * sind(m - mp) +
      0.035 * sind(d) +
      0.03 * sind(m + mp),
  );
}

function lahiriAyanamsa(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  return 23.852931 + 1.39656486 * t + 0.000139 * t * t;
}

function timeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value || 0);
  const asUtc = Date.UTC(read("year"), read("month") - 1, read("day"), read("hour"), read("minute"), read("second"));
  return asUtc - date.getTime();
}

/** Instant for local civil date + clock in a timezone (so America and India use their own “today”). */
function zonedDateTime(timeZone: string, at: Date, hour: number, minute: number): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(at);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value || 0);
  const year = read("year");
  const month = read("month");
  const day = read("day");
  let utc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  utc = new Date(utc.getTime() - timeZoneOffsetMs(utc, timeZone));
  utc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0) - timeZoneOffsetMs(utc, timeZone));
  return utc;
}

export function getPanchang(timezone = DEFAULT_TIMEZONE, at = new Date()): PanchangSnapshot {
  let tz = timezone || DEFAULT_TIMEZONE;
  let moment = at;
  try {
    const localNow = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(at);
    const hour = Number(localNow.find((part) => part.type === "hour")?.value || 12);
    const minute = Number(localNow.find((part) => part.type === "minute")?.value || 0);
    moment = zonedDateTime(tz, at, hour, minute);
  } catch {
    tz = DEFAULT_TIMEZONE;
    moment = at;
  }
  const jd = julianDate(moment);
  const ayanamsa = lahiriAyanamsa(jd);
  const sun = norm360(sunLongitude(jd) - ayanamsa);
  const moon = norm360(moonLongitude(jd) - ayanamsa);
  const elongation = norm360(moon - sun);

  const tithiIndex = Math.min(29, Math.floor(elongation / 12));
  const shukla = tithiIndex < 15;
  const tithiInPaksha = tithiIndex % 15;
  let tithiLabel: string;
  if (tithiIndex === 14) tithiLabel = "Purnima";
  else if (tithiIndex === 29) tithiLabel = "Amavasya";
  else tithiLabel = `${shukla ? "Shukla" : "Krishna"} ${TITHI_NAMES[tithiInPaksha]}`;

  const nakIndex = Math.min(26, Math.floor(moon / NAKSHATRA_SPAN));
  const pada = Math.min(4, Math.floor((moon % NAKSHATRA_SPAN) / PADA_SPAN) + 1);
  const ordinal = ["1st", "2nd", "3rd", "4th"][pada - 1];

  return {
    timezone: tz,
    zoneLabel: zoneDisplayName(tz),
    nakshatraLabel: `${NAKSHATRAS[nakIndex]} ${ordinal} Pada`,
    tithiLabel,
  };
}
