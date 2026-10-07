"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { Reveal } from "@/components/ui/Reveal";
import { stripHtml, stripPublicPrices } from "@/lib/html";
import type { MsgKey } from "@/lib/i18n";
import type { WPImage } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

const FALLBACK =
  "JyothishiUncle offers traditional pooja, homam, and astrology consultation. The team is available worldwide and consults devotees anywhere through video consulting.";

function ChipIcon({ kind }: { kind: "time" | "globe" | "pin" }) {
  const common = { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "#8B6A3A", strokeWidth: 1.6 };
  if (kind === "time") {
    return (
      <svg {...common} aria-hidden>
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  if (kind === "globe") {
    return (
      <svg {...common} aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ShieldTrust() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7 3v6c0 4-2.5 7-7 9-4.5-2-7-5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function PersonTrust() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19c1.2-3 4-5 6.5-5s5.3 2 6.5 5" />
    </svg>
  );
}

function LockTrust() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChatTrust() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H14a2.5 2.5 0 0 1 2.5 2.5v4A2.5 2.5 0 0 1 14 13H10l-4 3v-3.5A2.5 2.5 0 0 1 5 10v-3.5z" />
    </svg>
  );
}

function KundliGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16M4 12h16" opacity="0.7" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HeartGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 19s-6-4.2-6-8.2A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 6 3.8C18 14.8 12 19 12 19z" />
    </svg>
  );
}

function BriefGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="7" width="18" height="11" rx="2" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
    </svg>
  );
}

function SunGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4" />
    </svg>
  );
}

function QuestionGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M9.5 9a3.5 3.5 0 0 1 6.5 1.5c0 2.5-3.5 3-3.5 5" />
      <circle cx="12" cy="18" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function HomeGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 11L12 3l9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11z" />
    </svg>
  );
}

function StarGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
    </svg>
  );
}

const TRUST_CARDS = [
  { title: "trust.verified" as const, copy: "trust.verifiedCopy" as const, icon: ShieldTrust },
  { title: "trust.personal" as const, copy: "trust.personalCopy" as const, icon: PersonTrust },
  { title: "trust.private" as const, copy: "trust.privateCopy" as const, icon: LockTrust },
  { title: "trust.connect" as const, copy: "trust.connectCopy" as const, icon: ChatTrust },
];

const POPULAR: { title: MsgKey; copy: MsgKey; href: string; icon: () => ReactNode }[] = [
  { title: "pop.kundli", copy: "pop.kundliCopy", href: "/astrologers", icon: KundliGlyph },
  { title: "pop.marriage", copy: "pop.marriageCopy", href: "/astrologers?topic=marriage", icon: HeartGlyph },
  { title: "pop.business", copy: "pop.businessCopy", href: "/astrologers?topic=business", icon: BriefGlyph },
  { title: "pop.remedies", copy: "pop.remediesCopy", href: "/astrologers?topic=remedies", icon: SunGlyph },
  { title: "pop.prashna", copy: "pop.prashnaCopy", href: "/#consultation", icon: QuestionGlyph },
  { title: "pop.career", copy: "pop.careerCopy", href: "/astrologers?topic=career", icon: CrossGlyph },
  { title: "pop.vastu", copy: "pop.vastuCopy", href: "/astrologers?topic=vastu", icon: HomeGlyph },
  { title: "pop.life", copy: "pop.lifeCopy", href: "/astrologers", icon: StarGlyph },
];

