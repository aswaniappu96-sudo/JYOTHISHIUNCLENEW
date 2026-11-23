"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { CosmicMandala } from "@/components/home/CosmicMandala";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { DEFAULT_TIMEZONE, getPanchang, visitorTimeZone, type PanchangSnapshot } from "@/lib/panchang";
import { telHref } from "@/lib/html";
import { mediaUrl } from "@/lib/api/client";
import { astrologerPhoto } from "@/lib/catalogImages";
import { HEADER_PULL, SHELL } from "@/lib/layout";
import { allSiteServices } from "@/lib/siteServices";
import { PRODUCTS_PATH } from "@/lib/siteRoutes";
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
    position: "object-[70%_center]",
    kicker: "hero.kicker1",
    title: "hero.title1",
    copy: "hero.copy1",
  },
  {
    src: "/images/hero/banner-homam.jpg",
    position: "object-center",
    kicker: "hero.kicker2",
    title: "hero.title2",
    copy: "hero.copy2",
  },
  {
    src: "/images/hero/banner-yatra.jpg",
    position: "object-[68%_center]",
    kicker: "hero.kicker3",
    title: "hero.title3",
    copy: "hero.copy3",
  },
] as const;

const TRUST_POINTS = ["hero.trustOne", "hero.trustMoola", "hero.trustReach"] as const;

const ctaPrimary =
  "inline-flex items-center justify-center rounded-full bg-primary-container px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary shadow-[0_10px_28px_rgba(201,162,39,0.4)] transition hover:brightness-95";
const ctaGhost =
  "inline-flex items-center justify-center rounded-full border border-[#f3e6c8]/40 bg-[#1c1008]/40 px-5 py-2.5 text-sm font-semibold text-[#fff8ec] backdrop-blur-md transition hover:bg-[#1c1008]/65";

function ChatGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H11l-4 3.2V16H7.5A2.5 2.5 0 0 1 5 13.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CallGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M7.2 4.8c.4-.4 1.1-.5 1.6-.2l2.2 1.3c.5.3.7.9.5 1.4L10.8 9.8a11.2 11.2 0 0 0 3.4 3.4l2.5-.7c.5-.2 1.1 0 1.4.5l1.3 2.2c.3.5.2 1.2-.2 1.6l-1.1 1.1c-.5.5-1.2.7-1.9.5-3.3-.9-6.3-3.2-8.6-5.5S3.3 8.3 2.4 5c-.2-.7 0-1.4.5-1.9L4 2.9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VideoGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="3" y="7" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 11.2 20 8.5v7l-5-2.7v-1.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const iconCta =
  "flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-[0_10px_28px_rgba(201,162,39,0.4)] transition hover:brightness-95";
const iconCtaGhost =
  "flex h-12 w-12 items-center justify-center rounded-full border border-[#f3e6c8]/40 bg-[#1c1008]/40 text-[#fff8ec] backdrop-blur-md transition hover:bg-[#1c1008]/65";

const PAGE_PORTRAITS = [
  "/images/astrologers/page-1.jpg",
  "/images/astrologers/page-2.jpg",
  "/images/astrologers/page-3.jpg",
];

function portraitSrc(person?: Astrologer) {
  if (!person) return "";
  return astrologerPhoto(person.slug, mediaUrl(person.featured_image?.full || person.featured_image?.url) || "");
}

function bannerAstroPortraits(
  cms: Array<{ url?: string | null; full?: string | null } | null> | undefined,
  people: Astrologer[],
) {
  const cmsUrls = (cms || []).slice(0, 4).map((img) => mediaUrl(img?.full || img?.url) || "");
  const ranked = [
    ...people.filter((person) => person.show_on_homepage),
    ...people.filter((person) => !person.show_on_homepage),
  ];
  const peopleUrls = ranked.map((person) => portraitSrc(person)).filter(Boolean);
  const list: string[] = [];
  let next = 0;
  for (let i = 0; i < 4; i++) {
    if (cmsUrls[i]) {
      list.push(cmsUrls[i]);
      continue;
    }
    if (peopleUrls[next]) {
      list.push(peopleUrls[next]);
      next += 1;
    }
  }
  return list.length ? list : PAGE_PORTRAITS.slice(0, 4);
}

