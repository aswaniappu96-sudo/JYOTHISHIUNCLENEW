"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeading } from "@/components/home/SectionHeading";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { dailyRashiReading, HOROSCOPE_RASHIS } from "@/lib/dailyHoroscope";
import { luckyForRashi } from "@/lib/freeAstrology";
import { DEFAULT_TIMEZONE, getPanchang, visitorTimeZone, type PanchangSnapshot } from "@/lib/panchang";
import { RASHIS } from "@/lib/rashis";

const CARD_H = 92;
const CARD_GAP = 10;
const VISIBLE = 4;
const SLIDER_H = CARD_H * VISIBLE + CARD_GAP * (VISIBLE - 1);

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ZodiacWheel({ selectedIndex, label }: { selectedIndex: number; label: string }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[240px]">
      <div className="absolute inset-[4%] rounded-full border-2 border-[#e5c378]" />
      <div className="absolute inset-[16%] rounded-full border border-[#e5c378]/60" />
      {hours.map((hour, index) => {
        const angle = (index / 12) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 42 * Math.cos(rad);
        const y = 50 + 42 * Math.sin(rad);
        const active = index === selectedIndex;
        return (
          <span
            key={hour}
            className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold ${
              active ? "bg-[#e5c378] text-[#1A1106]" : "text-[#1A1106]/50"
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {hour}
          </span>
        );
      })}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1A1106]/40">Your day</p>
        <div className="mt-2 flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-[#e5c378] px-2 text-center shadow-[0_8px_20px_-10px_rgba(154,90,18,0.45)]">
          <span className="font-serif text-[14px] font-medium leading-tight text-[#1A1106]">{label}</span>
        </div>
      </div>
    </div>
  );
}

