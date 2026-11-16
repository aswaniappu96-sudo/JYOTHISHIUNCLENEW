import type { Metadata } from "next";
import { AstrologerWelcomeModal } from "@/components/portal/AstrologerWelcomeModal";
import { AstrologerGrid, JyotishaWisdom } from "@/components/pages/AstrologersView";
import { AstrologerMatchCta } from "@/components/pages/AstrologerActions";
import { HoroscopeBand } from "@/components/home/HoroscopeBand";
import { PopularGuidanceSection } from "@/components/home/AboutTeaser";
import { ScrollToAstrologers } from "@/components/pages/ScrollToAstrologers";
import { fallbackSettings, getAstrologers, getSettings, settleApi } from "@/lib/api/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Talk to an Astrologer Now",
  description: "Choose an astrologer based on expertise, experience, rating and availability.",
};

export default async function AstrologersPage() {
  const [astrologers, settings] = await Promise.all([
    settleApi(getAstrologers(), []),
    settleApi(getSettings(), fallbackSettings()),
  ]);

  return (
    <div>
      <ScrollToAstrologers />
      <AstrologerWelcomeModal />
      <AstrologerGrid
        astrologers={astrologers}
        phone={settings.phone_number}
        whatsapp={settings.whatsapp_number}
        afterIntro={<PopularGuidanceSection phone={settings.phone_number} whatsapp={settings.whatsapp_number} />}
      />
      <JyotishaWisdom />
      <HoroscopeBand />
      <AstrologerMatchCta whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
