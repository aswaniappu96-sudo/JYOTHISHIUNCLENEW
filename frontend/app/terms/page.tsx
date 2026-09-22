import type { Metadata } from "next";
import { getPage } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";

export const revalidate = 60;

export const metadata: Metadata = { title: "Terms & conditions" };

export default async function TermsPage() {
  const page = await getPage("terms");
  return (
    <>
      <PageIntro eyebrow="Legal" title={page?.title || "Terms & conditions"} />
      <article className="prose-ju mx-auto max-w-3xl px-5 py-16" dangerouslySetInnerHTML={{ __html: page?.content || "" }} />
    </>
  );
}
