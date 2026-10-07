"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PageHeading } from "@/components/home/SectionHeading";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { dailyRashiReading, HOROSCOPE_RASHIS } from "@/lib/dailyHoroscope";
import { lifePathNumber, luckyForRashi, matchNote, nameNumber } from "@/lib/freeAstrology";
import {
  DEFAULT_TIMEZONE,
  birthOutline,
  getPanchang,
  visitorTimeZone,
  type PanchangSnapshot,
} from "@/lib/panchang";
import { RASHIS } from "@/lib/rashis";

const CARD_H = 92;
const CARD_GAP = 10;
const VISIBLE = 4;
const SLIDER_H = CARD_H * VISIBLE + CARD_GAP * (VISIBLE - 1);

type ToolId = "kundli" | "match" | "horoscope" | "rashi" | "nakshatra" | "numerology";

const TOOLS: { id: ToolId; label: "daily.tabKundli" | "daily.tabMatch" | "daily.tabHoroscope" | "daily.tabRashi" | "daily.tabNakshatra" | "daily.tabNumerology" }[] = [
  { id: "kundli", label: "daily.tabKundli" },
  { id: "match", label: "daily.tabMatch" },
  { id: "horoscope", label: "daily.tabHoroscope" },
  { id: "rashi", label: "daily.tabRashi" },
  { id: "nakshatra", label: "daily.tabNakshatra" },
  { id: "numerology", label: "daily.tabNumerology" },
];

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
        const x = (50 + 42 * Math.cos(rad)).toFixed(4);
        const y = (50 + 42 * Math.sin(rad)).toFixed(4);
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

