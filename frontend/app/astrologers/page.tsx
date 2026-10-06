import type { Metadata } from "next";
import { AstrologerWelcomeModal } from "@/components/portal/AstrologerWelcomeModal";
import { AstrologerGrid, JyotishaWisdom } from "@/components/pages/AstrologersView";
import { AstrologerMatchCta } from "@/components/pages/AstrologerActions";
import { HoroscopeBand } from "@/components/home/HoroscopeBand";
import { AstrologyServicesSection } from "@/components/pages/AstrologyServicesSection";
import { fallbackSettings, getAstrologers, getServices, getSettings, settleApi } from "@/lib/api/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Talk to an Astrologer Now",
  description: "Choose an astrologer based on expertise, experience, rating and availability.",
};

export default async function AstrologersPage() {
  const [astrologers, settings, services] = await Promise.all([
    settleApi(getAstrologers(), []),
    settleApi(getSettings(), fallbackSettings()),
    settleApi(getServices(), []),
  ]);

  return (
    <div>
      <AstrologerWelcomeModal />
      <AstrologerGrid
        astrologers={astrologers}
        phone={settings.phone_number}
        whatsapp={settings.whatsapp_number}
      />
      <AstrologyServicesSection services={services} />
      <JyotishaWisdom />
      <HoroscopeBand />
      <AstrologerMatchCta whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
