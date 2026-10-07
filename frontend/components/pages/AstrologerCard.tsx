"use client";

import { TalkAstrologerCard } from "@/components/pages/TalkAstrologerCard";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { astrologerViewFor, PORTRAITS, type PortraitMeta } from "@/lib/astrologer-display";
import type { Astrologer } from "@/types/wordpress";

export type { PortraitMeta };
export { PORTRAITS };

export function AstrologerCard({
  person,
  phone,
  whatsapp,
}: {
  person: Astrologer;
  meta?: PortraitMeta;
  phone?: string;
  whatsapp?: string;
  compact?: boolean;
}) {
  const { locale } = usePrefs();
  return (
    <TalkAstrologerCard
      view={astrologerViewFor(person, [person], locale)}
      phone={phone || ""}
      whatsapp={whatsapp || ""}
      photo="full"
    />
  );
}
