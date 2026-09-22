import type { Metadata } from "next";
import { getPage, settleApi } from "@/lib/api/wordpress";
import { PageIntro } from "@/components/layout/PageIntro";

export const revalidate = 60;

export const metadata: Metadata = { title: "Privacy policy" };

export default async function PrivacyPage() {
  const page = await settleApi(getPage("privacy-policy"), null);
  return (
    <>
      <PageIntro eyebrow="Legal" title={page?.title || "Privacy policy"} />
      <article
        className="prose-ju mx-auto max-w-3xl px-5 py-16"
        dangerouslySetInnerHTML={{
          __html:
            page?.content ||
            "<p>We collect name, email, mobile, location, and messages when you enquire or book. This information is used to respond to you and is not sold.</p>",
        }}
      />
    </>
  );
}
