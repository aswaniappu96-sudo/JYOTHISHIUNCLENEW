"use client";

import { PageIntro } from "@/components/layout/PageIntro";
import { applyDisclaimerContact, DISCLAIMER_FALLBACK } from "@/lib/disclaimerHtml";
import { applyPrivacyContact, PRIVACY_FALLBACK } from "@/lib/privacyHtml";
import { applyRefundContact, REFUND_FALLBACK } from "@/lib/refundHtml";
import { applyTermsContact, TERMS_FALLBACK } from "@/lib/termsHtml";
import { useLocalizedPage } from "@/lib/localized";
import type { SiteSettings, WPPage } from "@/types/wordpress";

const DOCS = {
  terms: {
    title: "Terms & Conditions of Use",
    fallback: TERMS_FALLBACK,
    sample: /sample terms text/i,
    apply: applyTermsContact,
  },
  privacy: {
    title: "Privacy Policy",
    fallback: PRIVACY_FALLBACK,
    sample: /sample privacy text/i,
    apply: applyPrivacyContact,
  },
  disclaimer: {
    title: "Disclaimer",
    fallback: DISCLAIMER_FALLBACK,
    sample: /traditional astrology guidance/i,
    apply: applyDisclaimerContact,
  },
  refund: {
    title: "Refund Policy",
    fallback: REFUND_FALLBACK,
    sample: /fees are agreed privately/i,
    apply: applyRefundContact,
  },
} as const;

export function LocalizedLegalDoc({
  kind,
  page,
  settings,
  copy = "Last updated 12th October 2026",
}: {
  kind: keyof typeof DOCS;
  page: WPPage | null;
  settings: SiteSettings;
  copy?: string;
}) {
  const loc = useLocalizedPage(page);
  const doc = DOCS[kind];
  const fromCms = loc?.content && !doc.sample.test(loc.content) ? loc.content : "";
  const html = doc.apply(fromCms || doc.fallback, settings);

  return (
    <>
      <PageIntro eyebrow={loc?.eyebrow || "Legal"} title={loc?.title || doc.title} copy={copy} wide />
      <article
        className="prose-ju prose-legal mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 lg:px-[56px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
