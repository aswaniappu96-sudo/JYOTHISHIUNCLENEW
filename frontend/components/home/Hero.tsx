"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { CosmicMandala } from "@/components/home/CosmicMandala";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { mediaUrl } from "@/lib/api/client";
import { DEFAULT_TIMEZONE, getPanchang, visitorTimeZone, type PanchangSnapshot } from "@/lib/panchang";
import { POOJAS_PATH } from "@/lib/siteRoutes";
import { telHref } from "@/lib/html";
import { OnlineNow } from "@/components/layout/SitePrefs";
import { HEADER_PAD, HEADER_PULL, SHELL } from "@/lib/layout";
import { allSiteServices } from "@/lib/siteServices";
import { useJuList } from "@/lib/useJuList";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Astrologer, AstrologyService } from "@/types/wordpress";

const FALLBACK_PHONE = "+91 84519 89496";
const FALLBACK_WHATSAPP = "918451989496";

function usablePhone(value?: string) {
  const text = (value || "").trim();
  if (!text || /0000/.test(text) || text.replace(/\D/g, "") === "96800000000") return FALLBACK_PHONE;
  return text;
}

function usableWhatsapp(value?: string) {
  const text = (value || "").trim();
  if (!text || /0000/.test(text) || text.replace(/\D/g, "") === "96800000000") return FALLBACK_WHATSAPP;
  return text;
}

const SLIDES = [
  {
    src: "/images/hero/banner-temple.jpg",
    kicker: "hero.kicker1",
    title: "hero.title1",
    copy: "hero.copy1",
  },
  {
    src: "/images/hero/banner-pooja.jpg",
    kicker: "hero.kicker2",
    title: "hero.title2",
    copy: "hero.copy2",
  },
  {
    src: "/images/hero/banner-products.jpg",
    kicker: "hero.kicker3",
    title: "hero.title3",
    copy: "hero.copy3",
  },
] as const;

const ctaPrimary =
  "inline-flex items-center justify-center rounded-full bg-primary-container px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary shadow-[0_10px_28px_rgba(201,162,39,0.4)] transition hover:brightness-95";
const ctaGhost =
  "inline-flex items-center justify-center rounded-full border border-[#f3e6c8]/40 bg-[#1c1008]/40 px-5 py-2.5 text-sm font-semibold text-[#fff8ec] backdrop-blur-md transition hover:bg-[#1c1008]/65";

const POPULAR = [
  { key: "hero.popLove", href: "/astrologers?topic=love", terms: ["love"] },
  { key: "hero.popMarriage", href: "/astrologers?topic=marriage", terms: ["marriage", "match"] },
  { key: "hero.popCareer", href: "/astrologers?topic=career", terms: ["career"] },
  { key: "hero.popBusiness", href: "/astrologers?topic=business", terms: ["business"] },
  { key: "hero.popFinance", href: "/astrologers?topic=business", terms: ["finance", "money"] },
  { key: "hero.popKundli", href: "/astrologers?topic=marriage", terms: ["kundli", "kundali", "birth", "chart"] },
  { key: "hero.popVastu", href: "/astrologers?topic=vastu", terms: ["vastu"] },
] as const;

function searchHref(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return "/#astrologers";
  if (/pooja|homam|puja/.test(q)) return POOJAS_PATH;
  if (/yatra|temple|travel/.test(q)) return "/religious-travel";
  if (/horoscope|rashi/.test(q)) return "/#horoscope";
  const popular = POPULAR.find((item) => item.terms.some((term) => q.includes(term)));
  if (popular) return popular.href;
  return "/#astrologers";
}

function portraitSrc(person?: Astrologer) {
  if (!person) return "";
  return mediaUrl(person.featured_image?.full || person.featured_image?.url) || "";
}

const PAGE_PORTRAITS = [
  "/images/astrologers/page-1.jpg",
  "/images/astrologers/page-2.jpg",
  "/images/astrologers/page-3.jpg",
];

const BILL_MOVE = {
  left: "translate(-118%, -50%) scale(0.78)",
  center: "translate(-50%, -50%) scale(1)",
  right: "translate(18%, -50%) scale(0.78)",
  hidden: "translate(160%, -50%) scale(0.45)",
} as const;

function billSlot(personIndex: number, current: number, total: number): keyof typeof BILL_MOVE {
  const rel = ((personIndex - current) % total + total) % total;
  if (rel === 0) return "center";
  if (rel === 1) return "right";
  if (rel === total - 1) return "left";
  return "hidden";
}

