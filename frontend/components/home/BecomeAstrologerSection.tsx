"use client";

import type { ReactNode } from "react";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePortal } from "@/components/portal/PortalProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SECTION_INNER } from "@/lib/layout";

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#EAD9B0] bg-white text-[#9A6F3A] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      {children}
    </span>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 19c1.2-3.2 3.4-4.8 6.5-4.8s5.3 1.6 6.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ClientsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="9" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="9.2" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.4 18.5c.9-2.6 2.6-3.9 5-3.9 2.3 0 4 1.2 4.9 3.6M13.2 14.8c1.8-.2 3.3.8 4.2 2.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ModesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="4.5" y="5.5" width="15" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9.5h8M8 12.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function EarningsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M5 16.5 10 11l3.2 3.2L19 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 8.5H19V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="4.5" y="6" width="15" height="13.5" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4.5v3M16 4.5v3M4.5 10h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M12 4.2 19 7v5.2c0 4.1-2.8 6.8-7 8.6-4.2-1.8-7-4.5-7-8.6V7l7-2.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9.2 12.2 1.9 1.9 3.7-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ITEMS = [
  { key: "join.item1" as const, icon: ProfileIcon },
  { key: "join.item2" as const, icon: ClientsIcon },
  { key: "join.item3" as const, icon: ModesIcon },
  { key: "join.item4" as const, icon: EarningsIcon },
  { key: "join.item5" as const, icon: CalendarIcon },
  { key: "join.item6" as const, icon: ShieldIcon },
];

export function BecomeAstrologerSection() {
  const { t } = usePrefs();
  const { openAuth } = usePortal();

  return (
    <section id="join" className="relative w-full overflow-hidden scroll-mt-36 py-10 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-[120px] top-8 h-[520px] w-[520px] rounded-full bg-[#E9C07A]/12 blur-[80px]" />
        <div className="absolute left-[6%] top-[90px] select-none font-serif text-[120px] leading-none text-[#C9A86A] opacity-[0.07]">ॐ</div>
      </div>

      <Reveal className={SECTION_INNER}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="text-[#C4A227]">✦</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9C8360]">{t("join.kicker")}</span>
            </div>
            <PageHeading lead={t("join.lead")} accent={t("join.accent")} />
            <p className="mt-4 max-w-[540px] text-[15px] leading-[1.65] text-[#6E6256] sm:text-[16px]">{t("join.copy")}</p>

            <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.key} className="flex items-center gap-3">
                    <IconWrap>
                      <Icon />
                    </IconWrap>
                    <span className="text-[14px] font-semibold leading-[1.35] text-[#1E160E]">{t(item.key)}</span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-7 flex items-center gap-2 text-[13.5px] text-[#7A6A58]">
              <span className="text-[#C4A227]">✦</span>
              {t("join.foot")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openAuth("register", "astrologer")}
                className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#A07838] px-7 text-[14px] font-semibold tracking-[0.01em] text-[#FFF8EC] shadow-[0_8px_20px_rgba(160,120,56,0.28)] transition hover:bg-[#8C682E]"
              >
                {t("join.cta")}
                <span className="ml-2" aria-hidden>
                  →
                </span>
              </button>
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="inline-flex h-[48px] items-center justify-center rounded-full border border-[#EAD9B0] bg-white px-6 text-[14px] font-semibold text-[#8B6A3A] transition hover:border-[#C4A227] hover:bg-[#FFFBF0]"
              >
                {t("join.login")}
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[640px] lg:max-w-none">
            <div
              className="pointer-events-none absolute left-[8%] top-[18%] h-[72%] w-[84%] rounded-[46%] bg-[#E9C07A]/28 blur-[42px]"
              aria-hidden
            />
            <img
              src="/images/join-astrologer-art.jpg"
              alt=""
              className="relative z-10 h-auto w-full object-contain mix-blend-multiply"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
