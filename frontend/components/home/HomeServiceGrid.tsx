"use client";

import Link from "next/link";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { allSiteServices } from "@/lib/siteServices";
import { useJuList } from "@/lib/useJuList";
import type { AstrologyService } from "@/types/wordpress";

export function HomeServiceGrid({ services = [] }: { services?: AstrologyService[] }) {
  const wpServices = useJuList<AstrologyService>("/services", services);
  const tiles = allSiteServices(wpServices);

  return (
    <section id="all-services" className="relative w-full scroll-mt-32 px-4 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-primary">All services</p>
        <h2 className="mt-2 text-center font-serif text-[28px] text-primary md:text-[36px]">Catch every offering</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-on-surface-variant">
          Consultation from our service posts, plus pooja, products, yatra, and daily horoscope.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              href={tile.href}
              className="flex min-h-[7.25rem] flex-col items-center justify-center rounded-2xl border border-primary/15 bg-surface-lowest px-3 py-4 text-center shadow-[0_10px_24px_-18px_rgba(139,100,20,0.4)] transition hover:border-primary/45 hover:bg-primary-container/25"
            >
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-serif text-lg text-primary">
                ॐ
              </span>
              <span className="text-sm font-semibold text-on-surface">{tile.label}</span>
              <span className="text-[11px] text-on-surface-variant">{tile.hint}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <BookConsultationButton>Talk to astrologer</BookConsultationButton>
        </div>
      </div>
    </section>
  );
}
