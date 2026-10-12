import type { Metadata } from "next";
import { fallbackSettings, getPage, getSettings, settleApi } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";
import { applyPrivacyContact, PRIVACY_FALLBACK } from "@/lib/privacyHtml";

export const revalidate = 60;

export const metadata: Metadata = { title: "Privacy policy" };

export default async function PrivacyPage() {
  const [page, settings] = await Promise.all([
    settleApi(getPage("privacy-policy"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);
  const fromCms = page?.content && !/sample privacy text/i.test(page.content) ? page.content : "";
  const html = applyPrivacyContact(fromCms || PRIVACY_FALLBACK, settings);

  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title={page?.title || "Privacy Policy"}
        copy="Last updated 12th October 2026"
        wide
      />
      <article className="prose-ju prose-legal mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 lg:px-[56px]" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
