import type { Metadata } from "next";
import { getPage, settleApi } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";

export const revalidate = 60;

export const metadata: Metadata = { title: "Refund policy" };

export default async function RefundPolicyPage() {
  const page = await settleApi(getPage("refund-policy"), null);
  return (
    <>
      <PageIntro eyebrow="Legal" title={page?.title || "Refund policy"} />
      <article
        className="prose-ju mx-auto max-w-3xl px-5 py-16"
        dangerouslySetInnerHTML={{
          __html:
            page?.content ||
            "<p>Fees are agreed privately before you pay. To request a refund or reschedule, write to the JyothishiUncle team on WhatsApp as early as you can. Confirmed bookings follow the note shared with you at the time of payment.</p>",
        }}
      />
    </>
  );
}
