"use client";

import Link from "next/link";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { imageSrc } from "@/lib/media";
import type { SiteSettings } from "@/types/wordpress";

function CosmicMandala() {
  return (
    <div className="relative my-2 flex h-[340px] w-[340px] select-none items-center justify-center sm:h-[460px] sm:w-[460px] lg:h-[580px] lg:w-[580px]">
      <svg className="mandala-spin absolute inset-0 h-full w-full text-primary-container/30" fill="none" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="235" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1" />
        <circle cx="250" cy="250" r="215" stroke="currentColor" strokeWidth="0.75" />
        <g opacity="0.6" stroke="currentColor" strokeWidth="0.5">
          <line x1="250" x2="250" y1="15" y2="485" />
          <line x1="15" x2="485" y1="250" y2="250" />
          <line x1="84" x2="416" y1="84" y2="416" />
          <line x1="84" x2="416" y1="416" y2="84" />
        </g>
        <circle cx="250" cy="25" fill="currentColor" r="4" />
        <circle cx="362" cy="55" fill="currentColor" r="3" />
        <circle cx="445" cy="138" fill="currentColor" r="3.5" />
        <circle cx="475" cy="250" fill="currentColor" r="4" />
        <circle cx="445" cy="362" fill="currentColor" r="3" />
        <circle cx="362" cy="445" fill="currentColor" r="3.5" />
        <circle cx="250" cy="475" fill="currentColor" r="4" />
        <circle cx="138" cy="445" fill="currentColor" r="3" />
        <circle cx="55" cy="362" fill="currentColor" r="3.5" />
        <circle cx="25" cy="250" fill="currentColor" r="4" />
        <circle cx="55" cy="138" fill="currentColor" r="3" />
        <circle cx="138" cy="55" fill="currentColor" r="3.5" />
      </svg>
      <svg className="mandala-spin-rev absolute h-[78%] w-[78%] text-secondary/40" fill="none" viewBox="0 0 400 400">
        <polygon points="200,20 356,110 356,290 200,380 44,290 44,110" stroke="currentColor" strokeWidth="1.2" />
        <polygon
          points="200,380 44,290 44,110 200,20 356,110 356,290"
          stroke="currentColor"
          strokeWidth="0.8"
          transform="rotate(30 200 200)"
        />
        <circle cx="200" cy="200" r="140" stroke="currentColor" strokeDasharray="2 6" strokeWidth="0.75" />
      </svg>
      <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-linear-to-tr from-surface-lowest via-surface-high/90 to-surface-lowest shadow-[0_0_80px_rgba(229,195,120,0.3)] backdrop-blur-2xl sm:h-56 sm:w-56">
        <div className="absolute inset-2 rounded-full bg-linear-to-br from-primary-container/20 via-transparent to-secondary-container/20" />
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffe09d_0%,#e5c378_40%,#4829b3_95%)] shadow-[0_0_50px_rgba(255,224,157,0.8)] sm:h-28 sm:w-28">
          <span className="font-serif text-3xl font-bold text-on-primary">ॐ</span>
        </div>
        <div className="absolute -top-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary shadow-[0_0_12px_#ffe09d]">
          ☉
        </div>
        <div className="absolute -bottom-2 -left-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-on-primary shadow-[0_0_12px_#cabeff]">
          ☽
        </div>
        <div className="absolute top-1/2 -right-4 flex h-4 w-4 items-center justify-center rounded-full bg-tertiary-container text-[9px] font-bold text-on-primary shadow-[0_0_12px_#ffba5d]">
          ♃
        </div>
      </div>
    </div>
  );
}

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden px-4 text-center md:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        {imageSrc(settings.hero_image) ? (
          <img src={imageSrc(settings.hero_image)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        ) : null}
        <div className="h-[700px] w-[700px] rounded-full bg-secondary-container/20 blur-[140px] mix-blend-screen" />
        <div className="-mt-40 h-[500px] w-[500px] rounded-full bg-primary-container/15 blur-[120px] mix-blend-screen" />
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
          {settings.hero_subtitle}
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <BookConsultationButton className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-12 py-2.5 text-lg font-semibold tracking-wide text-on-primary shadow-[0_0_35px_rgba(229,195,120,0.5)] transition hover:shadow-[0_0_45px_rgba(255,224,157,0.85)] sm:w-auto">
            {settings.hero_primary_cta_label || "Book a Consultation"}
          </BookConsultationButton>
          <Link
            href="/services"
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-surface-high/60 px-7 py-2.5 text-base text-primary shadow-sm backdrop-blur-xl transition hover:bg-surface-highest sm:w-auto"
          >
            Explore Sacred Services
            <span className="text-primary-container">→</span>
          </Link>
        </div>
        <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-2 md:grid-cols-4">
          {[
            ["NAKSHATRA", "Rohini 4th Pada", "text-primary"],
            ["TITHI", "Shukla Panchami", "text-secondary"],
            ["FROM", "Oman · Worldwide", "text-primary"],
            ["GUIDANCE", "Online consults", "text-secondary"],
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