function civilDate(date: string, time: string) {
  const clock = time && time.length >= 4 ? time : "12:00";
  const parsed = new Date(`${date}T${clock}:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

const fieldClass =
  "mt-1 w-full rounded-2xl border-2 border-[#e5c378]/55 bg-white px-4 py-2.5 text-[14px] text-[#1A1106] outline-none focus:border-[#e5c378]";
const labelClass = "text-[11px] font-bold uppercase tracking-[0.12em] text-[#1A1106]/50";
const goldBtn =
  "mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#e5c378] px-4 py-3 text-[14px] font-bold text-[#1A1106] transition hover:bg-[#F1D59B]";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function ToolCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border-2 border-[#e5c378] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(26,17,6,0.16)] sm:p-6">
      {children}
    </div>
  );
}

export function DailyHoroscope() {
  const { t } = usePrefs();
  const [tab, setTab] = useState<ToolId>("horoscope");
  const [selected, setSelected] = useState<(typeof RASHIS)[number]>(RASHIS[0]);
  const [panchang, setPanchang] = useState<PanchangSnapshot>(() => getPanchang(DEFAULT_TIMEZONE));
  const [tz, setTz] = useState(DEFAULT_TIMEZONE);
  const scroller = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const skipScroll = useRef(false);

  const [kundli, setKundli] = useState({ name: "", date: "", time: "", place: "" });
  const [kundliOut, setKundliOut] = useState<ReturnType<typeof birthOutline> | null>(null);
  const [match, setMatch] = useState({ a: RASHIS[0].slug, b: RASHIS[6].slug });
  const [calcDate, setCalcDate] = useState({ date: "", time: "" });
  const [calcOut, setCalcOut] = useState<ReturnType<typeof birthOutline> | null>(null);
  const [num, setNum] = useState({ name: "", date: "" });
  const [numOut, setNumOut] = useState<{ life: number; name: number } | null>(null);

  useEffect(() => {
    const zone = visitorTimeZone();
    setTz(zone);
    setPanchang(getPanchang(zone));
  }, []);

  useEffect(() => {
    const applyTool = () => {
      const fromQuery = new URLSearchParams(window.location.search).get("tool");
      const fromHash = window.location.hash.replace(/^#/, "");
      const candidate = fromQuery || fromHash;
      if (TOOLS.some((item) => item.id === candidate)) setTab(candidate as ToolId);
    };
    applyTool();
    window.addEventListener("hashchange", applyTool);
    return () => window.removeEventListener("hashchange", applyTool);
  }, []);

  const selectedIndex = Math.max(0, HOROSCOPE_RASHIS.findIndex((item) => item.slug === selected.slug));
  const reading = dailyRashiReading(selected.slug);
  const lucky = luckyForRashi(selected.slug);
  const matchResult = matchNote(match.a, match.b);
  const matchA = RASHIS.find((item) => item.slug === match.a) || RASHIS[0];
  const matchB = RASHIS.find((item) => item.slug === match.b) || RASHIS[0];

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
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      window.setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
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

  const runBirth = (date: string, time: string) => {
    if (!date) return null;
    return birthOutline(tz, civilDate(date, time));
  };

  const rashiFrom = (out: ReturnType<typeof birthOutline> | null) =>
    out ? RASHIS[out.rashiIndex] || RASHIS[0] : null;

  const tabOn = "border-2 border-[#e5c378] bg-[#e5c378] text-[#1A1106]";
  const tabOff = "border-2 border-[#e5c378]/50 bg-white text-[#1A1106]/70 hover:border-[#e5c378]";

  return (
    <section id="horoscope" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16">
      <span id="free-tools" className="sr-only" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, rgba(229,195,120,0.35), transparent 42%)" }} />
      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-tertiary">{t("daily.kicker")}</p>
        <PageHeading className="mt-3" lead={t("daily.lead")} accent={t("daily.accent")} />
        <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#1A1106]/70 sm:text-[16px]">{t("daily.copy")}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {TOOLS.map((tool) => {
            const on = tab === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setTab(tool.id)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold sm:px-4 sm:text-[13px] ${on ? tabOn : tabOff}`}
                aria-pressed={on}
              >
                {t(tool.label)}
              </button>
            );
          })}
        </div>

        {tab === "horoscope" ? (
          <>
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
              <div className="hidden rounded-[28px] border-2 border-[#e5c378] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(26,17,6,0.16)] sm:p-6 lg:block">
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

              <div
                ref={detailRef}
                id="horoscope-detail"
                className="flex scroll-mt-36 flex-col rounded-[28px] border-2 border-[#e5c378] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(26,17,6,0.16)]"
                style={{ minHeight: SLIDER_H }}
              >
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
          </>
        ) : null}

        {tab === "kundli" ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <ToolCard>
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  const date = String(form.get("date") || kundli.date);
                  const time = String(form.get("time") || kundli.time);
                  const name = String(form.get("name") || kundli.name);
                  const place = String(form.get("place") || kundli.place);
                  setKundli({ name, date, time, place });
                  setKundliOut(runBirth(date, time));
                }}
              >
                <Field label={t("daily.name")}>
                  <input name="name" className={fieldClass} value={kundli.name} onChange={(e) => setKundli({ ...kundli, name: e.target.value })} />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={t("daily.dob")}>
                    <input name="date" type="date" className={fieldClass} value={kundli.date} onChange={(e) => setKundli({ ...kundli, date: e.target.value })} required />
                  </Field>
                  <Field label={t("daily.time")}>
                    <input name="time" type="time" className={fieldClass} value={kundli.time} onChange={(e) => setKundli({ ...kundli, time: e.target.value })} />
                  </Field>
                </div>
                <Field label={t("daily.place")}>
                  <input name="place" className={fieldClass} value={kundli.place} onChange={(e) => setKundli({ ...kundli, place: e.target.value })} />
                </Field>
                <button type="submit" className={goldBtn}>
                  {t("daily.show")}
                </button>
              </form>
            </ToolCard>
            <ToolCard>
              {kundliOut ? (
                <>
                  <p className="font-serif text-[22px] font-medium text-[#1A1106]">{kundli.name || t("daily.tabKundli")}</p>
                  <p className="mt-1 text-[13px] text-[#1A1106]/50">{kundli.place}</p>
                  <dl className="mt-4 grid gap-2 text-[14px]">
                    <div>
                      <dt className="font-bold text-tertiary">{t("daily.moonRashi")}</dt>
                      <dd className="mt-0.5">{rashiFrom(kundliOut)?.sa} · {rashiFrom(kundliOut)?.en}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-tertiary">{t("daily.nakshatra")}</dt>
                      <dd className="mt-0.5">{kundliOut.nakshatraLabel}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-tertiary">{t("daily.tithi")}</dt>
                      <dd className="mt-0.5">{kundliOut.tithiLabel} · {kundliOut.pakshaLabel}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="text-[14px] leading-relaxed text-[#1A1106]/60">{t("daily.outline")}</p>
              )}
              <p className="mt-4 text-[12px] leading-relaxed text-[#1A1106]/50">{t("daily.outline")}</p>
            </ToolCard>
          </div>
        ) : null}

        {tab === "match" ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <ToolCard>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("daily.boy")}>
                  <select className={fieldClass} value={match.a} onChange={(e) => setMatch({ ...match, a: e.target.value })}>
                    {RASHIS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.sa} · {item.en}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("daily.girl")}>
                  <select className={fieldClass} value={match.b} onChange={(e) => setMatch({ ...match, b: e.target.value })}>
                    {RASHIS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.sa} · {item.en}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </ToolCard>
            <ToolCard>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-tertiary">{t("daily.matchScore")}</p>
              <p className="mt-2 font-serif text-[40px] font-medium leading-none text-[#1A1106]">
                {matchResult.score}
                <span className="text-[18px] text-[#1A1106]/40"> / 10</span>
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[#1A1106]">
                {matchA.sa} · {matchB.sa}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[#1A1106]/70">{matchResult.line}</p>
              <p className="mt-4 text-[12px] leading-relaxed text-[#1A1106]/50">{t("daily.outline")}</p>
            </ToolCard>
          </div>
        ) : null}

        {tab === "rashi" || tab === "nakshatra" ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <ToolCard>
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  const date = String(form.get("date") || calcDate.date);
                  const time = String(form.get("time") || calcDate.time);
                  setCalcDate({ date, time });
                  setCalcOut(runBirth(date, time));
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={t("daily.dob")}>
                    <input name="date" type="date" className={fieldClass} value={calcDate.date} onChange={(e) => setCalcDate({ ...calcDate, date: e.target.value })} required />
                  </Field>
                  <Field label={t("daily.time")}>
                    <input name="time" type="time" className={fieldClass} value={calcDate.time} onChange={(e) => setCalcDate({ ...calcDate, time: e.target.value })} />
                  </Field>
                </div>
                <button type="submit" className={goldBtn}>
                  {t("daily.show")}
                </button>
              </form>
            </ToolCard>
            <ToolCard>
              {calcOut && tab === "rashi" ? (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-tertiary">{t("daily.moonRashi")}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={`/rashis/rashi-${rashiFrom(calcOut)?.slug}.png?v=3`}
                      alt=""
                      className="h-16 w-16 rounded-full object-cover object-[center_68%] ring-2 ring-[#e5c378]"
                    />
                    <div>
                      <p className="font-serif text-[24px] font-medium text-[#1A1106]">{rashiFrom(calcOut)?.sa}</p>
                      <p className="text-[14px] text-[#1A1106]/50">{rashiFrom(calcOut)?.en}</p>
                    </div>
                  </div>
                </>
              ) : null}
              {calcOut && tab === "nakshatra" ? (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-tertiary">{t("daily.nakshatra")}</p>
                  <p className="mt-3 font-serif text-[24px] font-medium text-[#1A1106]">{calcOut.nakshatraLabel}</p>
                  <p className="mt-2 text-[14px] text-[#1A1106]/60">
                    {t("daily.moonRashi")}: {rashiFrom(calcOut)?.sa} · {calcOut.tithiLabel}
                  </p>
                </>
              ) : null}
              {!calcOut ? <p className="text-[14px] leading-relaxed text-[#1A1106]/60">{t("daily.outline")}</p> : null}
              <p className="mt-4 text-[12px] leading-relaxed text-[#1A1106]/50">{t("daily.outline")}</p>
            </ToolCard>
          </div>
        ) : null}

        {tab === "numerology" ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <ToolCard>
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  const name = String(form.get("name") || num.name);
                  const date = String(form.get("date") || num.date);
                  setNum({ name, date });
                  setNumOut({ life: lifePathNumber(date), name: nameNumber(name) });
                }}
              >
                <Field label={t("daily.name")}>
                  <input name="name" className={fieldClass} value={num.name} onChange={(e) => setNum({ ...num, name: e.target.value })} required />
                </Field>
                <Field label={t("daily.dob")}>
                  <input name="date" type="date" className={fieldClass} value={num.date} onChange={(e) => setNum({ ...num, date: e.target.value })} required />
                </Field>
                <button type="submit" className={goldBtn}>
                  {t("daily.show")}
                </button>
              </form>
            </ToolCard>
            <ToolCard>
              {numOut ? (
                <>
                  <p className="font-serif text-[22px] font-medium text-[#1A1106]">{num.name}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#e5c378]/70 bg-[#fff8ec] px-3 py-1 text-[12px] font-semibold text-[#1A1106]">
                      {t("daily.lifePath")} · {numOut.life}
                    </span>
                    <span className="rounded-full border border-[#e5c378]/70 bg-[#fff8ec] px-3 py-1 text-[12px] font-semibold text-[#1A1106]">
                      {t("daily.nameNo")} · {numOut.name}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-[14px] leading-relaxed text-[#1A1106]/60">{t("daily.outline")}</p>
              )}
              <p className="mt-4 text-[12px] leading-relaxed text-[#1A1106]/50">{t("daily.outline")}</p>
            </ToolCard>
          </div>
        ) : null}
      </div>
    </section>
  );
}
