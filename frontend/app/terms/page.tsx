import type { Metadata } from "next";
import { fallbackSettings, getPage, getSettings, settleApi } from "@/lib/api/wordpress";
import { LocalizedLegalDoc } from "@/components/pages/LocalizedLegalDoc";

export const revalidate = 60;

export const metadata: Metadata = { title: "Terms & conditions" };

export default async function TermsPage() {
  const [page, settings] = await Promise.all([
    settleApi(getPage("terms"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);

  return <LocalizedLegalDoc kind="terms" page={page} settings={settings} />;
}
