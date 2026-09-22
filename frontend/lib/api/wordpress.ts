import { cache } from "react";
import { wpFetch, wpFetchOptional } from "@/lib/api/client";
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
  WPPage,
} from "@/types/wordpress";

export async function getSettings() {
  return wpFetch<SiteSettings>("/settings");
}

export async function getPoojas(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return wpFetch<Pooja[]>(`/poojas${query}`);
}

export async function getPooja(slug: string) {
  return wpFetchOptional<Pooja>(`/poojas/${slug}`);
}

export async function getProducts(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return wpFetch<Product[]>(`/products${query}`);
}

export async function getProduct(slug: string) {
  return wpFetchOptional<Product>(`/products/${slug}`);
}

export async function getServices() {
  return wpFetch<AstrologyService[]>("/services");
}

export async function getAstrologers() {
  return wpFetch<Astrologer[]>("/astrologers");
}

export async function getService(slug: string) {
  return wpFetchOptional<AstrologyService>(`/services/${slug}`);
}

export async function getTravelDestinations(homepage = false) {
  const query = homepage ? "?homepage=1" : "";
  return wpFetch<TravelDestination[]>(`/travel${query}`);
}

export async function getTravelDestination(slug: string) {
  return wpFetchOptional<TravelDestination>(`/travel/${slug}`);
}

export async function getArticles() {
  return wpFetch<Article[]>("/articles");
}

export async function getArticle(slug: string) {
  return wpFetchOptional<Article>(`/articles/${slug}`);
}

export async function getFAQs() {
  return wpFetch<FaqItem[]>("/faqs");
}

export async function getTestimonials() {
  return wpFetch<Testimonial[]>("/testimonials");
}

export async function getPage(slug: string) {
  return wpFetchOptional<WPPage>(`/pages/${slug}`);
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
  hero_subtitle: "Pooja, astrology consultation, and spiritual guidance from Oman.",
  hero_primary_cta_label: "Book a consultation",
  hero_primary_cta_url: "/consultation",
  about_excerpt: "",
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
  try {
    return await wpFetch<HomePayload>("/home");
  } catch {
    return {
      settings: emptySettings,
      poojas: [],
      products: [],
      services: [],
      travel: [],
      faqs: [],
      testimonials: [],
      articles: [],
    };
  }
});
