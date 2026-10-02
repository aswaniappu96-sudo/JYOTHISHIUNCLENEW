"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { usePortal } from "@/components/portal/PortalProvider";
import { htmlListItems, stripHtml, stripPublicPrices } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { useJuList } from "@/lib/useJuList";
import { whatsappUrl } from "@/lib/whatsapp";
import type { TravelDestination } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";
const FALLBACK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNdldoo4iCBMkr4QouH5UzKsQ7d8kXWDkfELH7tIk0C_HK51RzCjVJA1w3DtQXj-RbELSb_NnlHv-oa1mLugs-xpYCJXj-TaprbDpT0a3G_-Md65b1-GIHoCdPg_nyBD74Owc6pIsLgmfgGKPM2OrzFZsEipT90S37G7IZjq5Ymy30xRHaAl-RM0aKherHMqtJ1-DA6osmRywj0s6prU60oRtIvngWQETR-uXz1XCmjc03zuRKTLtEA";

const PIN_LAYOUT = [
  { x: 18, y: 16 },
  { x: 38, y: 34 },
  { x: 48, y: 52 },
  { x: 66, y: 70 },
  { x: 80, y: 84 },
];

const SKIP_STOP = /^(india|bharat|tamil nadu|kerala|karnataka|andhra pradesh|telangana|maharashtra|uttar pradesh|gujarat|rajasthan|odisha|west bengal|assam|punjab|haryana|bihar|madhya pradesh|goa|uttarakhand|himachal pradesh|jammu and kashmir|delhi|ncr)$/i;

function routeStops(item: TravelDestination) {
  const loc = stripPublicPrices(item.location || "");
  const parts = loc
    .split(/[,–—>|/]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 1 && !SKIP_STOP.test(part));
  if (parts.length >= 2) return parts.slice(0, 5);
  if (parts.length === 1) return [parts[0]];
  const title = stripPublicPrices(item.title).replace(/\s+(yatra|yathra|circuit|journey|tour|temple).*$/i, "").trim();
  return title ? [title] : [];
}

type YatraBadge = "yatra.badgeBooked" | "yatra.badgeWomen" | "yatra.badgePrasad";

function yatraLook(item: TravelDestination, index: number) {
  const hay = `${item.title} ${item.short_description} ${item.location}`.toLowerCase();
  const durationMatch = `${item.short_description} ${item.travel_information}`.match(/(\d+\s*days?[^,.|]*)/i);
  const templeMatch = `${item.short_description} ${item.travel_information}`.match(/(\d+)\s*temples?/i);
  let badge: YatraBadge = "yatra.badgePrasad";
  if (index === 0) badge = "yatra.badgeBooked";
  else if (/devi|shakti|women|mookambika/.test(hay)) badge = "yatra.badgeWomen";
  return {
    duration: durationMatch ? durationMatch[1].trim() : "Guided yatra",
    places: templeMatch ? `${templeMatch[1]} temples` : routeStops(item)[0] || "Moola temples",
    badge,
  };
}

function PinGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M12 21s7-6.2 7-11.2A7 7 0 1 0 5 9.8C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function BusGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 12h16M8 17v2M16 17v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function StayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M3 18V10.5A2.5 2.5 0 0 1 5.5 8H20v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 14h18M7 8V6.5A1.5 1.5 0 0 1 8.5 5H12v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FlameGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M12 20c3.4 0 5.5-2.4 5.5-5.4 0-3.4-2.6-5.6-3.7-8.1-.3-.6-1.3-.5-1.5.2C11.8 8.4 11 10 10.2 10c-.5 0-.8-.6-1.2-1.2C8.4 7.8 7.2 8.6 6.8 10.2 6.2 12.4 6.6 20 12 20Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FoodGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M7 3v8M5 3v5.5A2.5 2.5 0 0 0 7.5 11H9V3M16 8V3a3 3 0 0 0-3 3v5h4v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChatGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M5 17.5 6.2 14A7 7 0 1 1 12 19H7.2L5 17.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.8v3.4M16 3.8v3.4M4 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FEATURES = [
  { key: "yatra.featTravel" as const, icon: BusGlyph },
  { key: "yatra.featStay" as const, icon: StayGlyph },
  { key: "yatra.featPooja" as const, icon: FlameGlyph },
  { key: "yatra.featFood" as const, icon: FoodGlyph },
];

