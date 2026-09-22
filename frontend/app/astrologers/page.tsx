import type { Metadata } from "next";
import { AstrologerWelcomeModal } from "@/components/portal/AstrologerWelcomeModal";
import { AstrologerGrid, AstrologersHero, JyotishaWisdom } from "@/components/pages/AstrologersView";
import { AstrologerMatchCta } from "@/components/pages/AstrologerActions";
import { HoroscopeBand } from "@/components/home/HoroscopeBand";
import { fallbackSettings, getAstrologers, getPage, getSettings, settleApi } from "@/lib/api/wordpress";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hereditary Vedic Astrologers & Cosmic Gurus",
  description: "Consecrated Vedic astrologers and gurus at JyothishiUncle. First call and chat are free.",
};

export default async function AstrologersPage() {
  const [astrologers, settings, page] = await Promise.all([
    settleApi(getAstrologers(), []),
    settleApi(getSettings(), fallbackSettings()),
    settleApi(getPage("astrologers"), null),
  ]);

  return (
    <div>
      <AstrologerWelcomeModal />
      <AstrologersHero page={page} />
      <AstrologerGrid astrologers={astrologers} />
      <JyotishaWisdom />
      <HoroscopeBand />
      <AstrologerMatchCta whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
