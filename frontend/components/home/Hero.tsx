"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { imageSrc } from "@/lib/media";
import { DEFAULT_TIMEZONE, getPanchang, visitorTimeZone, type PanchangSnapshot } from "@/lib/panchang";
import { stripOmanHighlight } from "@/lib/publicCopy";
import type { SiteSettings } from "@/types/wordpress";

function CosmicMandala() {
  return (
    <div className="relative my-2 flex h-[340px] w-[340px] select-none items-center justify-center sm:h-[460px] sm:w-[460px] lg:h-[580px] lg:w-[580px]">
      <div className="mandala-outer-glow pointer-events-none absolute inset-[3%] rounded-full" />
      <svg className="mandala-spin mandala-gold-emit absolute inset-0 h-full w-full" fill="none" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="235" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1.6" />
        <circle cx="250" cy="250" r="215" stroke="currentColor" strokeWidth="1.2" />
        <g opacity="0.75" stroke="currentColor" strokeWidth="0.7">
          <line x1="250" x2="250" y1="15" y2="485" />
          <line x1="15" x2="485" y1="250" y2="250" />
          <line x1="84" x2="416" y1="84" y2="416" />
          <line x1="84" x2="416" y1="416" y2="84" />
        </g>
        <circle cx="250" cy="25" fill="currentColor" r="5" />
        <circle cx="362" cy="55" fill="currentColor" r="3.5" />
        <circle cx="445" cy="138" fill="currentColor" r="4" />
        <circle cx="475" cy="250" fill="currentColor" r="5" />
        <circle cx="445" cy="362" fill="currentColor" r="3.5" />
        <circle cx="362" cy="445" fill="currentColor" r="4" />
        <circle cx="250" cy="475" fill="currentColor" r="5" />
        <circle cx="138" cy="445" fill="currentColor" r="3.5" />
        <circle cx="55" cy="362" fill="currentColor" r="4" />
        <circle cx="25" cy="250" fill="currentColor" r="5" />
        <circle cx="55" cy="138" fill="currentColor" r="3.5" />
        <circle cx="138" cy="55" fill="currentColor" r="4" />
      </svg>
      <svg className="mandala-spin-rev mandala-gold-emit absolute h-[78%] w-[78%]" fill="none" viewBox="0 0 400 400">
        <polygon points="200,20 356,110 356,290 200,380 44,290 44,110" stroke="currentColor" strokeWidth="1.2" />
        <polygon
          points="200,380 44,290 44,110 200,20 356,110 356,290"
          stroke="currentColor"
          strokeWidth="0.8"
          transform="rotate(30 200 200)"
        />
        <circle cx="200" cy="200" r="140" stroke="currentColor" strokeDasharray="2 6" strokeWidth="0.75" />
      </svg>
      <div className="relative flex h-44 w-44 items-center justify-center sm:h-56 sm:w-56">
        <div className="om-gold-halo pointer-events-none absolute inset-[-28%] rounded-full" />
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-linear-to-tr from-primary-container/25 via-surface-low/80 to-primary-container/20">
          <div className="om-gold-core relative z-10 flex h-28 w-28 items-center justify-center rounded-full sm:h-32 sm:w-32">
            <span className="font-serif text-4xl font-bold text-on-primary drop-shadow-[0_1px_0_rgba(255,248,212,0.8)] sm:text-5xl">ॐ</span>
          </div>
        </div>
        <div className="absolute -top-3 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-[#b08a1a] bg-[#fff8ec] text-[10px] text-[#b08a1a]">
          ☉
        </div>
        <div className="absolute -bottom-2 -left-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-[#b08a1a] bg-[#fff8ec] text-[9px] text-[#b08a1a]">
          ☽
        </div>
        <div className="absolute top-1/2 -right-4 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-[#b08a1a] bg-[#fff8ec] text-[10px] text-[#b08a1a]">
          ♃
        </div>
        <div className="absolute top-1/2 -left-4 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-[#b08a1a] bg-[#fff8ec] text-[10px] text-[#b08a1a]">
          ☿
        </div>
      </div>
    </div>
  );
}

export function Hero({ settings }: { settings: SiteSettings }) {
  const [panchang, setPanchang] = useState<PanchangSnapshot>(() => getPanchang(DEFAULT_TIMEZONE));

  useEffect(() => {
    const refresh = () => setPanchang(getPanchang(visitorTimeZone()));
    refresh();
    const id = window.setInterval(refresh, 30 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const subtitle = stripOmanHighlight(
    settings.hero_subtitle || "Pooja, astrology consultation, and spiritual guidance worldwide.",
  );

  return (
    <section data-hero className="relative z-20 flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden px-4 text-center md:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        {imageSrc(settings.hero_image) ? (
          <img src={imageSrc(settings.hero_image)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        ) : null}
        <div className="h-[700px] w-[700px] rounded-full bg-secondary-container/50 blur-[140px]" />
        <div className="-mt-40 h-[500px] w-[500px] rounded-full bg-primary-container/30 blur-[120px]" />
      </div>
      <CosmicMandala />
      <div className="relative z-20 mx-auto mt-[-2.5rem] flex max-w-4xl flex-col items-center sm:mt-[-4rem]">
        <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-surface-high/70 px-4 py-1 shadow-sm backdrop-blur-md">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Vedic Cosmos & Soul Transformation</span>
        </div>
        <h1 className="max-w-3xl bg-linear-to-b from-primary via-on-surface to-secondary bg-clip-text font-serif text-[38px] leading-[46px] text-transparent md:text-[56px] md:leading-[68px]">
          {settings.hero_title || "Discover Your Cosmic Path"}
        </h1>
        <p className="mx-auto mt-4 mb-7 max-w-2xl text-base leading-relaxed text-on-surface-variant">
          {subtitle}
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <BookConsultationButton className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-primary-container px-12 py-2.5 text-lg font-semibold tracking-wide text-on-primary shadow-[0_8px_28px_rgba(201,162,39,0.45)] transition hover:brightness-95 sm:w-auto">
            {settings.hero_primary_cta_label || "Book a Consultation"}
          </BookConsultationButton>
          <Link
            href="#services"
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-surface-high/60 px-7 py-2.5 text-base text-primary shadow-sm backdrop-blur-xl transition hover:bg-surface-highest sm:w-auto"
          >
            Explore Sacred Services
            <span className="text-primary-container">→</span>
          </Link>
        </div>
        <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-2 md:grid-cols-4">
          {[
            ["NAKSHATRA", panchang.nakshatraLabel, "text-primary"],
            ["TITHI", panchang.tithiLabel, "text-secondary"],
            ["ZONE", panchang.zoneLabel, "text-primary"],
            ["GUIDANCE", "Worldwide", "text-secondary"],
          ].map(([label, value, color]) => (
            <div key={label} className="flex flex-col items-center justify-center rounded-xl bg-surface-low/70 p-2 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-container/70">{label}</span>
              <span className={`text-[18px] font-semibold leading-7 ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
