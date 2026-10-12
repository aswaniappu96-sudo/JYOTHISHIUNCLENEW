import type { Metadata } from "next";
import { fallbackSettings, getPage, getSettings, settleApi } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";
import { applyRefundContact, REFUND_FALLBACK } from "@/lib/refundHtml";

export const revalidate = 60;

export const metadata: Metadata = { title: "Refund policy" };

export default async function RefundPolicyPage() {
  const [page, settings] = await Promise.all([
    settleApi(getPage("refund-policy"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);
  const fromCms = page?.content && !/fees are agreed privately/i.test(page.content) ? page.content : "";
  const html = applyRefundContact(fromCms || REFUND_FALLBACK, settings);

  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title={page?.title || "Refund Policy"}
        copy="Last updated 12th October 2026"
        wide
      />
      <article className="prose-ju prose-legal mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 lg:px-[56px]" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
