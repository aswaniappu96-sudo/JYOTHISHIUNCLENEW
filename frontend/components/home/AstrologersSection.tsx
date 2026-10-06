"use client";

import { AstrologerTalkBoard } from "@/components/pages/AstrologerTalkBoard";
import type { Astrologer } from "@/types/wordpress";

export function AstrologersSection({
  astrologers,
  phone,
  whatsapp,
}: {
  astrologers: Astrologer[];
  phone?: string;
  whatsapp?: string;
}) {
  return (
    <AstrologerTalkBoard
      id="astrologers"
      astrologers={astrologers}
      phone={phone}
      whatsapp={whatsapp}
      photo="round"
      headingAs="h2"
      showViewAll
      showProof
    />
  );
}