export function DailyHoroscope() {
  const { t } = usePrefs();
  const [selected, setSelected] = useState<(typeof RASHIS)[number]>(RASHIS[0]);
  const [panchang, setPanchang] = useState<PanchangSnapshot>(() => getPanchang(DEFAULT_TIMEZONE));
  const scroller = useRef<HTMLDivElement>(null);
  const skipScroll = useRef(false);

  useEffect(() => {
    setPanchang(getPanchang(visitorTimeZone()));
  }, []);

  const selectedIndex = Math.max(0, HOROSCOPE_RASHIS.findIndex((item) => item.slug === selected.slug));
  const reading = dailyRashiReading(selected.slug);
  const lucky = luckyForRashi(selected.slug);

  const scrollToIndex = (index: number, smooth = true) => {
    const node = scroller.current;
    if (!node) return;
    skipScroll.current = true;
    node.scrollTo({ top: index * (CARD_H + CARD_GAP), behavior: smooth ? "smooth" : "auto" });
    window.setTimeout(() => {
      skipScroll.current = false;
    }, 420);
  };

  const choose = (rashi: (typeof RASHIS)[number], smooth = true) => {
    setSelected(rashi);
    const index = HOROSCOPE_RASHIS.findIndex((item) => item.slug === rashi.slug);
    if (index >= 0) scrollToIndex(index, smooth);
  };

  const onSliderScroll = () => {
    const node = scroller.current;
    if (!node || skipScroll.current) return;
    const index = Math.min(
      HOROSCOPE_RASHIS.length - 1,
      Math.max(0, Math.round(node.scrollTop / (CARD_H + CARD_GAP))),
    );
    const next = HOROSCOPE_RASHIS[index];
    if (next && next.slug !== selected.slug) setSelected(next);
  };

  const step = (delta: number) => {
    const index = Math.min(HOROSCOPE_RASHIS.length - 1, Math.max(0, selectedIndex + delta));
    choose(HOROSCOPE_RASHIS[index]);
  };

  return (
    <section id="horoscope" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16">
      <span id="free-tools" className="sr-only" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, rgba(229,195,120,0.35), transparent 42%)" }} />
      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-tertiary">{t("daily.kicker")}</p>
        <PageHeading className="mt-3" lead={t("daily.lead")} accent={t("daily.accent")} />
        <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#1A1106]/70 sm:text-[16px]">{t("daily.copy")}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-3 sm:gap-x-4">
          {HOROSCOPE_RASHIS.map((rashi) => {
            const active = rashi.slug === selected.slug;
            return (
              <button
                key={rashi.slug}
                type="button"
                onClick={() => choose(rashi)}
                className="flex flex-col items-center gap-1 bg-transparent p-0"
                aria-pressed={active}
              >
                <img
                  src={`/rashis/rashi-${rashi.slug}.png?v=3`}
                  alt=""
                  className={`h-14 w-14 rounded-full object-cover object-[center_68%] sm:h-16 sm:w-16 ${
                    active ? "ring-[3px] ring-[#e5c378] ring-offset-2 ring-offset-[#fff8ec]" : "ring-1 ring-[#e5c378]/35"
                  }`}
                />
                <span className={`text-[11px] font-bold leading-tight sm:text-sm ${active ? "text-tertiary" : "text-[#1A1106]/55"}`}>
                  {rashi.sa}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid items-start gap-4 lg:grid-cols-[minmax(240px,300px)_minmax(240px,280px)_minmax(320px,1fr)] lg:gap-5">
          <div className="rounded-[28px] border-2 border-[#e5c378] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(26,17,6,0.16)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A1106]/55">{t("daily.wheel")}</p>
              <span className="rounded-full border border-[#e5c378] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#1A1106]">
                {panchang.pakshaLabel}
              </span>
            </div>
            <div className="mt-4">
              <ZodiacWheel selectedIndex={selectedIndex} label={selected.sa} />
            </div>
            <BookConsultationButton className="mt-5 flex w-full items-center justify-center rounded-full bg-[#e5c378] px-4 py-3 text-[14px] font-bold text-[#1A1106] transition hover:bg-[#F1D59B]">
              {t("daily.cta")}
            </BookConsultationButton>
            <p className="mt-3 text-center text-[11px] text-[#1A1106]/45">{t("daily.ctaHint")}</p>
          </div>

          <div className="relative">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[14px] font-semibold text-[#1A1106]">{t("daily.select")}</p>
              <p className="text-[11px] font-medium tracking-[0.04em] text-[#1A1106]/40">{t("daily.vedic")}</p>
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label="Previous rashi"
                onClick={() => step(-1)}
                disabled={selectedIndex === 0}
                className="absolute -top-2 left-1/2 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-[#e5c378] bg-white text-[#1A1106] disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path d="m7 14 5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                ref={scroller}
                onScroll={onSliderScroll}
                className="overflow-y-auto overscroll-contain [scrollbar-width:none] snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
                style={{ height: SLIDER_H }}
              >
                <div className="flex flex-col" style={{ gap: CARD_GAP }}>
                  {HOROSCOPE_RASHIS.map((rashi) => {
                    const active = rashi.slug === selected.slug;
                    return (
                      <button
                        key={rashi.slug}
                        type="button"
                        onClick={() => choose(rashi)}
                        className={`flex snap-start items-center justify-between gap-3 rounded-2xl border-2 bg-white px-4 text-left transition ${
                          active
                            ? "border-[#e5c378] shadow-[0_10px_24px_-16px_rgba(154,90,18,0.35)]"
                            : "border-[#e5c378]/45 opacity-55 hover:border-[#e5c378] hover:opacity-90"
                        }`}
                        style={{ height: CARD_H }}
                      >
                        <span className="min-w-0">
                          <span className="block font-serif text-[16px] font-medium text-[#1A1106]">{rashi.sa}</span>
                          <span className="mt-0.5 block text-[12px] text-[#1A1106]/45">{rashi.en}</span>
                          <span className="mt-2 block h-1 w-8 rounded-full bg-[#e5c378]" />
                        </span>
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                            active ? "border-[#e5c378] bg-[#e5c378] text-[#1A1106]" : "border-[#e5c378]/70 text-[#1A1106]/70"
                          }`}
                        >
                          <ArrowGlyph />
                        </span>
                      </button>
                    );
                  })}
                  <div aria-hidden style={{ height: CARD_H * (VISIBLE - 1) }} />
                </div>
              </div>
              <button
                type="button"
                aria-label="Next rashi"
                onClick={() => step(1)}
                disabled={selectedIndex === HOROSCOPE_RASHIS.length - 1}
                className="absolute -bottom-2 left-1/2 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-[#e5c378] bg-white text-[#1A1106] disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col rounded-[28px] border-2 border-[#e5c378] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(26,17,6,0.16)]" style={{ minHeight: SLIDER_H }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-serif text-[22px] font-medium leading-tight text-[#1A1106]">
                  {selected.sa} <span className="text-[14px] font-normal text-[#1A1106]/45">· {selected.en}</span>
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-tertiary">{t("daily.today")}</p>
              </div>
              <img
                src={`/rashis/rashi-${selected.slug}.png?v=3`}
                alt=""
                className="h-12 w-12 rounded-full object-cover object-[center_68%] ring-2 ring-[#e5c378]"
              />
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[#1A1106]/75">{reading.overview}</p>
            <dl className="mt-4 grid gap-2.5 text-[13px]">
              <div>
                <dt className="font-bold text-tertiary">{t("daily.love")}</dt>
                <dd className="mt-0.5 leading-snug text-[#1A1106]/70">{reading.love}</dd>
              </div>
              <div>
                <dt className="font-bold text-tertiary">{t("daily.career")}</dt>
                <dd className="mt-0.5 leading-snug text-[#1A1106]/70">{reading.career}</dd>
              </div>
              <div>
                <dt className="font-bold text-tertiary">{t("daily.health")}</dt>
                <dd className="mt-0.5 leading-snug text-[#1A1106]/70">{reading.health}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#e5c378]/70 bg-[#fff8ec] px-3 py-1 text-[12px] font-semibold text-[#1A1106]">
                {t("daily.lucky")} · {lucky.color}
              </span>
              <span className="rounded-full border border-[#e5c378]/70 bg-[#fff8ec] px-3 py-1 text-[12px] font-semibold text-[#1A1106]">
                {t("daily.number")} · {lucky.number}
              </span>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-[#1A1106]/50">{t("daily.note")}</p>
            <BookConsultationButton className="mt-4 flex w-full items-center justify-center rounded-full bg-[#e5c378] px-4 py-2.5 text-[13px] font-bold text-[#1A1106] transition hover:bg-[#F1D59B]">
              {t("daily.cta")}
            </BookConsultationButton>
          </div>
        </div>
      </div>
    </section>
  );
}
