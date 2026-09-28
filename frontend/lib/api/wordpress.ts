import { cache } from "react";
import { wpFetch, wpFetchOptional } from "@/lib/api/client";
import { decodeWpText } from "@/lib/html";
import { stripOmanDeep } from "@/lib/publicCopy";
import type {
  Article,
  AstrologyService,
  Astrologer,
  FaqItem,
  HomePayload,
  Pooja,
  Product,
  SiteSettings,
  Testimonial,
  TravelDestination,
  Vendor,
  WPPage,
} from "@/types/wordpress";

export async function getSettings() {
  return stripOmanDeep(await settleApi(wpFetch<SiteSettings>("/settings"), emptySettings));
}

export async function getPoojas(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return stripOmanDeep(await settleApi(wpFetch<Pooja[]>(`/poojas${query}`), []));
}

export async function getPooja(slug: string) {
  const item = await wpFetchOptional<Pooja>(`/poojas/${slug}`);
  return item ? stripOmanDeep(item) : null;
}

export async function getVendors() {
  return stripOmanDeep(await settleApi(wpFetch<Vendor[]>("/vendors"), []));
}

export async function getProducts(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return stripOmanDeep(await settleApi(wpFetch<Product[]>(`/products${query}`), []));
}

export async function getProduct(slug: string) {
  const item = await wpFetchOptional<Product>(`/products/${slug}`);
  return item ? stripOmanDeep(item) : null;
}

export async function getServices() {
  return stripOmanDeep(await settleApi(wpFetch<AstrologyService[]>("/services"), []));
}

export async function getAstrologers(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return stripOmanDeep(await settleApi(wpFetch<Astrologer[]>(`/astrologers${query}`), []));
}

export async function getService(slug: string) {
  const item = await wpFetchOptional<AstrologyService>(`/services/${slug}`);
  return item ? stripOmanDeep(item) : null;
}

export async function getTravelDestinations(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return stripOmanDeep(await settleApi(wpFetch<TravelDestination[]>(`/travel${query}`), []));
}

export async function getTravelDestination(slug: string) {
  const item = await wpFetchOptional<TravelDestination>(`/travel/${slug}`);
  return item ? stripOmanDeep(item) : null;
}

export async function getArticles() {
  return stripOmanDeep(await settleApi(wpFetch<Article[]>("/articles"), []));
}

export async function getArticle(slug: string) {
  const item = await wpFetchOptional<Article>(`/articles/${slug}`);
  return item ? stripOmanDeep(item) : null;
}

export async function getFAQs() {
  return stripOmanDeep(await settleApi(wpFetch<FaqItem[]>("/faqs"), []));
}

export async function getTestimonials() {
  return stripOmanDeep(await settleApi(wpFetch<Testimonial[]>("/testimonials"), []));
}

export async function getPage(slug: string) {
  const page = await wpFetchOptional<WPPage>(`/pages/${slug}`);
  if (!page) return null;
  return stripOmanDeep({
    ...page,
    title: decodeWpText(page.title || ""),
    eyebrow: decodeWpText(page.eyebrow || ""),
    hero_copy: decodeWpText(page.hero_copy || ""),
    portrait_name: decodeWpText(page.portrait_name || ""),
    portrait_caption: decodeWpText(page.portrait_caption || ""),
    image_1_title: decodeWpText(page.image_1_title || ""),
    image_1_copy: decodeWpText(page.image_1_copy || ""),
    image_2_title: decodeWpText(page.image_2_title || ""),
    image_2_copy: decodeWpText(page.image_2_copy || ""),
  });
}

export async function getConsultationAvailability(service?: string, month?: string) {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (month) params.set("month", month);
  const query = params.toString();
  return wpFetch<import("@/types/forms").AvailabilityMonth>(`/consultation/availability${query ? `?${query}` : ""}`);
}

const emptySettings: SiteSettings = {
  site_tagline: "JyothishiUncle",
  whatsapp_number: "",
  phone_number: "",
  address: "",
  hero_title: "JyothishiUncle",
  hero_subtitle: "Pooja, astrology consultation, and spiritual guidance worldwide.",
  hero_primary_cta_label: "Book a consultation",
  hero_primary_cta_url: "/consultation",
  about_excerpt: "JyothishiUncle.com is a venture from a family of Traditional Astrologers with more than 500+ years of tradition.",
  consultation_timezone: "Asia/Muscat",
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
  about_teaser_image: null,
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
  const settings = await settleApi(wpFetch<SiteSettings>("/settings"), emptySettings);
  const [poojas, products, astrologers, services] = await Promise.all([
    settleApi(wpFetch<Pooja[]>("/poojas?homepage=1"), []),
    settleApi(wpFetch<Product[]>("/products?homepage=1"), []),
    settleApi(wpFetch<Astrologer[]>("/astrologers?homepage=1"), []),
    settleApi(wpFetch<AstrologyService[]>("/services"), []),
  ]);
  const [travel, faqs, testimonials, articles] = await Promise.all([
    settleApi(wpFetch<TravelDestination[]>("/travel?homepage=1"), []),
    settleApi(wpFetch<FaqItem[]>("/faqs"), []),
    settleApi(wpFetch<Testimonial[]>("/testimonials"), []),
    settleApi(wpFetch<Article[]>("/articles"), []),
  ]);
  return stripOmanDeep({ settings, poojas, products, astrologers, services, travel, faqs, testimonials, articles });
});
