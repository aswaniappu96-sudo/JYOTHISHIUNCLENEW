"use client";

import Link from "next/link";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { guidanceTopicHref } from "@/lib/astrologer-display";

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
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

const TOPICS = [
  { id: "love", emoji: "💞", title: "consult.love", hint: "consult.loveHint" },
  { id: "marriage", emoji: "💍", title: "consult.marriage", hint: "consult.marriageHint" },
  { id: "career", emoji: "💼", title: "consult.career", hint: "consult.careerHint" },
  { id: "business", emoji: "📈", title: "consult.business", hint: "consult.businessHint" },
  { id: "family", emoji: "🏠", title: "consult.family", hint: "consult.familyHint" },
  { id: "vastu", emoji: "🧭", title: "consult.vastu", hint: "consult.vastuHint" },
  { id: "tarot", emoji: "🃏", title: "consult.tarot", hint: "consult.tarotHint" },
  { id: "numerology", emoji: "🔢", title: "consult.numerology", hint: "consult.numerologyHint" },
  { id: "remedies", emoji: "ॐ", title: "consult.remedies", hint: "consult.remediesHint" },
] as const;

export function AstrologyConsultingSection() {
  const { t } = usePrefs();

  return (
    <section id="all-services" className="relative w-full overflow-hidden scroll-mt-36 py-10 sm:py-14 lg:py-16">
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

          <PageHeading className="mt-5" lead={t("consult.lead")} accent={t("consult.accent")} />
          <p className="mt-4 max-w-[560px] text-[15px] leading-[1.55] text-[#1A1106]/70 sm:text-[16px]">{t("consult.copy")}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center -space-x-2.5">
              {["#E9D5A7", "#F1D59B", "#D4B078"].map((color) => (
                <div
                  key={color}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-[2.5px] border-[#FEF9EF] font-serif text-[10px] font-bold text-[#1A1106] shadow-sm"
                  style={{ background: color }}
                >
                  ॐ
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e5c378] bg-white px-3 py-1 text-[12px] font-semibold text-[#1A1106]">
              <CheckGlyph />
              {t("consult.proof")}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-10 xl:grid-cols-4">
          {TOPICS.map((item) => {
            const title = t(item.title);
            return (
              <Link
                key={item.id}
                href={guidanceTopicHref(item.id)}
                className="group flex flex-col rounded-2xl border-2 border-[#e5c378] bg-white p-3.5 shadow-[0_8px_22px_-16px_rgba(26,17,6,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4b078] hover:shadow-[0_14px_28px_-16px_rgba(154,90,18,0.22)] sm:p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5c378]/70 bg-white text-[18px]">
                  {item.emoji}
                </div>
                <h3 className="mt-3 font-serif text-[16px] leading-snug tracking-[-0.01em] text-[#1A1106] sm:text-[17px]">
                  {title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#1A1106]/60">{t(item.hint)}</p>
                <span className="mt-3 inline-flex h-8 items-center justify-between gap-2 rounded-full bg-[#e5c378] px-3 text-[11px] font-bold text-[#1A1106] transition group-hover:bg-[#F1D59B]">
                  {t("consult.book")}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fff8ec]">
                    <ArrowGlyph />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