export function TravelSection({
  travel,
  whatsappNumber = "",
}: {
  travel: TravelDestination[];
  whatsappNumber?: string;
}) {
  const { t } = usePrefs();
  const { openEnquiry } = usePortal();
  const list = useJuList<TravelDestination>("/travel", travel).slice(0, 2);
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const mapStops = useMemo(() => {
    const names = list.flatMap(routeStops);
    const unique: string[] = [];
    names.forEach((name) => {
      if (!unique.some((item) => item.toLowerCase() === name.toLowerCase())) unique.push(name);
    });
    return unique.slice(0, 5);
  }, [list]);

  if (!list.length) return null;

  const chatHref = (item: TravelDestination) =>
    whatsappNumber.trim()
      ? whatsappUrl(whatsappNumber, item.whatsapp_message || `Namaste. I would like to know more about the ${stripPublicPrices(item.title)} yatra.`)
      : "";

  return (
    <section id="yatra" className="relative w-full overflow-hidden scroll-mt-36 py-12 md:py-20">
      <div className={INNER}>
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#EAD9B0] bg-white px-3.5 py-1.5 shadow-[0_1px_0_0_#EAD9B0]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B87E3B]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B5A42] md:text-[11px]">{t("yatra.badge")}</span>
            </div>
            <PageHeading className="mt-6" lead={t("yatra.lead")} accent={t("yatra.accent")} />
            <p className="mt-4 text-[15px] leading-[1.6] text-[#7A6B5A]">{t("yatra.copy")}</p>
          </div>
          <Link
            href="/religious-travel"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-[#EAD9B0] bg-white px-5 py-2.5 text-[13px] font-medium text-[#6B5A42] transition hover:border-[#B87E3B]/40 hover:text-[#2B2116]"
          >
            {t("yatra.view")} <ArrowGlyph className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-12 items-start gap-6 md:gap-8">
          <div className="relative col-span-1 hidden h-full md:block">
            <div className="sticky top-8 flex flex-col items-center">
              <div className="absolute top-0 bottom-0 left-1/2 z-0 w-px -translate-x-1/2 border-l border-dashed border-[#EAD9B0]" />
              <div className="relative z-10 flex flex-col gap-[108px] pt-6 md:gap-[112px]">
                {list.map((item, index) => (
                  <div key={item.id} className="flex flex-col items-center gap-2">
                    <div className={`grid h-9 w-9 place-items-center rounded-full border border-[#EAD9B0] bg-white shadow-sm transition-all ${hover === item.slug ? "scale-110 border-[#B87E3B]" : ""}`}>
                      <PinGlyph className="h-4 w-4 text-[#B87E3B]" />
                    </div>
                    <span className="origin-center rotate-90 text-[10px] font-semibold tracking-widest text-[#BEB0A0] lg:rotate-90">
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 hidden flex-col items-center gap-1 text-[10px] tracking-widest text-[#C8B99E] lg:flex">
                <span className="origin-center rotate-90 whitespace-nowrap">{t("yatra.marga")}</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-6 md:col-span-11 md:gap-7 lg:col-span-8">
            {list.map((item, index) => {
              const title = stripPublicPrices(item.title);
              const summary = stripPublicPrices(item.short_description);
              const src = imageSrc(item.featured_image, FALLBACK);
              const look = yatraLook(item, index);
              const stops = routeStops(item);
              const extras = htmlListItems(item.travel_information).slice(0, 4);
              const extraCopy = stripPublicPrices(stripHtml(item.travel_information)).slice(0, 220);
              const hovered = hover === item.slug;
              const expanded = open === item.slug;
              const wa = chatHref(item);

              return (
                <article
                  key={item.id}
                  onMouseEnter={() => setHover(item.slug)}
                  onMouseLeave={() => setHover(null)}
                  className={`group relative flex flex-col overflow-hidden rounded-[20px] border border-[#EAD9B0] bg-white shadow-[0_8px_30px_-18px_rgba(184,126,59,0.25),0_1px_0_0_#EAD9B0] transition-all duration-300 md:flex-row ${hovered ? "-translate-y-[2px] border-[#D9C59A] shadow-[0_18px_40px_-18px_rgba(184,126,59,0.35),0_1px_0_0_#EAD9B0]" : ""}`}
                >
                  <div className="absolute top-4 left-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-[#EAD9B0] bg-white shadow-sm md:hidden">
                    <PinGlyph className="h-3.5 w-3.5 text-[#B87E3B]" />
                  </div>
                  <div className="relative w-full shrink-0 md:w-[35%]">
                    <div className="relative h-[210px] w-full overflow-hidden md:h-full md:min-h-[248px]">
                      <img src={src} alt={title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
                      <div className="absolute inset-0 grid place-items-center opacity-[0.12]">
                        <span className="select-none font-serif text-[84px] leading-none text-white">ॐ</span>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1D1408]/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                          <CalendarGlyph className="h-3 w-3" /> {t("yatra.dates")}
                        </span>
                        <span className="hidden rounded-full border border-[#EAD9B0] bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#6B5A42] backdrop-blur md:inline-flex">
                          {t(look.badge)}
                        </span>
                      </div>
                      <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD9B0] bg-white/90 px-3 py-1 text-[11px] font-medium text-[#6B5A42] shadow-sm">
                          {look.places} • {look.duration}
                        </span>
                        <span className="inline-flex rounded-full bg-[#B87E3B] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white md:hidden">
                          {t(look.badge)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-5 py-5 md:px-6 md:py-[18px]">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-[19px] leading-[1.15] tracking-[-0.01em] text-[#1D1408] md:text-[20px]">
                        <Link href={`/religious-travel/${item.slug}`} className="hover:text-[#B87E3B]">
                          {title}
                        </Link>
                      </h3>
                      {item.location ? (
                        <span className="hidden rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#8C7A60] md:inline-flex">
                          {look.places}
                        </span>
                      ) : null}
                    </div>
                    {stops.length ? (
                      <div className="mt-2 flex flex-wrap items-center gap-1 text-[12px] leading-[1.5] text-[#8C7A60]">
                        {stops.map((stop, stopIndex) => (
                          <span key={`${item.slug}-${stop}`} className="inline-flex items-center gap-1">
                            <span>{stop}</span>
                            {stopIndex < stops.length - 1 ? <span className="mx-1 text-[#D8CBB6]">→</span> : null}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {summary ? <p className="mt-3 line-clamp-2 text-[13px] leading-[1.6] text-[#7A6B5A]">{summary}</p> : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <span key={feature.key} className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD9B0]/80 bg-[#FFFBF0] px-3 py-1 text-[11px] font-medium text-[#6B5A42]">
                            <Icon className="h-3.5 w-3.5 text-[#B87E3B]" />
                            {t(feature.key)}
                          </span>
                        );
                      })}
                    </div>
                    {expanded ? (
                      <div className="mt-4 rounded-[12px] border border-[#EAD9B0] bg-[#FFFBF0] p-3.5">
                        <div className="grid grid-cols-2 gap-3 text-[12px]">
                          <div>
                            <p className="text-[10px] tracking-widest text-[#B0A08A] uppercase">{t("yatra.guide")}</p>
                            <p className="mt-1 font-medium text-[#2B2116]">{t("yatra.guideVal")}</p>
                          </div>
                          <div>
                            <p className="text-[10px] tracking-widest text-[#B0A08A] uppercase">{t("yatra.group")}</p>
                            <p className="mt-1 font-medium text-[#2B2116]">{t("yatra.groupVal")}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] tracking-widest text-[#B0A08A] uppercase">{t("yatra.includes")}</p>
                            <p className="mt-1 font-medium text-[#2B2116]">
                              {extras[0] || extraCopy || t("yatra.includesVal")}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/religious-travel/${item.slug}`}
                          className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#B87E3B]"
                        >
                          {t("yatra.open")} <ArrowGlyph className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#B87E3B]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B87E3B]" />
                        {t("yatra.next")}
                      </p>
                      <div className="flex items-center gap-2">
                        {wa ? (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center justify-center rounded-full border border-[#EAD9B0] bg-white px-3.5 text-[12px] font-medium text-[#6B5A42] transition hover:border-[#B87E3B]/30 hover:text-[#2B2116]"
                          >
                            <ChatGlyph className="mr-1.5 h-3.5 w-3.5" /> {t("yatra.chat")}
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setOpen(expanded ? null : item.slug)}
                          className="inline-flex h-9 items-center justify-center rounded-full bg-[#B87E3B] px-4 text-[12.5px] font-semibold text-white shadow-[0_2px_0_0_#9A6530] transition hover:bg-[#A66E32] active:translate-y-px active:shadow-none"
                        >
                          {t("yatra.more")}
                          <ArrowGlyph className={`ml-1.5 h-4 w-4 transition-transform ${hovered || expanded ? "translate-x-1" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute top-0 right-0 h-full w-[3px] bg-transparent transition-colors group-hover:bg-[#EAD9B0]" />
                </article>
              );
            })}
          </div>

          <div className="col-span-12 hidden lg:col-span-3 lg:block">
            <div className="sticky top-8 overflow-hidden rounded-[20px] border border-[#EAD9B0] bg-white shadow-[0_8px_30px_-18px_rgba(184,126,59,0.25)]">
              <div className="flex items-center justify-between p-5 pb-3">
                <h3 className="font-serif text-[16px] text-[#1D1408]">{t("yatra.map")}</h3>
                <span className="rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#8C7A60]">{t("yatra.live")}</span>
              </div>
              <div className="relative mx-3 h-[220px] overflow-hidden rounded-[14px] border border-[#EAD9B0]/70 bg-[#FFFBF0]">
                <div
                  className="absolute inset-0 opacity-[0.35]"
                  style={{
                    backgroundImage: "linear-gradient(#EAD9B0 1px, transparent 1px), linear-gradient(90deg, #EAD9B0 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden>
                  <path d="M 28 32 C 70 48, 55 90, 96 108 S 132 142, 168 172" fill="none" stroke="#B87E3B" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.6" />
                </svg>
                {mapStops.map((stop, index) => (
                  <div
                    key={stop}
                    className="absolute"
                    style={{ left: `${PIN_LAYOUT[index]?.x || 20}%`, top: `${PIN_LAYOUT[index]?.y || 20}%` }}
                  >
                    <div className="relative">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#B87E3B] ring-4 ring-[#EAD9B0]/60" />
                      <span className="absolute top-1/2 left-4 max-w-[92px] -translate-y-1/2 truncate rounded-full border border-[#EAD9B0] bg-white px-2 py-0.5 text-[10px] font-medium text-[#6B5A42] shadow-sm">
                        {stop}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-[#EAD9B0]" />
                  <span className="text-[10px] tracking-widest text-[#B0A08A]">{t("yatra.included")}</span>
                  <div className="h-px flex-1 bg-[#EAD9B0]" />
                </div>
                <ul className="space-y-2 text-[12px] text-[#6B5A42]">
                  <li>• {t("yatra.inc1")}</li>
                  <li>• {t("yatra.inc2")}</li>
                  <li>• {t("yatra.inc3")}</li>
                </ul>
                <button
                  type="button"
                  onClick={() => openEnquiry("Temple yatra dates")}
                  className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#1D1408] text-[13px] font-medium text-white transition hover:bg-[#2B2116]"
                >
                  <CalendarGlyph className="h-4 w-4" /> {t("yatra.datesCta")}
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-[14px] border border-[#EAD9B0] bg-white px-4 py-3">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#EAD9B0] bg-[#FFFBF0]">🪔</div>
              <p className="text-[11.5px] leading-[1.5] text-[#7A6B5A]">
                <span className="font-semibold text-[#2B2116]">{t("yatra.paceLead")} </span>
                {t("yatra.pace")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-[16px] border border-dashed border-[#EAD9B0] bg-white px-5 py-3 md:mt-16 md:flex-row">
          <p className="text-center text-[12px] text-[#8C7A60] md:text-left">
            {t("yatra.private")} <span className="font-medium text-[#B87E3B]">{t("yatra.circuits")}</span>
          </p>
          <button
            type="button"
            onClick={() => openEnquiry("Private family yatra")}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-4 py-1.5 text-[12px] font-medium text-[#6B5A42] transition hover:bg-white"
          >
            {t("yatra.coordinator")} <ArrowGlyph className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
