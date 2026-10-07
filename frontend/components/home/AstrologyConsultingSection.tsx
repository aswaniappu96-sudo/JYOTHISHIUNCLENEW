"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { guidanceTopicHref, type GuidanceTopicId } from "@/lib/astrologer-display";
import { SECTION_INNER } from "@/lib/layout";
import type { MsgKey } from "@/lib/i18n";

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#C4A227]" fill="currentColor" aria-hidden>
      <path d="M12 1.6 13.7 9 21 12l-7.3 3L12 22.4 10.3 15 3 12l7.3-3L12 1.6Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 3.6 19 6.4v5.4c0 4.2-2.9 7-7 8.8-4.1-1.8-7-4.6-7-8.8V6.4L12 3.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9.1 12.1 2 2 3.8-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect x="3.4" y="6.4" width="12.4" height="11.2" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m16.4 10.2 4.2-2.2v8.2l-4.2-2.2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect x="5" y="10.5" width="14" height="9.2" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.2 10.5V8.2a3.8 3.8 0 0 1 7.6 0v2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.8V12l3.2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HeartsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="M8.2 5.6c-1.8 0-3.2 1.5-3.2 3.3 0 3.4 4.6 6.5 7 7.9 2.4-1.4 7-4.5 7-7.9 0-1.8-1.4-3.3-3.2-3.3-1.1 0-2.1.5-2.8 1.4-.7-.9-1.7-1.4-2.8-1.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.4 12.2c.4 1.6 1.6 2.8 3.2 3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function RingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="9.2" cy="13.2" r="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14.8" cy="13.2" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.2 5.6 11 8.2M14.8 5.6 13 8.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <rect x="3.6" y="8.2" width="16.8" height="11.2" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8.2V6.6A1.8 1.8 0 0 1 10.8 4.8h2.4A1.8 1.8 0 0 1 15 6.6v1.6M3.6 13.2h16.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <ellipse cx="10" cy="8.4" rx="6" ry="3.1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 8.4v4.4c0 1.7 2.7 3.1 6 3.1s6-1.4 6-3.1V8.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.2 10.4c1.9.5 3.8 1.6 3.8 3.2 0 1.7-2.4 3-5.4 3.1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="M4.4 11.2 12 4.8l7.6 6.4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.6 10.4V19h10.8v-8.6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 19v-5h4v5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m9.2 14.8 1.6-5.6L16.6 9l-1.6 5.6L9.2 14.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function TarotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <rect x="6.4" y="3.8" width="9.4" height="14.6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8.4" y="5.8" width="9.4" height="14.6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.1 10.2 14.6 13l-2.9.4 2.2 2.2-.5-2.9" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function NumbersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 4.2v2.4M12 17.4v2.4M4.2 12h2.4M17.4 12h2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  );
}

function LotusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="M12 19c-3.4-1.6-5.8-4.2-6.6-7.6 2.2.2 4.2 1.4 6.6 3.6 2.4-2.2 4.4-3.4 6.6-3.6-.8 3.4-3.2 6-6.6 7.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 14.6C10 10.4 9.2 7.2 12 4.8c2.8 2.4 2 5.6 0 9.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5.4 11.2c1.8-2.8 4.2-3.8 6.6-2.6M18.6 11.2c-1.8-2.8-4.2-3.8-6.6-2.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GuidanceArt() {
  return (
    <div className="relative mx-auto h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] lg:mx-0 lg:h-[380px] lg:w-[380px]">
      <div className="ju-sand-ripple pointer-events-none absolute left-1/2 top-1/2 h-full w-full rounded-full border border-[#E9C686]" />
      <div className="ju-sand-ripple ju-sand-ripple-delay pointer-events-none absolute left-1/2 top-1/2 h-full w-full rounded-full border border-[#E9C686]" />
      <div className="ju-sand-shadow pointer-events-none absolute bottom-[-10px] left-1/2 z-[1] h-[18px] w-[60%] rounded-full bg-[radial-gradient(ellipse,rgba(61,44,30,0.25)_0%,transparent_70%)] blur-[4px]" />
      <div className="ju-sand-float relative z-[2] h-full w-full overflow-hidden rounded-full border-2 border-[#E9C686] shadow-[0_20px_60px_rgba(61,44,30,0.15),0_0_0_8px_rgba(255,251,240,0.8),0_0_40px_rgba(233,198,134,0.4)]">
        <img src="/images/about-portrait.jpg" alt="" className="h-full w-full object-cover object-[center_18%]" />
      </div>
    </div>
  );
}

type Topic = {
  id: GuidanceTopicId;
  title: MsgKey;
  hint: MsgKey;
  well: string;
  wash: string;
  icon: () => ReactNode;
};

