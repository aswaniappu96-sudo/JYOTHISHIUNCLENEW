import { TalkAstrologerCard } from "@/components/pages/TalkAstrologerCard";
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
  return (
    <TalkAstrologerCard
      view={astrologerViewFor(person, [person])}
      phone={phone || ""}
      whatsapp={whatsapp || ""}
      photo="full"
    />
  );
}
