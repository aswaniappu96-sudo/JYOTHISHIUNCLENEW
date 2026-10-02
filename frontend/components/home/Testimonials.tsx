"use client";

import { useMemo, useRef, useState, type MouseEvent } from "react";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { stripPublicPrices } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { useJuList } from "@/lib/useJuList";
import type { Testimonial } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

const GRADIENTS = [
  "from-[#FDE8C5] to-[#F9C49A]",
  "from-[#D9EAD3] to-[#A8C6A0]",
  "from-[#EAD9F0] to-[#C9A8D8]",
  "from-[#FCEED0] to-[#E9C89A]",
  "from-[#D0E6F5] to-[#8FB8D8]",
  "from-[#FFF0C2] to-[#E9B44C]",
  "from-[#FDE1C8] to-[#E9A87A]",
  "from-[#D8F0E8] to-[#9AC9B8]",
];

type CatKey = "review.catKundli" | "review.catPrashna" | "review.catPooja" | "review.catYatra" | "review.catMatch" | "review.catConsult";

type Card = {
  id: number;
  name: string;
  place: string;
  initial: string;
  quote: string;
  rating: number;
  image: string;
  gradient: string;
  category: CatKey;
  liveTag: string;
};

function splitName(raw: string, worldwide: string) {
  const cleaned = stripPublicPrices(raw).trim();
  const parts = cleaned.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return { name: parts[0], place: parts.slice(1).join(", ") };
  return { name: cleaned || "Family", place: worldwide };
}

function categoryFor(text: string): CatKey {
  const key = text.toLowerCase();
  if (/yatra|yathra|temple|darshan|pilgrim|chardham|rameswaram|sabarimal/.test(key)) return "review.catYatra";
  if (/prashna|prasna/.test(key)) return "review.catPrashna";
  if (/match|marriage|jathaka|kundali matching|compatibility/.test(key)) return "review.catMatch";
  if (/homam|pooja|puja|sankalpa|prasad|priest/.test(key)) return "review.catPooja";
  if (/kundli|kundali|chart|dasha/.test(key)) return "review.catKundli";
  return "review.catConsult";
}

function liveTagFor(text: string) {
  const key = text.toLowerCase();
  if (/video call|live video|\bzoom\b|google meet/.test(key)) return "Live video";
  if (/whatsapp|photo|proof/.test(key)) return "WhatsApp notes";
  return "";
}

function stars(count: number) {
  const n = Math.min(5, Math.max(1, count || 5));
  return "★".repeat(n);
}

