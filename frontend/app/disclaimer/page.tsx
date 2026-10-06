import type { Metadata } from "next";
import { getPage, settleApi } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";

export const revalidate = 60;

export const metadata: Metadata = { title: "Disclaimer" };

export default async function DisclaimerPage() {
  const page = await settleApi(getPage("disclaimer"), null);
  return (
    <>
      <PageIntro eyebrow="Legal" title={page?.title || "Disclaimer"} />
      <article
        className="prose-ju mx-auto max-w-3xl px-5 py-16"
        dangerouslySetInnerHTML={{
          __html:
            page?.content ||
            "<p>JyothishiUncle offers traditional astrology guidance, pooja, and related spiritual services. Readings are for personal insight and are not a substitute for medical, legal, financial, or other professional advice. Outcomes vary, and no result is guaranteed.</p>",
        }}
      />
    </>
  );
}
