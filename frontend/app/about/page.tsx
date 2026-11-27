import type { Metadata } from "next";
import { AboutView } from "@/components/pages/AboutView";
import { getPage, settleApi } from "@/lib/api/wordpress";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await settleApi(getPage("about"), null);
  return {
    title: page?.title || "About us",
    description:
      page?.hero_copy ||
      "MaharshiOm.com is a venture from a family of Traditional Astrologers from Keralam with more than 500+ years of tradition.",
  };
}

export default async function AboutPage() {
  const page = await settleApi(getPage("about"), null);
  return <AboutView page={page} />;
}
