"use client";

import { AstrologyServiceTiles } from "@/components/pages/AstrologyServiceTiles";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SECTION_INNER } from "@/lib/layout";
import type { AstrologyService } from "@/types/wordpress";

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8.5 12.2 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AstrologyServicesSection({
  services,
  whatsappNumber,
}: {
  services: AstrologyService[];
  whatsappNumber?: string;
}) {
  const { t } = usePrefs();

  return (
    <section className="relative w-full overflow-hidden py-10 sm:py-14">
      <div className={SECTION_INNER}>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center -space-x-2.5">
            {["#E9D5A7", "#F1D59B", "#D4B078"].map((color) => (
              <div
                key={color}
                className="flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] border-[#FEF9EF] font-serif text-[11px] font-bold text-[#1A1106] shadow-sm"
                style={{ background: color }}
              >
                ॐ
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e5c378] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1A1106]">
            <CheckGlyph />
            {t("consult.proof")}
          </div>
        </div>
        <AstrologyServiceTiles services={services} whatsappNumber={whatsappNumber} />
      </div>
    </section>
  );
}