const TOPICS: Topic[] = [
  { id: "love", title: "consult.love", hint: "consult.loveHint", well: "bg-[#FDECEC] text-[#C45C5C]", wash: "text-[#E8B4B4]", icon: HeartsIcon },
  { id: "marriage", title: "consult.marriage", hint: "consult.marriageHint", well: "bg-[#FBF0D4] text-[#B8872A]", wash: "text-[#E8D4A0]", icon: RingsIcon },
  { id: "career", title: "consult.career", hint: "consult.careerHint", well: "bg-[#F3E9FB] text-[#8B5EAB]", wash: "text-[#D4B8E8]", icon: BriefcaseIcon },
  { id: "business", title: "consult.business", hint: "consult.businessHint", well: "bg-[#FBF0D9] text-[#9A6F3A]", wash: "text-[#EAD9B0]", icon: CoinsIcon },
  { id: "family", title: "consult.family", hint: "consult.familyHint", well: "bg-[#EAF2FB] text-[#4A7AA8]", wash: "text-[#B8CDE0]", icon: HomeIcon },
  { id: "vastu", title: "consult.vastu", hint: "consult.vastuHint", well: "bg-[#F8EDE0] text-[#C47A3A]", wash: "text-[#E8C9A8]", icon: CompassIcon },
  { id: "tarot", title: "consult.tarot", hint: "consult.tarotHint", well: "bg-[#F4EEE8] text-[#8B6A4A]", wash: "text-[#DCC8B0]", icon: TarotIcon },
  { id: "numerology", title: "consult.numerology", hint: "consult.numerologyHint", well: "bg-[#EEE8F8] text-[#6B5B9A]", wash: "text-[#C8BCD8]", icon: NumbersIcon },
  { id: "remedies", title: "consult.remedies", hint: "consult.remediesHint", well: "bg-[#F8EFE4] text-[#B07A3A]", wash: "text-[#E4C8A0]", icon: LotusIcon },
];

const TRUST = [
  { key: "consult.trustVerified" as const, icon: ShieldIcon },
  { key: "consult.trustLive" as const, icon: VideoIcon },
  { key: "consult.trustPrivate" as const, icon: LockIcon },
  { key: "consult.trustQuick" as const, icon: ClockIcon },
];

export function AstrologyConsultingSection() {
  const { t } = usePrefs();

  return (
    <section id="all-services" className="relative w-full overflow-hidden scroll-mt-36 py-10 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute -top-32 -left-28 h-[620px] w-[620px] rounded-full bg-[#e5c378]/18 blur-[120px]" />
      <div className="pointer-events-none absolute top-[18%] -right-36 h-[520px] w-[520px] rounded-full bg-[#e5c378]/12 blur-[110px]" />

      <div className={SECTION_INNER}>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-white/85 px-3 py-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C4A227] opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A07838]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A1106]/70">{t("consult.badgeLive")}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD9B0] bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A1106]/70 shadow-sm">
                <span className="text-[#C4A227]">✦</span>
                {t("consult.badgeVerified")}
              </span>
            </div>

            <div className="mt-5 flex items-start gap-3">
              <Sparkle />
              <PageHeading lead={t("consult.lead")} accent={t("consult.accent")} />
            </div>
            <p className="mt-4 max-w-[560px] text-[15px] leading-[1.6] text-[#1A1106]/70 sm:text-[16px]">{t("consult.copy")}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              {TRUST.map((item) => {
                const Icon = item.icon;
                return (
                  <span key={item.key} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#1A1106]/72">
                    <span className="text-[#9A6F3A]">
                      <Icon />
                    </span>
                    {t(item.key)}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative flex flex-col items-center lg:items-end xl:pr-[148px]">
            <GuidanceArt />
            <p className="mt-3 max-w-[220px] text-center font-serif text-[15px] italic leading-snug text-[#9A6F3A] xl:absolute xl:right-0 xl:top-[18%] xl:mt-0 xl:max-w-[148px] xl:text-right">
              {t("consult.quote")}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 xl:grid-cols-5">
          {TOPICS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={guidanceTopicHref(item.id)}
                className="group relative flex min-h-[214px] flex-col overflow-hidden rounded-[22px] border border-[#EFE3C8] bg-white p-4 shadow-[0_10px_28px_-20px_rgba(26,17,6,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-18px_rgba(154,90,18,0.28)]"
              >
                <span className={`pointer-events-none absolute -right-2 -top-3 opacity-[0.18] ${item.wash}`} aria-hidden>
                  <span className="block scale-[2.15]">
                    <Icon />
                  </span>
                </span>
                <div className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${item.well}`}>
                  <Icon />
                </div>
                <h3 className="relative mt-4 font-serif text-[17px] leading-snug tracking-[-0.01em] text-[#1A1106]">
                  {t(item.title)}
                </h3>
                <p className="relative mt-1.5 line-clamp-3 flex-1 text-[12.5px] leading-snug text-[#1A1106]/58">{t(item.hint)}</p>
                <span className="relative mt-4 flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-[#1A1106]">{t("consult.book")}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A07838] text-white transition group-hover:bg-[#8C682E]">
                    <ArrowGlyph />
                  </span>
                </span>
              </Link>
            );
          })}

          <Link
            href="/#join"
            className="group relative flex min-h-[214px] flex-col overflow-hidden rounded-[22px] bg-linear-to-br from-[#3A2A14] via-[#2A1C0C] to-[#1A1106] p-5 text-[#FFF8EC] shadow-[0_14px_32px_-18px_rgba(26,17,6,0.5)] transition duration-300 hover:-translate-y-1"
          >
            <span className="pointer-events-none absolute -right-8 -bottom-10 h-36 w-36 rounded-full bg-[#C4A227]/20 blur-2xl" />
            <span className="text-[#E8C88A]">✦</span>
            <h3 className="relative mt-3 font-serif text-[22px] leading-tight">{t("consult.ctaTitle")}</h3>
            <p className="relative mt-2 flex-1 text-[13px] leading-snug text-[#FFF8EC]/72">{t("consult.ctaCopy")}</p>
            <span className="relative mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#E8C88A]">
              {t("join.cta")}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A07838] text-white transition group-hover:bg-[#8C682E]">
                <ArrowGlyph />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
