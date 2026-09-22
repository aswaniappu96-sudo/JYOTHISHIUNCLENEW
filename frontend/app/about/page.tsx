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
      "The unbroken lineage of stellar seers — Sri Devadathan Namboothiri, ESTD 1989. Vedic astrology, homam, and compassionate guidance from JyothishiUncle.",
  };
}

export default async function AboutPage() {
  const page = await settleApi(getPage("about"), null);
  return <AboutView page={page} />;
}
