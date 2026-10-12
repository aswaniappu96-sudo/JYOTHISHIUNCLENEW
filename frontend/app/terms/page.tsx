import type { Metadata } from "next";
import { fallbackSettings, getPage, getSettings, settleApi } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";
import { applyTermsContact, TERMS_FALLBACK } from "@/lib/termsHtml";

export const revalidate = 60;

export const metadata: Metadata = { title: "Terms & conditions" };

export default async function TermsPage() {
  const [page, settings] = await Promise.all([
    settleApi(getPage("terms"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);
  const fromCms = page?.content && !/sample terms text/i.test(page.content) ? page.content : "";
  const html = applyTermsContact(fromCms || TERMS_FALLBACK, settings);

  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title={page?.title || "Terms & Conditions of Use"}
        copy="Last updated 12th October 2026"
        wide
      />
      <article className="prose-ju prose-legal mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 lg:px-[56px]" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
