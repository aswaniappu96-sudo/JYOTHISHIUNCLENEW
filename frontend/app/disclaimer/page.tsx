import type { Metadata } from "next";
import { fallbackSettings, getPage, getSettings, settleApi } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";
import { applyDisclaimerContact, DISCLAIMER_FALLBACK } from "@/lib/disclaimerHtml";

export const revalidate = 60;

export const metadata: Metadata = { title: "Disclaimer" };

export default async function DisclaimerPage() {
  const [page, settings] = await Promise.all([
    settleApi(getPage("disclaimer"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);
  const fromCms = page?.content && !/traditional astrology guidance/i.test(page.content) ? page.content : "";
  const html = applyDisclaimerContact(fromCms || DISCLAIMER_FALLBACK, settings);

  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title={page?.title || "Disclaimer"}
        copy="Last updated 12th October 2026"
        wide
      />
      <article className="prose-ju prose-legal mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 lg:px-[56px]" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
