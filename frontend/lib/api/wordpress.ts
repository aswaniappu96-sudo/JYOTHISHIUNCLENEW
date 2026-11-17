import { cache } from "react";
import { wpFetch, wpFetchOptional } from "@/lib/api/client";
import { rewriteBrandDeep } from "@/lib/brand";
import { decodeWpText } from "@/lib/html";
import { stripOmanDeep } from "@/lib/publicCopy";
import { withCurrentTemplePosts } from "@/lib/templeNames";
import type {
  Article,
  AstrologyService,
  Astrologer,
  ContentI18n,
  FaqItem,
  HomePayload,
  CatalogCategory,
  Pooja,
  Product,
  SiteSettings,
  Testimonial,
  TravelDestination,
  Vendor,
  WPPage,
} from "@/types/wordpress";

function publicSite<T>(value: T) {
  return rewriteBrandDeep(stripOmanDeep(value));
}

export function presentVendors(value: unknown) {
  if (!Array.isArray(value)) return publicSite(value);
  return publicSite(withCurrentTemplePosts(value));
}

function decodeI18n(i18n?: ContentI18n): ContentI18n | undefined {
  if (!i18n) return i18n;
  const out: ContentI18n = {};
  for (const [locale, pack] of Object.entries(i18n)) {
    if (!pack) continue;
    const next: Record<string, string> = {};
    for (const [key, value] of Object.entries(pack)) {
      if (value) next[key] = decodeWpText(value);
    }
    out[locale] = next;
  }
  return out;
}

const freshSettings = { cache: "no-store" as const };

export async function getSettings() {
  return publicSite(await settleApi(wpFetch<SiteSettings>("/settings", freshSettings), emptySettings));
}

export async function getPoojas(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return publicSite(await settleApi(wpFetch<Pooja[]>(`/poojas${query}`), []));
}

export async function getPoojaCategories() {
  return publicSite(await settleApi(wpFetch<CatalogCategory[]>("/pooja-categories"), []));
}

export async function getPooja(slug: string) {
  const item = await wpFetchOptional<Pooja>(`/poojas/${slug}`);
  return item ? publicSite(item) : null;
}

export async function getVendors() {
  const vendors = await settleApi(wpFetch<Vendor[]>("/vendors"), []);
  return publicSite(withCurrentTemplePosts(vendors));
}

export async function getProducts(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return publicSite(await settleApi(wpFetch<Product[]>(`/products${query}`), []));
}

export async function getProductCategories() {
  return publicSite(await settleApi(wpFetch<CatalogCategory[]>("/product-categories"), []));
}

export async function getProduct(slug: string) {
  const item = await wpFetchOptional<Product>(`/products/${slug}`);
  return item ? publicSite(item) : null;
}

export async function getServices() {
  return publicSite(await settleApi(wpFetch<AstrologyService[]>("/services"), []));
}

export async function getAstrologers(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return publicSite(await settleApi(wpFetch<Astrologer[]>(`/astrologers${query}`), []));
}

export async function getAstrologer(slug: string) {
  const item = await wpFetchOptional<Astrologer>(`/astrologers/${slug}`);
  return item ? publicSite(item) : null;
}

