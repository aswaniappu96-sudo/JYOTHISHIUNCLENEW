"use client";

import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { stripHtml, stripPublicPrices } from "@/lib/html";
import { consultServicesFromWp } from "@/lib/siteServices";
import type { AstrologyService } from "@/types/wordpress";

export type ServiceTile = {
  title: string;
  hint: string;
};

const tileClass =
  "flex min-h-[8.5rem] w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-primary/20 bg-surface-lowest px-3 py-4 text-center shadow-[0_10px_24px_-18px_rgba(139,100,20,0.45)]";

function TileCopy({ title, hint }: ServiceTile) {
  return (
    <>
      <span className="font-serif text-[17px] leading-snug text-primary">{title}</span>
      {hint ? <span className="text-[11px] leading-snug text-on-surface-variant">{hint}</span> : null}
    </>
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
  bookable = false,
}: {
  services: AstrologyService[];
  whatsappNumber?: string;
  bookable?: boolean;
}) {
  const tiles = tilesFromServices(services);

  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((service) =>
        bookable ? (
          <BookConsultationButton
            key={service.title}
            prefill={{ whatsapp: whatsappNumber }}
            className={`${tileClass} transition hover:border-primary/50 hover:bg-primary-container/35`}
          >
            <TileCopy title={service.title} hint={service.hint} />
          </BookConsultationButton>
        ) : (
          <div key={service.title} className={tileClass}>
            <TileCopy title={service.title} hint={service.hint} />
          </div>
        ),
      )}
    </div>
  );
}
