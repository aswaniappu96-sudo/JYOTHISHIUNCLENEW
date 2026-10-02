import { ASTROLOGER_SERVICES } from "@/lib/astrologer-services";
import { stripHtml, stripPublicPrices } from "@/lib/html";
import { POOJAS_PATH, PRODUCTS_PATH } from "@/lib/siteRoutes";
import type { AstrologyService } from "@/types/wordpress";

export type SiteServiceLink = {
  id: string;
  label: string;
  short: string;
  hint: string;
  detail: string;
  href: string;
  group: "consult" | "offer";
  durationMinutes?: number;
};

export const OFFERING_SERVICES: SiteServiceLink[] = [
  {
    id: "pooja",
    label: "Pooja & Homam",
    short: "Pooja",
    hint: "Rituals arranged with care",
    detail: "Homam and pooja booked with a priest, then confirmed privately for your sankalpa.",
    href: POOJAS_PATH,
    group: "offer",
  },
  {
    id: "products",
    label: "Sacred products",
    short: "Products",
    hint: "Rudraksha, ghee, stones",
    detail: "Rudraksha, ghee, and puja items. Enquire privately — no public prices.",
    href: PRODUCTS_PATH,
    group: "offer",
  },
  {
    id: "yatra",
    label: "Temple Yatra",
    short: "Yatra",
    hint: "Darshan guidance",
    detail: "Temple timing and darshan notes so the family can travel with clarity.",
    href: "/religious-travel",
    group: "offer",
  },
  {
    id: "horoscope",
    label: "Daily horoscope",
    short: "Horoscope",
    hint: "Today’s rashi note",
    detail: "Free daily rashi, live panchang, and lucky notes. Full reading is by video.",
    href: "/#horoscope",
    group: "offer",
  },
  {
    id: "video",
    label: "Video consulting",
    short: "Video",
    hint: "Online session",
    detail: "Sit with an astrologer on video. Pick a free date on the calendar.",
    href: "/#consultation",
    group: "offer",
  },
];

export function publicSpecialtyLine(text: string): string {
  const mapped = stripPublicPrices(text || "")
    .replace(/ashtamangala\s*prasnam/gi, "Prashna")
    .replace(/thamboola\s*prasnam/gi, "Prashna")
    .replace(/jathakam(?:\s*analysis)?/gi, "Kundli")
    .replace(/jathaka(?:\s*analysis)?/gi, "Kundli")
    .replace(/prasnam/gi, "Prashna")
    .replace(/porutham(?:\s*\(horoscope matching\))?/gi, "Matchmaking")
    .replace(/\s*[|/·,]\s*/g, " · ");
  const parts = mapped
    .split(" · ")
    .map((part) => part.trim())
    .filter(Boolean);
  return [...new Set(parts.map((part) => publicServiceName(part) || part))].join(" · ");
}

export function publicServiceName(title: string): string {
  const t = stripPublicPrices(title || "").trim();
  const lower = t.toLowerCase();
  if (/ashtamangala/.test(lower)) return "Prashna";
  if (/porutham|guna milan|matchmaking/.test(lower)) return "Matchmaking";
  if (/jathak|kundli|birth.?chart/.test(lower)) return "Kundli";
  if (/prasnam|prashna/.test(lower)) return "Prashna";
  if (/parihara|remed/.test(lower)) return "Remedies";
  if (/family/.test(lower)) return "Family guidance";
  return t;
}

function publicServiceHint(title: string, hint: string): string {
  const cleaned = stripPublicPrices(stripHtml(hint || "")).trim();
  const lower = `${title} ${cleaned}`.toLowerCase();
  if (/ashtamangala|thamboola/.test(lower)) return "Question-based reading";
  if (/porutham|guna milan|matchmaking/.test(lower)) return "Guna milan";
  if (/jathak|kundli|birth.?chart/.test(lower)) return "Birth-chart reading";
  if (/prasnam|prashna/.test(lower)) return "Question-based predictions";
  if (/parihara|remed/.test(lower)) return "Planetary doshas & obstacles";
  if (/family/.test(lower)) return "Finance, career & marriage";
  return cleaned;
}

function publicServiceDetail(title: string, raw: string): string {
  const cleaned = stripPublicPrices(stripHtml(raw || "")).trim();
  if (cleaned.length > 48) return cleaned;
  const lower = `${title} ${cleaned}`.toLowerCase();
  if (/ashtamangala|thamboola|prasnam|prashna/.test(lower)) {
    return "One question, direct answer. Horary astrology for what’s stuck right now.";
  }
  if (/porutham|guna milan|matchmaking/.test(lower)) {
    return "Compatibility beyond charts. Guna milan, mangal, future remedies.";
  }
  if (/jathak|kundli|birth.?chart/.test(lower)) {
    return "Bring your birth chart. Leave with clarity on dasha, dosha and direction.";
  }
  if (/parihara|remed/.test(lower)) {
    return "Mantras, stones, practical fixes. Not fear — doable, daily correction.";
  }
  if (/family/.test(lower)) {
    return "For children, parents, home. Education, career, health and peace.";
  }
  return cleaned || "Personal video consulting with a JyothishiUncle astrologer.";
}

function uniqueByLabel(items: SiteServiceLink[]): SiteServiceLink[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function consultDuration(label: string, minutes?: number) {
  if (minutes) return minutes;
  const key = label.toLowerCase();
  if (/prashna/.test(key)) return 15;
  if (/match/.test(key)) return 40;
  if (/remed/.test(key)) return 20;
  return 30;
}

export function consultServicesFromWp(services: AstrologyService[]): SiteServiceLink[] {
  const fromWp = (services || [])
    .filter((service) => service?.title)
    .map((service) => {
      const label = publicServiceName(service.title);
      const raw = service.short_description || service.full_description || "";
      return {
        id: service.slug || label.toLowerCase().replace(/\s+/g, "-"),
        label,
        short: label.replace(" guidance", ""),
        hint: publicServiceHint(service.title, raw) || "Video consulting",
        detail: publicServiceDetail(service.title, raw),
        href: "/#consultation",
        group: "consult" as const,
        durationMinutes: consultDuration(label, service.duration_minutes || undefined),
      };
    })
    .filter((item) => item.label && !/^consultation$/i.test(item.label));

  if (fromWp.length) return uniqueByLabel(fromWp);

  return ASTROLOGER_SERVICES.filter((item) => item.title !== "Consultation").map((item) => ({
    id: item.title.toLowerCase().replace(/\s+/g, "-"),
    label: item.title,
    short: item.title.replace(" guidance", ""),
    hint: item.hint,
    detail: publicServiceDetail(item.title, item.hint),
    href: "/#consultation",
    group: "consult" as const,
    durationMinutes: consultDuration(item.title),
  }));
}

export function allSiteServices(services: AstrologyService[] = []): SiteServiceLink[] {
  const consult = consultServicesFromWp(services);
  const extra = OFFERING_SERVICES.filter(
    (item) => !consult.some((row) => row.label.toLowerCase() === item.label.toLowerCase() || row.short.toLowerCase() === item.short.toLowerCase()),
  );
  return uniqueByLabel([...consult, ...extra]);
}