export async function resolveAstrologer(slug: string) {
  const direct = await getAstrologer(slug);
  if (direct) return direct;
  const all = await getAstrologers();
  const wanted = slug.toLowerCase();
  return (
    all.find((item) => {
      const name = (item.title || "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return name === wanted;
    }) || null
  );
}

export async function getService(slug: string) {
  const item = await wpFetchOptional<AstrologyService>(`/services/${slug}`);
  return item ? publicSite(item) : null;
}

export async function getTravelDestinations(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return publicSite(await settleApi(wpFetch<TravelDestination[]>(`/travel${query}`), []));
}

export async function getTravelDestination(slug: string) {
  const item = await wpFetchOptional<TravelDestination>(`/travel/${slug}`);
  return item ? publicSite(item) : null;
}

export async function getArticles() {
  return publicSite(await settleApi(wpFetch<Article[]>("/articles"), []));
}

export async function getArticle(slug: string) {
  const item = await wpFetchOptional<Article>(`/articles/${slug}`);
  return item ? publicSite(item) : null;
}

export async function getFAQs() {
  return publicSite(await settleApi(wpFetch<FaqItem[]>("/faqs"), []));
}

export async function getTestimonials() {
  return publicSite(await settleApi(wpFetch<Testimonial[]>("/testimonials"), []));
}

export async function getPage(slug: string) {
  const page = await wpFetchOptional<WPPage>(`/pages/${slug}`);
  if (!page) return null;
  const textKeys = [
    "title",
    "eyebrow",
    "hero_copy",
    "root_1_title",
    "root_1_copy",
    "root_2_title",
    "root_2_copy",
    "root_3_title",
    "root_3_copy",
    "root_4_title",
    "root_4_copy",
    "about_eyebrow",
    "about_lead",
    "about_accent",
    "portrait_name",
    "portrait_caption",
    "tantric_eyebrow",
    "tantric_lead",
    "tantric_accent",
    "tantric_copy",
    "list_eyebrow",
    "list_title",
    "list_copy",
    "list2_eyebrow",
    "list2_title",
    "list2_copy",
    "photos_eyebrow",
    "photos_lead",
    "photos_copy",
    "photo1_badge",
    "photo1_title",
    "photo1_copy",
    "photo2_badge",
    "cta_eyebrow",
    "cta_title",
    "cta_copy",
    "unique_eyebrow",
    "unique_title",
    "unique_copy",
    "unique_1_title",
    "unique_1_copy",
    "unique_1_note",
    "unique_2_title",
    "unique_2_copy",
    "unique_2_note",
    "unique_3_title",
    "unique_3_copy",
    "unique_3_note",
    "unique_4_title",
    "unique_4_copy",
    "unique_4_note",
    "stat_1_value",
    "stat_1_note",
    "stat_2_value",
    "stat_2_note",
    "stat_3_value",
    "stat_3_note",
    "stat_4_value",
    "stat_4_note",
    "wisdom_eyebrow",
    "wisdom_title",
    "wisdom_copy",
    "wisdom_1_kicker",
    "wisdom_1_title",
    "wisdom_1_copy",
    "wisdom_1_left",
    "wisdom_1_right",
    "wisdom_2_kicker",
    "wisdom_2_title",
    "wisdom_2_copy",
    "wisdom_2_left",
    "wisdom_2_right",
    "wisdom_3_kicker",
    "wisdom_3_title",
    "wisdom_3_copy",
    "wisdom_3_left",
    "wisdom_3_right",
    "image_1_title",
    "image_1_copy",
    "image_2_title",
    "image_2_copy",
  ] as const;
  const decoded: WPPage = {
    ...page,
    i18n: decodeI18n(page.i18n),
  };
  for (const key of textKeys) {
    const value = page[key];
    if (typeof value === "string") {
      decoded[key] = decodeWpText(value);
    }
  }
  if (/^(terms|privacy-policy|refund-policy|disclaimer)$/.test(slug)) {
    return rewriteBrandDeep(decoded);
  }
  return publicSite(decoded);
}

export async function getConsultationAvailability(service?: string, month?: string) {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (month) params.set("month", month);
  const query = params.toString();
  return wpFetch<import("@/types/forms").AvailabilityMonth>(`/consultation/availability${query ? `?${query}` : ""}`);
}

const emptySettings: SiteSettings = {
  site_tagline: "MaharshiOm",
  whatsapp_number: "",
  phone_number: "",
  contact_email: "support@maharshiom.com",
  address: "",
  hero_title: "MaharshiOm",
  hero_subtitle: "Pooja, astrology consultation, and spiritual guidance worldwide.",
  hero_primary_cta_label: "Book a consultation",
  hero_primary_cta_url: "/consultation",
  about_excerpt: "MaharshiOm.com is a venture from a family of Traditional Astrologers with more than 500+ years of tradition.",
  consultation_timezone: "Asia/Kolkata",
  consultation_slot_minutes: 30,
  consultation_days: [],
  consultation_start_time: "09:00",
  consultation_end_time: "18:00",
  meeting_methods: [],
  default_meeting_method: "zoom",
  show_prices_on_website: false,
  social_instagram: "",
  social_facebook: "",
  social_youtube: "",
  footer_text: "",
  brand: { midnight: "#0B1220", saffron: "#C45C26", cream: "#F6EFE6", ink: "#1A1A1A" },
  logo_url: "",
  logo: null,
  hero_image: null,
  hero_slides: [],
  hero_astro_slides: [],
  i18n: {},
  about_teaser_image: null,
  guidance_image: null,
  join_image: null,
  cta_image: null,
};

export async function settleApi<T>(task: Promise<T>, fallback: T): Promise<T> {
  try {
    return await task;
  } catch {
    return fallback;
  }
}

export function fallbackSettings() {
  return emptySettings;
}

export const getHomePayload = cache(async (): Promise<HomePayload> => {
  const [settings, poojas, products, astrologers, services, travel, faqs, testimonials, articles, vendors] =
    await Promise.all([
      settleApi(wpFetch<SiteSettings>("/settings", freshSettings), emptySettings),
      settleApi(wpFetch<Pooja[]>("/poojas"), []),
      settleApi(wpFetch<Product[]>("/products"), []),
      settleApi(wpFetch<Astrologer[]>("/astrologers"), []),
      settleApi(wpFetch<AstrologyService[]>("/services"), []),
      settleApi(wpFetch<TravelDestination[]>("/travel"), []),
      settleApi(wpFetch<FaqItem[]>("/faqs"), []),
      settleApi(wpFetch<Testimonial[]>("/testimonials"), []),
      settleApi(wpFetch<Article[]>("/articles"), []),
      settleApi(wpFetch<Vendor[]>("/vendors"), []),
    ]);
  return publicSite({
    settings,
    poojas,
    products,
    astrologers,
    services,
    travel,
    faqs,
    testimonials,
    articles,
    vendors: withCurrentTemplePosts(vendors),
  });
});
