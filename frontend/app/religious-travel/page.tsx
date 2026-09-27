import type { Metadata } from "next";
import { TravelView } from "@/components/pages/TravelView";
import { fallbackSettings, getPage, getSettings, getTravelDestinations, settleApi } from "@/lib/api/wordpress";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sacred Temple Yatras & Himalayan Sanctuaries",
  description: "Consecrated temple yatras and pilgrimage guidance from JyothishiUncle. Dates and dakshina are confirmed privately.",
};

export default async function TravelIndexPage() {
  const [destinations, page, settings] = await Promise.all([
    settleApi(getTravelDestinations(), []),
    settleApi(getPage("religious-travel"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);

  return <TravelView destinations={destinations} page={page} whatsappNumber={settings.whatsapp_number} />;
}
