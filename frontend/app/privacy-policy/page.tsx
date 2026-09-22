import type { Metadata } from "next";
import { getPage } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";

export const revalidate = 60;

export const metadata: Metadata = { title: "Privacy policy" };

export default async function PrivacyPage() {
  const page = await getPage("privacy-policy");
  return (
    <>
      <PageIntro eyebrow="Legal" title={page?.title || "Privacy policy"} />
      <article className="prose-ju mx-auto max-w-3xl px-5 py-16" dangerouslySetInnerHTML={{ __html: page?.content || "" }} />
    </>
  );
}