function WhyJyothishiUncle() {
  const { t } = usePrefs();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  return (
    <div id="why" className="relative mt-14 scroll-mt-36 pt-10">
      <div className="h-px w-full bg-gradient-to-r from-[#EAD9B0]/0 via-[#EAD9B0] to-[#EAD9B0]/0" />

      <div className="mt-10 md:mt-14">
        <div className="max-w-[760px]">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-[#E9C07A]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9C8360]">{t("trust.kicker")}</span>
          </div>
          <PageHeading lead={t("trust.lead")} accent={t("trust.accent")} />
          <p className="mt-5 max-w-[520px] text-[15.5px] leading-[1.85] text-[#6E6256]">{t("trust.copy")}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {TRUST_CARDS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative flex items-start gap-3 rounded-[18px] border border-[#EAD9B0] bg-white/80 px-4 py-3.5 shadow-[0_8px_24px_-16px_rgba(61,44,30,0.18),0_1px_0_0_rgba(245,230,200,0.8)_inset] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_16px_36px_-18px_rgba(61,44,30,0.22)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FBF0D9] text-[#8B6A3A] shadow-[0_1px_0_0_white_inset]">
                  <Icon />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-[13.5px] font-semibold leading-[1.4] text-[#1E160E]">{t(item.title)}</h3>
                  <p className="mt-0.5 text-[12.5px] leading-[1.6] text-[#8B7E6E]">{t(item.copy)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 h-px w-full bg-gradient-to-r from-[#EAD9B0]/0 via-[#EAD9B0] to-[#EAD9B0]/0 md:mt-16" />

      <div className="mt-10 grid grid-cols-1 items-start gap-10 md:mt-14 lg:grid-cols-[1.22fr_0.88fr] lg:gap-12">
        <div>
          <div className="mb-7 flex items-center gap-3 md:mb-8">
            <span className="inline-block h-px w-8 bg-[#E9C07A]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9C8360]">{t("pop.kicker")}</span>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:gap-y-7 lg:pr-8">
            {POPULAR.map((item) => {
              const Icon = item.icon;
              const title = t(item.title);
              const active = open === item.title;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    if (active) router.push(item.href);
                    else setOpen(item.title);
                  }}
                  className={`group flex items-start gap-3 rounded-[14px] p-2 text-left transition-all duration-200 ${
                    active
                      ? "border border-[#EAD9B0] bg-white shadow-[0_6px_20px_-14px_rgba(61,44,30,0.25)]"
                      : "border border-transparent hover:bg-white/60"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      active ? "border-[#1E160E] bg-[#1E160E] text-[#FBF0D9]" : "border-[#EAD9B0] bg-[#FBF0D9] text-[#8B6A3A] group-hover:bg-white"
                    }`}
                  >
                    <Icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-[13.5px] font-semibold leading-[1.4] text-[#1E160E]">{title}</span>
                    <span className="mt-0.5 block text-[12.5px] leading-[1.6] text-[#8B7E6E]">{t(item.copy)}</span>
                    {active ? (
                      <span className="mt-2 block rounded-lg border border-[#EAD9B0] bg-[#FFF8EC] px-2.5 py-2 text-[12.5px] leading-[1.6] text-[#6E6256]">
                        {t("pop.expand")}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={`mt-1.5 flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                      active ? "border-[#1E160E] bg-[#1E160E] text-white" : "border-[#EAD9B0] text-[#C9A86A] group-hover:border-[#E9C07A]"
                    }`}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={active ? "rotate-180 transition-transform" : "transition-transform"} aria-hidden>
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-8 flex items-center gap-2 text-[12.5px] text-[#8B7E6E] md:mt-10">
            <span className="h-px w-6 bg-[#EAD9B0]" />
            {t("how.privateNote")}
          </p>
        </div>

        <div className="relative lg:-mt-1">
          <div className="relative overflow-hidden rounded-[24px] border border-[#EAD9B0] bg-white shadow-[0_20px_50px_-24px_rgba(61,44,30,0.22),0_1px_0_0_white_inset]">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E9C07A]/60 to-transparent" />
            <div className="absolute right-0 top-0 h-[220px] w-[220px] rounded-full opacity-60 blur-[42px]" style={{ background: "radial-gradient(circle, rgba(232,223,245,0.45) 0%, transparent 70%)" }} />
            <div className="relative p-7 md:p-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-[#E9C07A]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9C8360]">{t("how.kicker")}</span>
              </div>
              <h3 className="font-serif text-[22px] font-medium leading-[1.15] tracking-[-0.03em] text-[#1A1106] sm:text-[28px]">
                {t("how.lead")} <span className="italic text-[#9A6F3A]">{t("how.accent")}</span>
              </h3>

              <ol className="relative mt-8 space-y-6">
                {(
                  [
                    { n: "01", t: "how.step1" as const, d: "how.step1Copy" as const },
                    { n: "02", t: "how.step2" as const, d: "how.step2Copy" as const },
                    { n: "03", t: "how.step3" as const, d: "how.step3Copy" as const },
                  ] as const
                ).map((step, index) => (
                  <li key={step.n} className="flex gap-4">
                    <div className="relative shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FBF0D9] font-serif text-[13px] font-medium text-[#8B6A3A]">
                        {step.n}
                      </div>
                      {index !== 2 ? <div className="mx-auto mt-2 h-6 w-px bg-[#EAD9B0]" /> : null}
                    </div>
                    <div className="min-w-0 pt-1">
                      <h4 className="text-[14px] font-semibold leading-[1.4] text-[#1E160E]">{t(step.t)}</h4>
                      <p className="mt-0.5 text-[12.5px] leading-[1.6] text-[#8B7E6E]">{t(step.d)}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setToast(t("how.toast"));
                    window.setTimeout(() => router.push("/astrologers"), 400);
                  }}
                  className="inline-flex h-[48px] w-full items-center justify-center rounded-full bg-[#E9C07A] px-7 text-[14px] font-semibold tracking-[0.01em] text-[#1E160E] shadow-[0_4px_14px_rgba(233,192,122,0.35)] transition-colors hover:bg-[#E0B46D] md:w-auto"
                >
                  {t("how.cta")}
                  <span className="ml-2" aria-hidden>
                    →
                  </span>
                </button>
                <div className="mt-4 flex items-center gap-2.5 text-[12.5px] text-[#8B7E6E]">
                  <div className="flex -space-x-1.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#EAD9B0] font-serif text-[13px] text-[#5C4A32]">J</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#FBF0D9] font-serif text-[13px] text-[#5C4A32]">U</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#EAD9B0] bg-white text-[12px]">📿</span>
                  </div>
                  <span>{t("how.seekers")}</span>
                </div>
              </div>
            </div>
            <div className="flex h-12 items-center justify-between border-t border-[#FBF0D9] bg-[#1E160E] px-6">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E9C07A]" />
                <span className="text-[11px] tracking-[0.08em] text-[#EAD9B0]">{t("how.liveLine")}</span>
              </div>
              <span className="text-[11px] text-[#9C8360]">{t("how.response")}</span>
            </div>
          </div>

          <div className="absolute -left-6 top-[42%] hidden -rotate-3 items-center gap-2.5 rounded-[14px] border border-[#EAD9B0] bg-white px-3.5 py-2.5 shadow-[0_10px_30px_-14px_rgba(61,44,30,0.3)] lg:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E160E] text-[12px] text-[#E9C686]">✦</span>
            <div>
              <p className="text-[11px] font-semibold leading-[1.1] text-[#1E160E]">{t("how.vedic")}</p>
              <p className="text-[10px] text-[#7A6A5A]">{t("about.parampara")}</p>
            </div>
          </div>
        </div>
      </div>

      {toast ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-[#3D2C1E] px-5 py-2.5 text-[13px] font-medium text-[#FFF9F0] shadow-[0_12px_30px_-10px_rgba(61,44,30,0.6)]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E9C686] text-[11px] text-[#3D2C1E]">✦</span>
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AboutTeaser({ excerpt, image: _image }: { excerpt?: string; image?: WPImage }) {
  const { t, copy } = usePrefs();
  const fromCms = stripPublicPrices(stripHtml(copy("about_excerpt", excerpt || ""))).trim();
  const lead = fromCms || FALLBACK;

  const chips = [
    { icon: "time" as const, label: t("about.statYears") },
    { icon: "globe" as const, label: t("about.statOnline") },
    { icon: "pin" as const, label: t("about.statOffline") },
  ];

  const tiles = [
    { emoji: "📜", title: t("about.tileKundli"), sub: t("about.tileKundliSub") },
    { emoji: "🔥", title: t("about.tilePooja"), sub: t("about.tilePoojaSub") },
    { emoji: "🛕", title: t("about.tileYatra"), sub: t("about.tileYatraSub") },
  ];

  return (
    <section id="about" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <svg className="absolute -left-[180px] top-[80px] h-[720px] w-[720px] text-[#8B6A3A] opacity-[0.04]" viewBox="0 0 400 400" fill="none">
          <g stroke="currentColor" strokeWidth="0.6">
            {Array.from({ length: 24 }).map((_, n) => (
              <circle key={n} cx="200" cy="200" r={20 + n * 14} opacity={0.6 - n * 0.02} />
            ))}
            {Array.from({ length: 12 }).map((_, n) => {
              const a = (n * 30 * Math.PI) / 180;
              return (
                <line
                  key={`l-${n}`}
                  x1={(200 + Math.cos(a) * 20).toFixed(4)}
                  y1={(200 + Math.sin(a) * 20).toFixed(4)}
                  x2={(200 + Math.cos(a) * 320).toFixed(4)}
                  y2={(200 + Math.sin(a) * 320).toFixed(4)}
                />
              );
            })}
          </g>
        </svg>
        <div className="absolute right-[8%] top-[60px] select-none font-serif text-[120px] leading-none text-[#C9A86A] opacity-[0.08]">
          ॐ
        </div>
        <div className="absolute bottom-[40px] left-[46%] select-none font-serif text-[90px] leading-none text-[#C9A86A] opacity-[0.06]">
          ॐ
        </div>
        <div className="absolute -right-[200px] top-[-80px] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#FFE9B8] to-[#FFDDA1] opacity-[0.35] blur-[40px]" />
      </div>

      <Reveal className={INNER}>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 xl:gap-16">
          <div className="relative max-w-[600px]">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-[#E9C07A]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9C8360]">{t("about.kicker")}</span>
            </div>

            <PageHeading lead={t("about.lead")} accent={t("about.accent")} rest={t("about.rest")} />

            <div className="mt-8 space-y-5 text-[15.5px] leading-[1.85] text-[#6E6256]">
              <p>{lead}</p>
              <p className="text-[15px]">{t("about.body")}</p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              {chips.map((chip, index) => (
                <div key={chip.label} className="flex items-center gap-2.5">
                  {index > 0 ? <span className="hidden h-1 w-1 rounded-full bg-[#D8C39A] sm:inline-block" /> : null}
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-[#FBF0D9] px-4 py-2 text-[13px] font-medium text-[#5C4A32] shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#EAD9B0] bg-white">
                      <ChipIcon kind={chip.icon} />
                    </span>
                    {chip.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#E9C07A] px-7 text-[14px] font-semibold tracking-[0.01em] text-[#1E160E] shadow-[0_4px_14px_rgba(233,192,122,0.35)] transition-colors hover:bg-[#E0B46D]"
              >
                {t("about.read")}
                <span className="ml-2 inline-flex" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#EAD9B0] font-serif text-[13px] text-[#5C4A32]">
                  J
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#FBF0D9] font-serif text-[13px] text-[#5C4A32]">
                  U
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#EAD9B0] bg-white text-[12px]">
                  📿
                </div>
              </div>
              <p className="text-[12.5px] leading-[1.5] text-[#8B7E6E]">
                {t("about.trusted")}
                <br />
                <span className="font-medium text-[#1E160E]">{t("about.values")}</span>
              </p>
            </div>
          </div>

          <div className="relative lg:pl-6">
            <div className="relative overflow-hidden rounded-[24px] border border-[#EAD9B0] bg-white shadow-[0_20px_60px_rgba(94,72,36,0.08),0_2px_0_0_#fff_inset]">
              <div className="flex h-[56px] items-center justify-between border-b border-[#FBF0D9] bg-[#FFFBF0]/60 px-7">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FBF0D9] font-serif text-[11px] text-[#8B6A3A]">
                    ॐ
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9C8360]">{t("about.parampara")}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E9C07A]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EAD9B0]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FBF0D9]" />
                </div>
              </div>

              <div className="relative bg-gradient-to-b from-[#FFFBF0] to-[#FFF8E9] p-6 sm:p-8">
                <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
                  <svg width="100%" height="100%" viewBox="0 0 400 320" preserveAspectRatio="none">
                    <g stroke="#8B6A3A" strokeWidth="0.5" fill="none">
                      <path d="M200 20 L380 300 L20 300 Z" />
                      <path d="M200 300 L380 20 L20 20 Z" opacity="0.5" />
                      <circle cx="200" cy="160" r="80" />
                      <circle cx="200" cy="160" r="110" />
                    </g>
                  </svg>
                </div>

                <div className="relative mx-auto max-w-[340px]">
                  <div className="relative mx-auto h-[300px] w-[300px]">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFE9B8] to-[#FFD6A0] opacity-60 blur-[1px]" />
                    <div className="absolute inset-[10px] flex items-center justify-center overflow-hidden rounded-full border border-[#F0DFB8] bg-white shadow-[inset_0_1px_0_white]">
                      <div className="relative flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#FFFBF0_0%,#FFF3D8_55%,#FFE9B8_100%)]">
                        <div className="mb-3 text-[#C89B5A] opacity-80" aria-hidden>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2v4M9 6h6M8 10c0-2 2-4 4-4s4 2 4 4c0 2-2 3-4 5-2-2-4-3-4-5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                            <path d="M8 18h8M9 22h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="flex items-end">
                          <div className="flex h-[68px] w-[48px] flex-col items-center rounded-t-full border border-[#D8C39A] bg-gradient-to-b from-[#F5E6C8] to-[#EAD9B0] pt-2">
                            <div className="h-6 w-6 rounded-full bg-[#1E160E]/10" />
                            <div className="mt-1 h-[2px] w-8 bg-[#1E160E]/10" />
                            <div className="mt-3 h-8 w-[36px] rounded-sm bg-white/60" />
                          </div>
                          <div className="relative z-10 -mx-2 flex h-[92px] w-[56px] flex-col items-center rounded-t-full border border-[#E9C07A] bg-gradient-to-b from-[#FFF8E9] to-[#F0DFB8] pt-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8C39A] bg-[#EAD9B0] font-serif text-[14px]">
                              ॐ
                            </div>
                            <div className="mt-2 h-[3px] w-10 rounded-full bg-[#C9A86A]/40" />
                            <div className="mt-1 h-[3px] w-8 rounded-full bg-[#C9A86A]/30" />
                            <div className="mt-4 flex h-[28px] w-[44px] items-center justify-center rounded-[6px] border border-[#EAD9B0] bg-white">
                              <span className="text-[10px] tracking-widest text-[#9C8360]">VEDA</span>
                            </div>
                          </div>
                          <div className="flex h-[68px] w-[48px] flex-col items-center rounded-t-full border border-[#D8C39A] bg-gradient-to-b from-[#F5E6C8] to-[#EAD9B0] pt-2">
                            <div className="h-6 w-6 rounded-full bg-[#1E160E]/10" />
                            <div className="mt-1 h-[2px] w-8 bg-[#1E160E]/10" />
                            <div className="mt-3 h-8 w-[36px] rounded-sm bg-white/60" />
                          </div>
                        </div>
                        <div className="mt-4 flex h-[28px] w-[180px] items-center justify-center gap-1 rounded-[8px] border border-[#C9A86A]/30 bg-gradient-to-r from-[#EAD9B0] to-[#D8C39A] px-2 shadow-sm">
                          <div className="h-[2px] flex-1 rounded-full bg-[#1E160E]/15" />
                          <div className="h-[2px] flex-1 rounded-full bg-[#1E160E]/15" />
                          <div className="h-[2px] flex-1 rounded-full bg-[#1E160E]/15" />
                          <div className="ml-1 h-3 w-3 rounded-full bg-[#1E160E]/20" />
                        </div>
                        <span className="absolute top-6 left-8 h-1 w-1 rounded-full bg-[#E9C07A] opacity-60" />
                        <span className="absolute top-12 right-10 h-1 w-1 rounded-full bg-[#E9C07A] opacity-40" />
                        <span className="absolute bottom-14 left-12 h-1 w-1 rounded-full bg-[#E9C07A] opacity-50" />
                      </div>
                    </div>

                    <div className="absolute -left-2 bottom-8 flex items-center gap-2.5 rounded-full border border-[#EAD9B0] bg-white px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E160E] font-serif text-[13px] font-bold text-[#E9C07A]">
                        {t("about.years")}
                      </div>
                      <div className="leading-[1.1]">
                        <div className="text-[11px] font-bold tracking-[0.02em] text-[#1E160E]">{t("about.yearsOf")}</div>
                        <div className="text-[11px] text-[#6E6256]">{t("about.heritage")}</div>
                      </div>
                    </div>

                    <div className="absolute -right-1 top-14 rounded-[14px] border border-[#EAD9B0] bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9C8360]">{t("about.worldwide")}</div>
                      <div className="grid grid-cols-5 gap-[4px]">
                        {Array.from({ length: 15 }).map((_, n) => (
                          <span key={n} className={`h-[5px] w-[5px] rounded-full ${n % 4 === 0 ? "bg-[#E9C07A]" : "bg-[#F0DFB8]"}`} />
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-[#6E6256]">{t("about.video")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mt-6 grid grid-cols-3 gap-3">
                  {tiles.map((tile) => (
                    <div key={tile.title} className="rounded-[12px] border border-[#F0DFB8] bg-white px-3 py-3">
                      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FFFBF0] text-[13px]">
                        {tile.emoji}
                      </div>
                      <div className="text-[11px] font-semibold leading-tight text-[#1E160E]">{tile.title}</div>
                      <div className="mt-0.5 text-[10px] text-[#8B7E6E]">{tile.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex h-[48px] items-center justify-between bg-[#1E160E] px-6">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E9C07A]" />
                  <span className="text-[11px] tracking-[0.08em] text-[#EAD9B0]">{t("about.live")}</span>
                </div>
                <span className="text-[11px] text-[#9C8360]">{t("about.est")}</span>
              </div>
            </div>

            <div className="pointer-events-none absolute -top-2 -right-6 -z-10 h-[320px] w-[320px] rounded-full border border-dashed border-[#EAD9B0] opacity-60" aria-hidden />
            <div className="pointer-events-none absolute -bottom-4 -left-8 -z-10 h-[200px] w-[200px] rounded-full bg-[#FBF0D9] opacity-80" aria-hidden />
          </div>
        </div>

        <WhyJyothishiUncle />
      </Reveal>
    </section>
  );
}
