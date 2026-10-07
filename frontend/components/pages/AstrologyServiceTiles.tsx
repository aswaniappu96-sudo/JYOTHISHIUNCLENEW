"use client";

import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { stripHtml, stripPublicPrices } from "@/lib/html";
import { consultServicesFromWp, type SiteServiceLink } from "@/lib/siteServices";
import type { AstrologyService } from "@/types/wordpress";

export type ServiceTile = {
  title: string;
  hint: string;
};

const ORDER = ["kundli", "prashna", "match", "family", "remed"];

function kindOf(item: SiteServiceLink) {
  const key = `${item.id} ${item.label}`.toLowerCase();
  if (/kundli|birth/.test(key)) return "kundli";
  if (/prashna/.test(key)) return "prashna";
  if (/match/.test(key)) return "match";
  if (/family/.test(key)) return "family";
  if (/remed/.test(key)) return "remed";
  return "other";
}

function cardDuration(item: SiteServiceLink) {
  return kindOf(item) === "kundli" ? 45 : 30;
}

function displayTitle(item: SiteServiceLink, kundliLabel: string) {
  const kind = kindOf(item);
  if (kind === "kundli") return kundliLabel;
  if (kind === "family") return "Family Guidance";
  return item.label;
}

function ServiceMark({ kind }: { kind: string }) {
  if (kind === "kundli") {
    return (
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3D2A8] text-[22px]" aria-hidden>
        🍂
      </span>
    );
  }
  if (kind === "prashna") {
    return (
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4D4F5] text-[22px]" aria-hidden>
        🔮
      </span>
    );
  }
  if (kind === "match") {
    return (
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8C9D4] text-[22px]" aria-hidden>
        💞
      </span>
    );
  }
  if (kind === "family") {
    return (
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F6D7B0] text-[22px]" aria-hidden>
        🏠
      </span>
    );
  }
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EAD9B0] bg-[#FFF8EB] font-serif text-[20px] text-[#9A6F3A]" aria-hidden>
      ॐ
    </span>
  );
}

function ClockGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7v5.2l3 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function VideoGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
      <rect x="2.5" y="7" width="12.5" height="10" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15 13 5 3.2V8.8L15 12" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function tilesFromServices(services: AstrologyService[]): ServiceTile[] {
  return consultServicesFromWp(services).map((item) => ({
    title: stripPublicPrices(item.label),
    hint: stripPublicPrices(stripHtml(item.hint || "")),
  }));
}

export function AstrologyServiceTiles({
  services,
  whatsappNumber,
}: {
  services: AstrologyService[];
  whatsappNumber?: string;
  bookable?: boolean;
}) {
  const { t } = usePrefs();
  const tiles = consultServicesFromWp(services)
    .slice()
    .sort((a, b) => {
      const ai = ORDER.indexOf(kindOf(a));
      const bi = ORDER.indexOf(kindOf(b));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {tiles.map((item, index) => {
        const kind = kindOf(item);
        return (
          <article
            key={item.id}
            className="relative flex flex-col rounded-[22px] border border-[#EAD9B0] bg-white p-5 shadow-[0_12px_28px_-18px_rgba(139,100,20,0.35)]"
          >
            {index === 0 ? (
              <span className="absolute -top-2.5 left-4 rounded-full bg-[#C4A227] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.04em] text-white">
                {t("consult.highlight")}
              </span>
            ) : null}
            <ServiceMark kind={kind} />
            <h3 className="mt-4 font-serif text-[22px] font-medium leading-tight text-[#1A1106]">
              {displayTitle(item, t("svcOffer.kundli"))}
            </h3>
            <p className="mt-2 min-h-[4.5rem] text-[13px] leading-[1.5] text-[#6E6256]">{item.detail}</p>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#EAD9B0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#8A6A3A]">
                <ClockGlyph /> {cardDuration(item)} min
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#EAD9B0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#8A6A3A]">
                <VideoGlyph /> {t("consult.video")}
              </span>
            </div>
            <BookConsultationButton
              prefill={{ whatsapp: whatsappNumber, purpose: item.label }}
              className="mt-4 inline-flex h-11 w-full items-center justify-between rounded-full bg-[#C4A227] px-4 text-[14px] font-semibold text-[#1A1106] transition hover:bg-[#B08A1A]"
            >
              <span>{t("svcOffer.book")}</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#1A1106]" aria-hidden>
                →
              </span>
            </BookConsultationButton>
          </article>
        );
      })}
    </div>
  );
}
