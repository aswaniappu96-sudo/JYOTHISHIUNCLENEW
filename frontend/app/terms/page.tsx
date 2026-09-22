import type { Metadata } from "next";
import { getPage, settleApi } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";

export const revalidate = 60;

export const metadata: Metadata = { title: "Terms & conditions" };

export default async function TermsPage() {
  const page = await settleApi(getPage("terms"), null);
  return (
    <>
      <PageIntro eyebrow="Legal" title={page?.title || "Terms & conditions"} />
      <article
        className="prose-ju mx-auto max-w-3xl px-5 py-16"
        dangerouslySetInnerHTML={{
          __html:
            page?.content ||
            "<p>Consultations are online. Bookings are requests until the JyothishiUncle team confirms the time and sends a meeting link. Fees are agreed privately.</p>",
        }}
      />
    </>
  );
}
