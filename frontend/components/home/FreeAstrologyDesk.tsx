"use client";

import { useEffect, useState } from "react";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { dailyHoroscopeNote, HOROSCOPE_RASHIS } from "@/lib/dailyHoroscope";
import { luckyForRashi, matchNote } from "@/lib/freeAstrology";
import { TwoToneHeading } from "@/components/home/SectionHeading";
import { KICKER, LEAD, SECTION_INNER } from "@/lib/layout";
import { DEFAULT_TIMEZONE, getPanchang, visitorTimeZone, type PanchangSnapshot } from "@/lib/panchang";
import { RASHIS } from "@/lib/rashis";

type Tool = "horoscope" | "panchang" | "lucky" | "match";

export function FreeAstrologyDesk() {
  const [tool, setTool] = useState<Tool>("horoscope");
  const [selected, setSelected] = useState<(typeof RASHIS)[number]>(RASHIS[0]);
  const [partner, setPartner] = useState<(typeof RASHIS)[number]>(RASHIS[6]);
  const [panchang, setPanchang] = useState<PanchangSnapshot>(() => getPanchang(DEFAULT_TIMEZONE));

  useEffect(() => {
    setPanchang(getPanchang(visitorTimeZone()));
  }, []);

  const note = dailyHoroscopeNote(selected.slug);
  const lucky = luckyForRashi(selected.slug);
  const match = matchNote(selected.slug, partner.slug);

  return (
    <section id="free-tools" className="relative w-full scroll-mt-36 py-8 sm:py-10">
      <div className={SECTION_INNER}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-3xl">
            <p className={KICKER}>Free tools</p>
            <TwoToneHeading title="Horoscope & panchang" className="mt-1" />
            <p className={`${LEAD} mt-2`}>
              Daily rashi, live nakshatra and tithi, lucky colour, and a quick match note. General for the day — a full
              reading is by video consulting.
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(
            [
              ["horoscope", "Daily horoscope"],
              ["panchang", "Live panchang"],
              ["lucky", "Lucky colour"],
              ["match", "Rashi match"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTool(id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition md:text-base ${
                tool === id
                  ? "bg-primary-container text-on-primary"
                  : "border border-[#e5c378]/70 bg-white text-primary hover:bg-[#fff8ec]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-3 sm:gap-x-4">
          {HOROSCOPE_RASHIS.map((rashi) => {
            const active = rashi.slug === selected.slug;
            return (
              <button
                key={rashi.slug}
                type="button"
                onClick={() => setSelected(rashi)}
                className="flex flex-col items-center gap-1 bg-transparent p-0"
              >
                <img
                  src={`/rashis/rashi-${rashi.slug}.png?v=3`}
                  alt=""
                  className={`h-14 w-14 rounded-full object-cover object-[center_68%] sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem] ${
                    active ? "ring-[3px] ring-primary" : "ring-1 ring-primary/25"
                  }`}
                />
                <span
                  className={`text-sm font-bold leading-tight md:text-base ${
                    active ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {rashi.sa}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border-2 border-[#e5c378] bg-white p-4 sm:p-5">
          <div className="min-w-0">
            {tool === "horoscope" ? (
              <>
                <p className="text-lg font-bold text-primary md:text-xl">
                  {selected.sa} · {selected.en}
                </p>
                <p className="mt-1 text-base leading-relaxed text-on-surface md:text-lg">{note}</p>
              </>
            ) : null}
            {tool === "panchang" ? (
              <dl className="grid grid-cols-1 gap-2 text-base md:grid-cols-2 md:gap-x-8 md:text-lg">
                <div className="flex justify-between gap-3 sm:justify-start sm:gap-4">
                  <dt className="font-semibold text-on-surface-variant">Nakshatra</dt>
                  <dd className="font-bold text-on-surface">{panchang.nakshatraLabel}</dd>
                </div>
                <div className="flex justify-between gap-3 sm:justify-start sm:gap-4">
                  <dt className="font-semibold text-on-surface-variant">Tithi</dt>
                  <dd className="font-bold text-on-surface">{panchang.tithiLabel}</dd>
                </div>
                <div className="flex justify-between gap-3 sm:justify-start sm:gap-4">
                  <dt className="font-semibold text-on-surface-variant">Zone</dt>
                  <dd className="font-bold text-on-surface">{panchang.zoneLabel}</dd>
                </div>
                <div className="flex justify-between gap-3 sm:justify-start sm:gap-4">
                  <dt className="font-semibold text-on-surface-variant">Guidance</dt>
                  <dd className="font-bold text-on-surface">Worldwide</dd>
                </div>
              </dl>
            ) : null}
            {tool === "lucky" ? (
              <>
                <p className="text-lg font-bold text-primary md:text-xl">{selected.sa} today</p>
                <p className="mt-1 font-serif text-3xl font-bold text-primary md:text-4xl">{lucky.color}</p>
                <p className="text-base text-on-surface md:text-lg">
                  Lucky colour · number {lucky.number}
                </p>
              </>
            ) : null}
            {tool === "match" ? (
              <>
                <p className="text-lg font-bold text-primary md:text-xl">Quick rashi note</p>
                <label className="mt-2 block text-base font-semibold text-on-surface-variant">Second rashi</label>
                <select
                  className="mt-1 w-full max-w-md rounded-xl border border-primary/20 bg-surface-low px-3 py-2 text-base"
                  value={partner.slug}
                  onChange={(event) => {
                    const next = RASHIS.find((item) => item.slug === event.target.value);
                    if (next) setPartner(next);
                  }}
                >
                  {RASHIS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.sa} · {item.en}
                    </option>
                  ))}
                </select>
                <p className="mt-2 font-serif text-3xl font-bold text-primary">{match.score} / 10</p>
                <p className="mt-1 text-base leading-relaxed text-on-surface md:text-lg">{match.line}</p>
              </>
            ) : null}
          </div>
          <BookConsultationButton className="mt-4 rounded-full bg-[#e5c378] px-5 py-2.5 text-sm font-bold text-[#1A1106] md:text-base">
            Full reading
          </BookConsultationButton>
        </div>
      </div>
    </section>
  );
}
