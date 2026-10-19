import type { Metadata } from "next";
import { fallbackSettings, getPage, getSettings, settleApi } from "@/lib/api/wordpress";
import { LocalizedLegalDoc } from "@/components/pages/LocalizedLegalDoc";

export const revalidate = 60;

export const metadata: Metadata = { title: "Privacy policy" };

export default async function PrivacyPage() {
  const [page, settings] = await Promise.all([
    settleApi(getPage("privacy-policy"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);

  return <LocalizedLegalDoc kind="privacy" page={page} settings={settings} />;
}