function AstrologerBills({ portraits, index }: { portraits: string[]; index: number }) {
  const list = portraits.slice(0, 4);
  const n = list.length;
  if (!n) return null;
  const active = index % n;

  return (
    <div className="relative mx-auto h-[270px] w-full max-w-[220px] sm:h-[300px] lg:h-[330px] lg:max-w-[240px]">
      {list.map((src, personIndex) => {
        const front = personIndex === active;
        return (
          <div
            key={`${src}-${personIndex}`}
            className={`absolute top-1/2 left-1/2 h-[240px] w-[160px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[50%] bg-[#2a1c10] shadow-[0_14px_32px_rgba(8,4,0,0.45)] ring-[3px] ring-[#e8c56a] transition-opacity duration-700 sm:h-[270px] sm:w-[180px] lg:h-[300px] lg:w-[200px] ${
              front ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
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
  slides: slideImages,
  astroSlides,
}: {
  astrologers?: Astrologer[];
  services?: AstrologyService[];
  phone?: string;
  whatsapp?: string;
  slides?: Array<{ url?: string | null; full?: string | null } | null>;
  astroSlides?: Array<{ url?: string | null; full?: string | null } | null>;
}) {
  const { t } = usePrefs();
  const people = useJuList<Astrologer>("/astrologers", astrologers).filter((person) => person?.title || person?.slug);
  const astroPortraits = useMemo(() => bannerAstroPortraits(astroSlides, people), [astroSlides, people]);
  const wpServices = useJuList<AstrologyService>("/services", services);
  const catalog = useMemo(() => allSiteServices(wpServices), [wpServices]);
  const serviceTrack = catalog.length ? [...catalog, ...catalog] : [];
  const [panchang, setPanchang] = useState<PanchangSnapshot>(() => getPanchang(DEFAULT_TIMEZONE));
  const [index, setIndex] = useState(0);
  const [astroIndex, setAstroIndex] = useState(0);
  const slides = SLIDES.map((item, i) => ({
    ...item,
    src: slideImages?.[i]?.full || slideImages?.[i]?.url || item.src,
  }));
  const slide = slides[index];
  const consultSlide = index === 0;
  const ritualSlide = index === 1;
  const yatraSlide = index === 2;
  const callNumber = usablePhone(phone);
  const chatNumber = usableWhatsapp(whatsapp);
  const chatHref = whatsappUrl(
    chatNumber,
    yatraSlide
      ? "Namaste. I would like yatra details from MaharshiOm."
      : ritualSlide
        ? "Namaste. I would like to book a pooja or homam at MaharshiOm."
        : "Namaste. I would like to chat with an astrologer at MaharshiOm.",
  );
  const callHref = telHref(callNumber);

  useEffect(() => {
    const refresh = () => setPanchang(getPanchang(visitorTimeZone()));
    refresh();
    const id = window.setInterval(refresh, 30 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((value) => (value + 1) % slides.length), 12000);
    return () => window.clearInterval(id);
  }, [index]);

  useEffect(() => {
    if (astroPortraits.length < 2) return;
    const id = window.setInterval(
      () => setAstroIndex((value) => (value + 1) % astroPortraits.length),
      5000,
    );
    return () => window.clearInterval(id);
  }, [astroPortraits.length]);

  return (
    <section data-hero className={`relative z-20 flex min-h-dvh w-full flex-col overflow-hidden ${HEADER_PULL}`}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden pt-28 pb-10 md:pt-32 md:pb-14">
        {slides.map((item, i) => (
          <img
            key={SLIDES[i].src}
            src={item.src}
            alt=""
            onError={(event) => {
              const img = event.currentTarget;
              if (img.dataset.fallback === "1") return;
              img.dataset.fallback = "1";
              img.src = SLIDES[i].src;
            }}
            className={`absolute inset-0 h-full w-full object-cover ${item.position} transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-r from-[#1c1008]/88 via-[#1c1008]/42 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-[#1c1008]/55 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[8] hidden items-center justify-center lg:flex">
          <CosmicMandala
            size="md"
            className="opacity-80 drop-shadow-[0_12px_28px_rgba(28,16,8,0.45)] [&_.mandala-gold-emit]:text-[#e5c378]"
          />
        </div>

        <div className={`relative z-20 flex min-h-0 flex-1 flex-col justify-start gap-2 pb-2 pt-1 lg:grid lg:grid-cols-12 lg:items-center lg:gap-4 lg:py-12 ${SHELL}`}>
          <div className="relative flex items-start gap-3 pr-16 lg:col-span-7 lg:pr-0">
            <div className="mt-2 flex shrink-0 flex-col items-center gap-2 lg:mt-3" aria-label="Banner slides">
              {slides.map((item, i) => (
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
            <div key={index}>
              <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#e5c378] sm:text-[11px] sm:tracking-[0.14em]">
                <span aria-hidden>◆ </span>
                {t(slide.kicker)}
              </p>
              <h1 className="mt-2 max-w-3xl font-serif text-[30px] font-bold not-italic leading-[1.08] tracking-[-0.03em] text-[#fff8ec] sm:text-[36px] md:text-[48px] lg:text-[54px]">
                {t(slide.title)}
              </h1>
              <p className="mt-3 max-w-2xl text-[16px] font-medium not-italic leading-relaxed text-[#f3e6c8] sm:mt-4 md:text-[18px]">
                {t(slide.copy)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-5 md:hidden">
                <a href={chatHref} target="_blank" rel="noreferrer" className={iconCta} aria-label={t("hero.chat")}>
                  <ChatGlyph />
                </a>
                <a href={callHref} className={iconCtaGhost} aria-label={t("hero.call")}>
                  <CallGlyph />
                </a>
                <a href="/#consultation-services" className={iconCtaGhost} aria-label={t("hero.video")}>
                  <VideoGlyph />
                </a>
              </div>
              <div className="mt-5 hidden flex-wrap gap-2 md:flex">
                <a href={chatHref} target="_blank" rel="noreferrer" className={ctaPrimary}>
                  {consultSlide ? t("hero.consultWa") : ritualSlide ? t("hero.bookPoojaWa") : t("hero.yatraWa")}
                </a>
                {consultSlide ? (
                  <Link href="/astrologers" className={ctaGhost}>
                    {t("hero.acharyas")}
                  </Link>
                ) : ritualSlide ? (
                  <Link href={PRODUCTS_PATH} className={ctaGhost}>
                    {t("hero.remedies")}
                  </Link>
                ) : (
                  <Link href="/religious-travel" className={ctaGhost}>
                    {t("hero.familyYatra")}
                  </Link>
                )}
                <BookConsultationButton className={ctaGhost}>{t("hero.video")}</BookConsultationButton>
              </div>
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3e6c8]/85 sm:mt-4 sm:text-[11px]">
                <span>{consultSlide ? t("hero.trustSessions") : ritualSlide ? t("hero.trustSankalpa") : t("hero.trustPace")}</span>
                <span aria-hidden className="text-[#e5c378]">|</span>
                <span>{consultSlide ? t("hero.trustModes") : ritualSlide ? t("hero.trustStream") : t("hero.trustMeals")}</span>
                <span aria-hidden className="text-[#e5c378]">|</span>
                <span>{consultSlide ? t("hero.trustLangs") : ritualSlide ? t("hero.trustPrasad") : t("hero.trustRituals")}</span>
              </p>

              <p className="mt-5 max-w-xl text-[15px] font-semibold leading-relaxed text-[#fff8ec] md:text-[17px]">
                {t("hero.serviceLine")}
              </p>

              <div className="mt-5 hidden max-w-xl grid-cols-2 gap-2 sm:grid-cols-4 lg:grid">
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

              <div className="mt-4 hidden max-w-2xl grid-cols-3 divide-x divide-[#f3e6c8]/20 rounded-xl border border-[#f3e6c8]/20 bg-[#1c1008]/45 py-3 backdrop-blur-sm lg:grid">
                {TRUST_POINTS.map((key) => (
                  <p key={key} className="px-3 text-center text-[13px] font-semibold leading-snug text-[#fff8ec]">
                    {t(key)}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-[12] flex w-full flex-col items-center justify-start pt-1 lg:col-span-5 lg:justify-center lg:pt-0 lg:pr-12">
            <div className="hidden w-full lg:block">
              <AstrologerBills portraits={astroPortraits} index={astroIndex} />
            </div>
            <div className="relative mx-auto aspect-square w-[min(78vw,20rem)] lg:hidden">
              <CosmicMandala
                size="fill"
                className="opacity-95 drop-shadow-[0_12px_28px_rgba(28,16,8,0.45)] [&_.mandala-gold-emit]:text-[#e5c378]"
              />
            </div>
            <div className="mt-4 w-full space-y-3 lg:hidden">
              <div className="grid grid-cols-2 gap-2">
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
              <div className="grid grid-cols-3 divide-x divide-[#f3e6c8]/20 rounded-xl border border-[#f3e6c8]/20 bg-[#1c1008]/45 py-3 backdrop-blur-sm">
                {TRUST_POINTS.map((key) => (
                  <p key={key} className="px-2 text-center text-[12px] font-semibold leading-snug text-[#fff8ec]">
                    {t(key)}
                  </p>
                ))}
              </div>
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
