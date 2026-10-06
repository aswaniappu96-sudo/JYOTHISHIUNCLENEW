"use client";

import { PageHeading } from "@/components/home/SectionHeading";
import { usePortal } from "@/components/portal/PortalProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { Reveal } from "@/components/ui/Reveal";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

export function BecomeAstrologerSection() {
  const { t } = usePrefs();
  const { openAuth } = usePortal();
  const items = [t("join.item1"), t("join.item2"), t("join.item3"), t("join.item4"), t("join.item5"), t("join.item6")];

  return (
    <section id="join" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <svg className="absolute -right-[160px] top-[40px] h-[640px] w-[640px] text-[#8B6A3A] opacity-[0.04]" viewBox="0 0 400 400" fill="none">
          <g stroke="currentColor" strokeWidth="0.6">
            {Array.from({ length: 20 }).map((_, n) => (
              <circle key={n} cx="200" cy="200" r={24 + n * 14} opacity={0.55 - n * 0.02} />
            ))}
          </g>
        </svg>
        <div className="absolute left-[8%] top-[80px] select-none font-serif text-[120px] leading-none text-[#C9A86A] opacity-[0.07]">ॐ</div>
      </div>

      <Reveal className={INNER}>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FBF0D9] font-serif text-[10px] text-[#8B6A3A]">
            ॐ
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9C8360]">{t("join.kicker")}</span>
        </div>
        <PageHeading lead={t("join.lead")} accent={t("join.accent")} />
        <p className="mt-4 max-w-[620px] text-[15px] leading-[1.7] text-[#6E6256]">{t("join.copy")}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-10">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[1px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#EAD9B0] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B6A3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12l4 4L19 6" />
                </svg>
              </span>
              <div className="text-[14px] font-semibold leading-[1.4] text-[#1E160E]">{item}</div>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={() => openAuth("register", "astrologer")}
            className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#E9C07A] px-7 text-[14px] font-semibold tracking-[0.01em] text-[#1E160E] shadow-[0_4px_14px_rgba(233,192,122,0.35)] transition-colors hover:bg-[#E0B46D]"
          >
            {t("join.cta")}
            <span className="ml-2" aria-hidden>
              →
            </span>
          </button>
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="text-[13.5px] font-semibold text-[#8B6A3A] underline underline-offset-4 hover:text-[#1E160E]"
          >
            {t("join.login")}
          </button>
        </div>
      </Reveal>
    </section>
  );
}
