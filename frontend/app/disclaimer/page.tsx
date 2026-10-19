import type { Metadata } from "next";
import { fallbackSettings, getPage, getSettings, settleApi } from "@/lib/api/wordpress";
import { LocalizedLegalDoc } from "@/components/pages/LocalizedLegalDoc";

export const revalidate = 60;

export const metadata: Metadata = { title: "Disclaimer" };

export default async function DisclaimerPage() {
  const [page, settings] = await Promise.all([
    settleApi(getPage("disclaimer"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);

  return <LocalizedLegalDoc kind="disclaimer" page={page} settings={settings} />;
}
