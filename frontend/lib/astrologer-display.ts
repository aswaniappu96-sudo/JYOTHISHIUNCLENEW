import { decodeWpText } from "@/lib/html";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/localized";
import { publicSpecialtyLine } from "@/lib/siteServices";
import type { Astrologer } from "@/types/wordpress";

export type PortraitMeta = {
  location: string;
  rating: string;
  status: string;
  statusClass: string;
};

export const PORTRAITS: PortraitMeta[] = [
  { location: "India", rating: "4.98", status: "Online", statusClass: "text-primary" },
  { location: "Varanasi, Uttar Pradesh", rating: "4.95", status: "Available", statusClass: "text-secondary" },
  { location: "Rameswaram, Tamil Nadu", rating: "4.97", status: "Online", statusClass: "text-tertiary-container" },
  { location: "Ujjain, Madhya Pradesh", rating: "4.96", status: "Online", statusClass: "text-primary" },
];

export type GuidanceTopicId =
  | "love"
  | "marriage"
  | "career"
  | "business"
  | "family"
  | "vastu"
  | "tarot"
  | "numerology"
  | "remedies";

export const GUIDANCE_TOPIC_IDS: GuidanceTopicId[] = [
  "love",
  "marriage",
  "career",
  "business",
  "family",
  "vastu",
  "tarot",
  "numerology",
  "remedies",
];

const TOPIC_RE: Record<GuidanceTopicId, RegExp> = {
  love: /love|relationship|match|porutham|guna|compat/i,
  marriage: /marriage|kundli|kundali|jathak|match|porutham|mangal/i,
  career: /career|job|work|profession/i,
  business: /business|finance|money|wealth|trade/i,
  family: /family|home|child|parent/i,
  vastu: /vastu/i,
  tarot: /tarot/i,
  numerology: /numerolog|number/i,
  remedies: /remed|parihara|dosha|upay/i,
};

export function isGuidanceTopic(value: string | null | undefined): value is GuidanceTopicId {
  return Boolean(value && GUIDANCE_TOPIC_IDS.includes(value as GuidanceTopicId));
}

export function guidanceTopicHref(topic: GuidanceTopicId) {
  return `/astrologers?topic=${topic}`;
}

function topicsFor(hay: string, index: number): GuidanceTopicId[] {
  const matched = GUIDANCE_TOPIC_IDS.filter((id) => TOPIC_RE[id].test(hay));
  const assigned = [0, 3, 6].map((step) => GUIDANCE_TOPIC_IDS[(index + step) % GUIDANCE_TOPIC_IDS.length]);
  return [...new Set([...matched, ...assigned])];
}

export type AstrologerView = {
  person: Astrologer;
  index: number;
  name: string;
  specialty: string;
  tags: string[];
  location: string;
  rating: string;
  ratingValue: number;
  reviews: number;
  online: boolean;
  experienceYears: number;
  languages: string;
  isNew: boolean;
  summary: string;
  about: string;
  firstSession: string;
  topics: GuidanceTopicId[];
};

export type AstrologerFilter = "all" | "online" | "rated" | "newest";

function languagesFor(location: string, index: number) {
  const loc = location.toLowerCase();
  if (/tamil|rameswaram|madurai|chennai|coimbatore/.test(loc)) return "Tamil · English";
  if (/kerala|malayalam|kochi|thrissur|kozhikode/.test(loc)) return "Malayalam · English";
  if (/karnataka|bengaluru|bangalore|mysore|mysuru/.test(loc)) return "Kannada · English · Hindi";
  if (/andhra|telangana|hyderabad|vijayawada|visakhapatnam/.test(loc)) return "Telugu · English";
  if (/maharashtra|mumbai|pune|nagpur/.test(loc)) return "Marathi · Hindi · English";
  const fallbacks = ["Hindi · English", "Hindi · English · Sanskrit", "English · Hindi", "Hindi · Gujarati · English"];
  return fallbacks[index % fallbacks.length];
}

function specialtyTags(text: string) {
  return text
    .split(" · ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export function buildAstrologerViews(list: Astrologer[], locale: Locale = "en"): AstrologerView[] {
  const ids = list.map((person) => Number(person.id) || 0);
  const newest = new Set([...ids].sort((a, b) => b - a).slice(0, Math.min(2, ids.length)));

  return list.map((raw, index) => {
    const person = withLocale(raw, locale);
    const meta = PORTRAITS[index % PORTRAITS.length];
    const name = decodeWpText(person.title || "");
    const location = decodeWpText(person.location || "") || meta.location;
    const specialty = publicSpecialtyLine(decodeWpText(person.specialty || person.short_description || ""));
    const summary = decodeWpText(person.short_description || "");
    const about = decodeWpText(person.full_description || "");
    const id = Number(person.id) || index + 1;
    const ratingValue = Number(meta.rating) || 4.9;
    const hay = `${specialty} ${summary} ${about}`;
    return {
      person,
      index,
      name,
      specialty,
      tags: specialtyTags(specialty),
      location,
      rating: meta.rating,
      ratingValue,
      reviews: 48 + ((id * 37) % 320),
      online: meta.status === "Online" || index % 4 !== 3,
      experienceYears: 10 + ((id * 5) % 16),
      languages: languagesFor(location, index),
      isNew: newest.has(id),
      summary,
      about,
      firstSession: decodeWpText(person.first_session_note || ""),
      topics: topicsFor(hay, index),
    };
  });
}

export function filterAstrologers(
  views: AstrologerView[],
  filter: AstrologerFilter,
  topic?: GuidanceTopicId | null,
): AstrologerView[] {
  let next = views;
  if (topic) {
    const matched = views.filter((item) => item.topics.includes(topic));
    next = matched.length ? matched : views;
  }
  if (filter === "online") return next.filter((item) => item.online);
  if (filter === "rated") return [...next].sort((a, b) => b.ratingValue - a.ratingValue || b.reviews - a.reviews);
  if (filter === "newest") {
    const newest = next.filter((item) => item.isNew);
    return newest.length ? newest : [...next].slice(-2).reverse();
  }
  return next;
}

export function astrologerViewFor(person: Astrologer, list: Astrologer[], locale: Locale = "en"): AstrologerView {
  const views = buildAstrologerViews(list.length ? list : [person], locale);
  return views.find((item) => item.person.slug === person.slug || item.person.id === person.id) || views[0];
}
