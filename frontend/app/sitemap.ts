import type { MetadataRoute } from "next";
import {
  getArticles,
  getAstrologers,
  getPoojas,
  getProducts,
  getTravelDestinations,
} from "@/lib/api/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [poojas, products, travel, articles, astrologers] = await Promise.all([
    getPoojas().catch(() => []),
    getProducts().catch(() => []),
    getTravelDestinations().catch(() => []),
    getArticles().catch(() => []),
    getAstrologers().catch(() => []),
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/astrologers",
    "/contact",
    "/blog",
    "/religious-travel",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/disclaimer",
    "/careers",
    "/help",
  ].map((path) => ({ url: `${base}${path}` }));

  return [
    ...staticRoutes,
    ...astrologers.map((item) => ({ url: `${base}/astrologers/${item.slug}` })),
    ...poojas.map((item) => ({ url: `${base}/pooja/${item.slug}` })),
    ...products.map((item) => ({ url: `${base}/product/${item.slug}` })),
    ...travel.map((item) => ({ url: `${base}/religious-travel/${item.slug}` })),
    ...articles.map((item) => ({ url: `${base}/blog/${item.slug}` })),
  ];
}