function toCard(item: Testimonial, index: number, worldwide: string): Card {
  const { name, place } = splitName(item.name, worldwide);
  const quote = stripPublicPrices(item.review || "").trim();
  return {
    id: item.id,
    name,
    place,
    initial: (name.replace(/[^A-Za-z\u0900-\u0D7F]/g, "")[0] || "J").toUpperCase(),
    quote,
    rating: item.rating || 5,
    image: imageSrc(item.image),
    gradient: GRADIENTS[index % GRADIENTS.length],
    category: categoryFor(`${item.name} ${quote}`),
    liveTag: liveTagFor(quote),
  };
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const list = useJuList<Testimonial>("/testimonials", testimonials);
  const { t } = usePrefs();
  const streamRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Card | null>(null);
  const [helpful, setHelpful] = useState<Record<number, boolean>>({});

  const cards = useMemo(
    () => list.map((item, index) => toCard(item, index, t("review.worldwide"))),
    [list, t],
  );
  const featured = cards.slice(0, 3);
  const stream = cards.length ? [...cards, ...cards] : [];
  const avg = cards.length
    ? (cards.reduce((sum, item) => sum + item.rating, 0) / cards.length).toFixed(1)
    : "5.0";

  if (!cards.length) return null;

  const markHelpful = (id: number, event?: MouseEvent) => {
    event?.stopPropagation();
    setHelpful((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  return (
    <section id="reviews" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16 lg:py-20">
      <div className={INNER}>
        <div className="mb-10 flex flex-col gap-8 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-white px-3.5 py-1.5 shadow-[0_1px_0_#EAD9B0]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1FA971]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8C6F3A] md:text-[11px]">
                {t("review.kicker")}
              </span>
            </div>
            <PageHeading className="mt-5" lead={t("review.lead")} accent={t("review.accent")} />
            <p className="mt-4 max-w-[560px] text-[15px] leading-6 text-[#7C6E5C] md:text-[16px]">{t("review.copy")}</p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => streamRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="group inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-white px-5 py-2.5 text-[13px] font-semibold tracking-wide text-[#6B5430] transition-all hover:border-[#D9C29A] hover:bg-[#FFFEFB]"
            >
              {t("review.view")}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
            <div className="flex items-center gap-3 rounded-[16px] border border-[#EAD9B0] bg-white px-4 py-2.5 shadow-[0_2px_10px_rgba(184,126,59,0.08)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FFFBF0] text-[13px] font-bold text-[#B87E3B]">
                ★
              </div>
              <div className="leading-tight">
                <div className="flex items-baseline gap-1">
                  <span className="text-[15px] font-bold text-[#2B2116]">{avg}</span>
                  <span className="text-[13px] text-[#8C7A60]">{t("review.of5")}</span>
                </div>
                <div className="text-[11px] font-medium tracking-wide text-[#9C8A6E]">{t("review.count", { n: cards.length })}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {featured.map((item) => (
            <article
              key={item.id}
              onClick={() => setOpen(item)}
              className="group relative flex cursor-pointer flex-col justify-between rounded-[20px] border border-[#EAD9B0] bg-white p-5 shadow-[0_1px_0_#EAD9B0,0_8px_24px_rgba(184,126,59,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_0_#EAD9B0,0_16px_32px_rgba(184,126,59,0.12)] md:p-[22px]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full border border-white object-cover shadow-[0_1px_0_#EAD9B0]"
                      />
                    ) : (
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white bg-linear-to-br ${item.gradient} text-[15px] font-bold text-[#5A3D1E] shadow-[0_1px_0_#EAD9B0]`}
                      >
                        {item.initial}
                      </div>
                    )}
                    <div className="leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-semibold text-[#2B2116]">{item.name}</span>
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1FA971] text-[10px] text-white">✓</span>
                      </div>
                      <div className="mt-0.5 text-[12px] font-medium text-[#9C8A6E]">
                        {item.place} • {t(item.category)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="text-[14px] tracking-[1px] text-[#E9B44C]">{stars(item.rating)}</div>
                  <span className="text-[12px] font-bold text-[#8C6F3A]">{item.rating.toFixed(1)}</span>
                </div>
                <p className="mt-3 line-clamp-4 font-serif text-[16.5px] leading-[1.45] italic text-[#5A4D3E]">
                  “{item.quote}”
                </p>
              </div>
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-3 py-1.5 text-[11px] font-semibold text-[#7A5A2E]">
                    {t(item.category)}
                  </span>
                  {item.liveTag ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#EAD9B0] bg-white px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#B87E3B] uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E84B4B]" /> {item.liveTag}
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#F3E6C9] pt-3">
                  <button
                    type="button"
                    onClick={(event) => markHelpful(item.id, event)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      helpful[item.id]
                        ? "border-[#E9C891] bg-[#FFF3D6] text-[#7A5A2E]"
                        : "border-[#EAD9B0] bg-white text-[#9C8A6E] hover:bg-[#FFFBF0]"
                    }`}
                  >
                    👍 {t("review.helpful")}
                  </button>
                  <span className="text-[11px] font-medium text-[#B9A892] transition-colors group-hover:text-[#8C7A60]">
                    {t("review.read")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 md:mt-10" ref={streamRef} id="review-stream">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-[#B5A48A] uppercase">{t("review.more")}</span>
            <span className="hidden text-[11px] text-[#C3B49A] md:inline">{t("review.pause")}</span>
          </div>
          <div className="review-marquee-mask relative overflow-hidden rounded-[20px] border border-[#EAD9B0] bg-white/70 backdrop-blur">
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-16 bg-linear-to-r from-[#FFFBF0] to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-linear-to-l from-[#FFFBF0] to-transparent" />
            <div className="review-marquee flex w-max gap-3 px-3 py-3.5">
              {stream.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex shrink-0 items-center gap-3 rounded-full border border-[#EAD9B0] bg-white py-1.5 pr-4 pl-1.5 shadow-[0_1px_0_#EAD9B0]"
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border border-white bg-linear-to-br ${item.gradient} text-[11px] font-bold text-[#5A3D1E]`}
                  >
                    {item.initial}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#E9B44C]">{stars(item.rating)}</span>
                    <span className="max-w-[280px] truncate text-[13px] font-medium text-[#4A3D2E]">“{item.quote}”</span>
                  </div>
                  <span className="rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#8C6F3A] uppercase">
                    {t(item.category)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 md:mt-10 md:gap-3">
          {(["review.proof1", "review.proof2", "review.proof3", "review.proof4"] as const).map((key) => (
            <div
              key={key}
              className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-white px-4 py-2 text-[12px] font-medium text-[#6B5430] shadow-[0_1px_0_#EAD9B0] md:text-[13px]"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1FA971] text-[10px] text-white">✓</span>
              {t(key)}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-[#D9C29A] bg-[#FFFEFB] px-6 py-5 md:flex-row">
          <span className="text-[14px] text-[#7C6E5C]">{t("review.asked")}</span>
          <a
            href="#enquiry"
            className="inline-flex items-center gap-2 rounded-full border border-[#B87E3B] bg-white px-5 py-2 text-[13px] font-semibold text-[#8A5A24] transition-colors hover:bg-[#FFFBF0]"
          >
            {t("review.leave")}
          </a>
          <span className="text-[11px] text-[#B5A48A]">{t("review.note")}</span>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-[#2B2116]/30 backdrop-blur-[6px]" onClick={() => setOpen(null)} />
          <div className="relative w-full max-w-[560px] rounded-[24px] border border-[#EAD9B0] bg-white p-6 shadow-[0_20px_60px_rgba(61,46,30,0.18)] md:p-7">
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FFFBF0] text-[#8C7A60] hover:bg-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-3">
              {open.image ? (
                <img src={open.image} alt="" className="h-12 w-12 rounded-full border border-white object-cover shadow" />
              ) : (
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border border-white bg-linear-to-br ${open.gradient} text-[16px] font-bold text-[#5A3D1E] shadow`}
                >
                  {open.initial}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#2B2116]">{open.name}</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1FA971] text-[10px] text-white">✓</span>
                  <span className="rounded-full border border-[#A5D6A7] bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#2E7D32]">
                    {t("review.verified")}
                  </span>
                </div>
                <div className="text-[12px] text-[#9C8A6E]">
                  {open.place} • {t(open.category)}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[#E9B44C]">{stars(open.rating)}</span>
              <span className="text-[12px] font-bold text-[#8C6F3A]">
                {open.rating.toFixed(1)} • {t("review.trusted")}
              </span>
            </div>
            <p className="mt-4 font-serif text-[18px] leading-[1.5] italic text-[#3D2E1E]">“{open.quote}”</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-3 py-1.5 text-[11px] font-semibold text-[#7A5A2E]">
                {t(open.category)}
              </span>
              {open.liveTag ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#EAD9B0] bg-white px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#B87E3B] uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E84B4B]" /> {open.liveTag}
                </span>
              ) : null}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-4 py-2">
              <span className="text-[12px] text-[#7C6E5C]">{t("review.helpfulQ")}</span>
              <button
                type="button"
                onClick={() => markHelpful(open.id)}
                className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                  helpful[open.id]
                    ? "border-[#2B2116] bg-[#2B2116] text-white"
                    : "border-[#EAD9B0] bg-white text-[#6B5430] hover:bg-[#FFFEFB]"
                }`}
              >
                👍 {t("review.helpful")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
