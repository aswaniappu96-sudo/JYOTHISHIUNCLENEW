import type { MetadataRoute } from "next";
import {
  getArticles,
  getPoojas,
  getProducts,
  getTravelDestinations,
} from "@/lib/api/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [poojas, products, travel, articles] = await Promise.all([
    getPoojas().catch(() => []),
    getProducts().catch(() => []),
    getTravelDestinations().catch(() => []),
    getArticles().catch(() => []),
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/contact",
    "/blog",
    "/religious-travel",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({ url: `${base}${path}` }));

  return [
    ...staticRoutes,
    ...poojas.map((item) => ({ url: `${base}/pooja/${item.slug}` })),
    ...products.map((item) => ({ url: `${base}/product/${item.slug}` })),
    ...travel.map((item) => ({ url: `${base}/religious-travel/${item.slug}` })),
    ...articles.map((item) => ({ url: `${base}/blog/${item.slug}` })),
  ];
}
