"use client";

import { useMemo } from "react";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { consultServicesFromWp, type SiteServiceLink } from "@/lib/siteServices";
import { useJuList } from "@/lib/useJuList";
import type { AstrologyService } from "@/types/wordpress";

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
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <rect x="3" y="7" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 11.2 20 8.5v7l-5-2.7v-1.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8.5 12.2 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function consultLook(item: SiteServiceLink) {
  const key = `${item.id} ${item.label}`.toLowerCase();
  if (/kundli|birth/.test(key)) {
    return { emoji: "🪐", mins: 30, highlight: true, title: "Kundli Reading" };
  }
  if (/prashna/.test(key)) return { emoji: "🔮", mins: 15, highlight: false, title: item.label };
  if (/match/.test(key)) return { emoji: "💞", mins: 40, highlight: false, title: item.label };
  if (/family/.test(key)) return { emoji: "🏠", mins: 30, highlight: false, title: "Family Guidance" };
  if (/remed/.test(key)) return { emoji: "ॐ", mins: 20, highlight: false, title: item.label };
  return { emoji: "✦", mins: 30, highlight: false, title: item.label };
}

export function AstrologyConsultingSection({ services = [] }: { services?: AstrologyService[] }) {
  const { t } = usePrefs();
  const wpServices = useJuList<AstrologyService>("/services", services);
  const consult = useMemo(
    () => consultServicesFromWp(wpServices).filter((item) => item.group === "consult"),
    [wpServices],
  );

  return (
    <section id="all-services" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-[#e5c378]/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-[30%] -right-40 h-[600px] w-[600px] rounded-full bg-[#e5c378]/12 blur-[110px]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]">
        <div className="max-w-[820px]">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#e5c378]/55 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A1106]/70">{t("consult.badge")}</span>
          </div>

          <PageHeading className="mt-6" lead={t("consult.lead")} accent={t("consult.accent")} />
          <p className="mt-5 max-w-[560px] text-[16px] leading-[1.6] text-[#1A1106]/70 sm:text-[18px]">{t("consult.copy")}</p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
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
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e5c378] bg-white px-3 py-1 text-[13px] font-semibold text-[#1A1106]">
              <CheckGlyph />
              {t("consult.proof")}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] lg:mt-14 lg:grid lg:grid-cols-5 lg:overflow-visible [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible">
          {consult.map((item) => {
            const look = consultLook(item);
            const mins = item.durationMinutes || look.mins;
            return (
              <article
                key={item.id}
                className="group relative flex min-w-[280px] flex-col rounded-[28px] border-2 border-[#e5c378] bg-white shadow-[0_12px_32px_-16px_rgba(26,17,6,0.16)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d4b078] hover:shadow-[0_20px_40px_-18px_rgba(154,90,18,0.22)] sm:min-w-0"
              >
                <div className="relative flex h-full flex-col p-6 sm:p-[22px]">
                  {look.highlight ? (
                    <div className="absolute -top-3 left-6 rounded-full border border-[#e5c378] bg-[#e5c378] px-3 py-1 text-[10px] font-bold tracking-[0.08em] text-[#1A1106] shadow-sm">
                      {t("consult.highlight")}
                    </div>
                  ) : null}
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#e5c378]/70 bg-white text-[22px]">
                    {look.emoji}
                  </div>
                  <h3 className="mt-5 font-serif text-[20px] leading-[1.15] tracking-[-0.01em] text-[#1A1106]">{look.title}</h3>
                  <p className="mt-2.5 min-h-[62px] text-[13.5px] leading-[1.55] text-[#1A1106]/65 line-clamp-3">{item.detail || item.hint}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5c378]/55 bg-white px-2.5 py-1 text-[11px] font-medium text-[#1A1106]/75">
                      <ClockGlyph /> {mins} min
                    </span>
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1A1106]/50">
                      <VideoGlyph /> {t("consult.video")}
                    </p>
                  </div>
                  <div className="mt-auto pt-7">
                    <BookConsultationButton className="group/btn flex w-full items-center justify-between rounded-full bg-[#e5c378] px-4 py-[11px] text-[13px] font-bold text-[#1A1106] transition hover:bg-[#F1D59B]">
                      <span>{t("consult.book")}</span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1A1106]/10 bg-[#fff8ec] text-[#1A1106] transition-transform group-hover/btn:translate-x-0.5">
                        <ArrowGlyph />
                      </span>
                    </BookConsultationButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-[#1A1106]/40 sm:hidden">
          <div className="h-px flex-1 bg-[#e5c378]/40" />
          <span>swipe to explore</span>
          <div className="h-px flex-1 bg-[#e5c378]/40" />
        </div>
      </div>
    </section>
  );
}
