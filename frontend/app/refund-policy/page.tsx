import type { Metadata } from "next";
import { fallbackSettings, getPage, getSettings, settleApi } from "@/lib/api/wordpress";
import { LocalizedLegalDoc } from "@/components/pages/LocalizedLegalDoc";

export const revalidate = 60;

export const metadata: Metadata = { title: "Refund policy" };

export default async function RefundPolicyPage() {
  const [page, settings] = await Promise.all([
    settleApi(getPage("refund-policy"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);

  return <LocalizedLegalDoc kind="refund" page={page} settings={settings} />;
}
