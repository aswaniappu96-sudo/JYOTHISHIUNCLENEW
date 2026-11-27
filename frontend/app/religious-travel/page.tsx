import type { Metadata } from "next";
import { TravelView } from "@/components/pages/TravelView";
import { fallbackSettings, getPage, getSettings, getTravelDestinations, settleApi } from "@/lib/api/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spiritually Guided Temple Yatras",
  description:
    "Experience peaceful, unhurried Darshan with wholesome Satvik food, clean stay, and traditional temple rituals — guided step by step for families and elders.",
};

export default async function TravelIndexPage() {
  const [destinations, page, settings] = await Promise.all([
    settleApi(getTravelDestinations(), []),
    settleApi(getPage("religious-travel"), null),
    settleApi(getSettings(), fallbackSettings()),
  ]);

  return <TravelView destinations={destinations} page={page} whatsappNumber={settings.whatsapp_number} phone={settings.phone_number} />;
}