function AstrologerBills({ people, index }: { people: Astrologer[]; index: number }) {
  const fromWp = people.map((person) => portraitSrc(person)).filter(Boolean);
  const list = fromWp.length ? fromWp : PAGE_PORTRAITS;
  const n = list.length;
  const prevSlots = useRef<Record<string, keyof typeof BILL_MOVE>>({});
  if (!n) return null;

  return (
    <div className="relative mx-auto h-[320px] w-full max-w-[520px] overflow-visible sm:h-[360px] lg:h-[400px] lg:max-w-[560px]">
      {list.map((src, personIndex) => {
        const slot = billSlot(personIndex, index % n, n);
        const prev = prevSlots.current[src];
        const wrap = (prev === "left" && slot === "right") || (prev === "right" && slot === "left");
        prevSlots.current[src] = slot;
        const front = slot === "center";
        return (
          <div
            key={src}
            className={`absolute top-1/2 left-1/2 h-[290px] w-[195px] overflow-hidden rounded-[50%] bg-[#2a1c10] shadow-[0_14px_32px_rgba(8,4,0,0.45)] ring-[3px] sm:h-[330px] sm:w-[220px] lg:h-[360px] lg:w-[240px] ${
              front ? "ring-[#e8c56a]" : "ring-[#c4a227]/80"
            } ${slot === "hidden" ? "pointer-events-none opacity-0" : "opacity-100"}`}
            style={{
              transform: BILL_MOVE[slot],
              zIndex: front ? 30 : slot === "hidden" ? 0 : 10,
              transition: wrap
                ? "opacity 0.45s ease"
                : "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease",
            }}
          >
            {src ? (
              <img src={src} alt="" className="h-full w-full object-cover object-top" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-serif text-4xl font-bold text-[#e5c378]">
                ॐ
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Hero({
  astrologers = [],
  services = [],
  phone,
  whatsapp,
}: {
  astrologers?: Astrologer[];
  services?: AstrologyService[];
  phone?: string;
  whatsapp?: string;
}) {
  const { t } = usePrefs();
  const router = useRouter();
  const people = useJuList<Astrologer>("/astrologers", astrologers).filter((person) => person?.title || person?.slug);
  const wpServices = useJuList<AstrologyService>("/services", services);
  const catalog = useMemo(() => allSiteServices(wpServices), [wpServices]);
  const serviceTrack = catalog.length ? [...catalog, ...catalog] : [];
  const [panchang, setPanchang] = useState<PanchangSnapshot>(() => getPanchang(DEFAULT_TIMEZONE));
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const callNumber = usablePhone(phone);
  const chatNumber = usableWhatsapp(whatsapp);

  const goSearch = (event?: FormEvent) => {
    event?.preventDefault();
    router.push(searchHref(query));
  };

  useEffect(() => {
    const refresh = () => setPanchang(getPanchang(visitorTimeZone()));
    refresh();
    const id = window.setInterval(refresh, 30 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((value) => (value + 1) % SLIDES.length), 12000);
    return () => window.clearInterval(id);
  }, [index]);

  return (
    <section data-hero className={`relative z-20 w-full overflow-hidden ${HEADER_PULL}`}>
      <div className={`relative min-h-[60vh] overflow-hidden lg:min-h-[72vh] ${HEADER_PAD}`}>
        {SLIDES.map((item, i) => (
          <img
            key={item.src}
            src={item.src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover object-[70%_center] transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-r from-[#1c1008]/88 via-[#1c1008]/42 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-[#1c1008]/55 to-transparent" />

        <div className="pointer-events-none absolute inset-0 z-[8] flex items-center justify-center">
          <CosmicMandala
            size="md"
            className="opacity-80 drop-shadow-[0_12px_28px_rgba(28,16,8,0.45)] [&_.mandala-gold-emit]:text-[#e5c378]"
          />
        </div>

        <div className={`relative z-20 grid min-h-[60vh] items-center gap-4 py-8 lg:min-h-[72vh] lg:grid-cols-12 lg:py-12 ${SHELL}`}>
          <div className="relative flex items-start gap-4 pr-16 lg:col-span-7 lg:pr-0">
            <div className="mt-3 flex shrink-0 flex-col items-center gap-2" aria-label="Banner slides">
              {SLIDES.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition ${i === index ? "w-2.5 bg-[#e5c378] shadow-[0_0_12px_rgba(229,195,120,0.9)]" : "w-2.5 bg-[#fff8ec]/40 hover:bg-[#fff8ec]/70"}`}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>
            <div>
              <h1 className="max-w-xl font-serif text-[32px] font-medium leading-[1.08] tracking-[-0.03em] text-[#fff8ec] md:text-[44px]">
                {t("hero.headingLead")}{" "}
                <em className="italic text-[#e5c378]">{t("hero.headingAccent")}</em>
              </h1>
              <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-[#f3e6c8] md:text-[15px]">
                {t("hero.subhead")}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={whatsappUrl(chatNumber, "Namaste. I would like to chat with an astrologer at JyothishiUncle.")}
                  target="_blank"
                  rel="noreferrer"
                  className={ctaPrimary}
                >
                  {t("hero.chat")}
                </a>
                <a href={telHref(callNumber)} className={ctaGhost}>
                  {t("hero.call")}
                </a>
                <BookConsultationButton className={ctaGhost}>{t("hero.video")}</BookConsultationButton>
              </div>
              <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f3e6c8]/85">
                <span>{t("hero.trustVerified")}</span>
                <span aria-hidden className="text-[#e5c378]">|</span>
                <span>{t("hero.trustPrivate")}</span>
                <span aria-hidden className="text-[#e5c378]">|</span>
                <span>{t("hero.trustLanguages")}</span>
              </p>

              <div className="mt-5 max-w-xl rounded-2xl border border-[#f3e6c8]/25 bg-[#fff8ec]/95 p-4 text-[#1A1106] shadow-[0_12px_28px_rgba(8,4,0,0.28)]">
                <p className="text-[13px] font-bold">{t("hero.searchLabel")}</p>
                <form className="mt-2 flex flex-col gap-2 sm:flex-row" onSubmit={goSearch}>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t("hero.searchPlaceholder")}
                    className="min-w-0 flex-1 rounded-full border border-[#e5c378]/50 bg-white px-4 py-2.5 text-sm text-[#1A1106] outline-none placeholder:text-[#1A1106]/45 focus:border-[#e5c378]"
                  />
                  <button type="submit" className={`${ctaPrimary} sm:shrink-0`}>
                    {t("hero.searchSubmit")}
                  </button>
                </form>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A1106]/55">{t("hero.popular")}</span>
                  {POPULAR.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="rounded-full border border-[#e5c378]/45 bg-white px-2.5 py-1 text-[12px] font-semibold text-[#1A1106] transition hover:bg-[#e5c378]/25"
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  [t("hero.nakshatra"), panchang.nakshatraLabel],
                  [t("hero.tithi"), panchang.tithiLabel],
                  [t("hero.zone"), panchang.zoneLabel],
                  [t("hero.guidance"), t("hero.worldwide")],
                ].map(([label, value]) => (
                  <div key={label} className="twinkle rounded-xl border border-[#f3e6c8]/20 bg-[#1c1008]/45 px-3 py-2.5 text-center backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e5c378]">{label}</p>
                    <p className="mt-0.5 text-sm font-bold leading-snug text-[#fff8ec]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid max-w-xl grid-cols-3 divide-x divide-[#f3e6c8]/20 rounded-xl border border-[#f3e6c8]/20 bg-[#1c1008]/45 py-3 backdrop-blur-sm">
                {[
                  ["10+", t("stat.languages")],
                  ["500+", t("stat.years")],
                  ["50,000+", t("stat.clients")],
                ].map(([stat, label]) => (
                  <div key={label} className="px-2 text-center">
                    <p className="font-serif text-xl font-bold tracking-tight text-[#e5c378] md:text-2xl">{stat}</p>
                    <p className="mt-0.5 text-[10px] font-medium leading-snug text-[#f3e6c8]/90 md:text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-[12] flex flex-col items-center lg:col-span-5">
            <AstrologerBills people={people} index={index} />
            <div className="relative z-20 mt-3 flex justify-center lg:mt-4">
              <OnlineNow astrologers={people} />
            </div>
          </div>
        </div>
      </div>

      {serviceTrack.length ? (
        <div className="hero-strip-mask relative z-10 overflow-hidden bg-[#1c1008]">
          <div className="hero-strip-marquee flex w-max">
            {serviceTrack.map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href={item.href}
                className="flex w-[72vw] shrink-0 flex-col items-center justify-center border-r border-[#f3e6c8]/15 px-4 py-3.5 text-center sm:w-[40vw] lg:w-[33.333vw] hover:bg-white/5"
              >
                <p className="font-serif text-xl font-bold text-[#e5c378] md:text-2xl">{item.short}</p>
                <p className="text-[10px] font-semibold tracking-wide text-[#f3e6c8]/85">{item.hint}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
