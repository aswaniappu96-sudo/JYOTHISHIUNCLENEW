"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeading } from "@/components/home/SectionHeading";
import { TalkAstrologerCard } from "@/components/pages/TalkAstrologerCard";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import {
  buildAstrologerViews,
  filterAstrologers,
  isGuidanceTopic,
  type AstrologerFilter,
  type GuidanceTopicId,
} from "@/lib/astrologer-display";
import { SECTION_INNER } from "@/lib/layout";
import { useJuList } from "@/lib/useJuList";
import type { Astrologer } from "@/types/wordpress";

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

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8.5 12.2 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const tabBase =
  "rounded-full border-2 px-4 py-2 text-[13px] font-semibold transition";
const tabOn = `${tabBase} border-[#e5c378] bg-[#e5c378] text-[#1A1106]`;
const tabOff = `${tabBase} border-[#e5c378]/70 bg-white text-[#1A1106]/75 hover:bg-[#fff8ec]`;

const TOPIC_LABEL = {
  love: "consult.love",
  marriage: "consult.marriage",
  career: "consult.career",
  business: "consult.business",
  family: "consult.family",
  vastu: "consult.vastu",
  tarot: "consult.tarot",
  numerology: "consult.numerology",
  remedies: "consult.remedies",
} as const;

type BoardProps = {
  astrologers: Astrologer[];
  phone?: string;
  whatsapp?: string;
  photo?: "round" | "full";
  headingAs?: "h1" | "h2";
  showViewAll?: boolean;
  showProof?: boolean;
  id?: string;
};

export function AstrologerTalkBoard(props: BoardProps) {
  return (
    <Suspense fallback={<AstrologerTalkBoardInner {...props} topic={null} />}>
      <AstrologerTalkBoardFromUrl {...props} />
    </Suspense>
  );
}

function AstrologerTalkBoardFromUrl(props: BoardProps) {
  const params = useSearchParams();
  const raw = params.get("topic");
  return <AstrologerTalkBoardInner {...props} topic={isGuidanceTopic(raw) ? raw : null} />;
}

function AstrologerTalkBoardInner({
  astrologers,
  phone,
  whatsapp,
  photo = "round",
  headingAs = "h2",
  showViewAll = false,
  showProof = true,
  id,
  topic,
}: BoardProps & { topic: GuidanceTopicId | null }) {
  const { t, locale } = usePrefs();
  const [filter, setFilter] = useState<AstrologerFilter>("all");
  const list = useJuList<Astrologer>("/astrologers", astrologers);
  const views = useMemo(
    () => buildAstrologerViews(list.filter((person) => Boolean(person?.title || person?.slug)), locale),
    [list, locale],
  );
  const shown = useMemo(() => filterAstrologers(views, filter, topic), [views, filter, topic]);
  const callNumber = usablePhone(phone);
  const chatNumber = usableWhatsapp(whatsapp);

  const tabs: { id: AstrologerFilter; label: string }[] = [
    { id: "all", label: t("astro.all") },
    { id: "online", label: t("astro.filterOnline") },
    { id: "rated", label: t("astro.filterRated") },
    { id: "newest", label: t("astro.filterNew") },
  ];

  if (!views.length) {
    return (
      <section id={id} className="relative w-full scroll-mt-36 py-12 sm:py-16">
        <div className={`${SECTION_INNER} flex flex-col items-center rounded-2xl border-2 border-[#e5c378] bg-white p-6 text-center`}>
          <p className="text-base text-[#1A1106]">{t("hero.talk")}</p>
          <div className="mt-3">
            <BookConsultationButton>{t("astro.book")}</BookConsultationButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="relative w-full scroll-mt-36 py-12 sm:py-16">
      <div className={SECTION_INNER}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e5c378]/55 bg-white px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A1106]/70">
                {t("online.now", { n: views.filter((item) => item.online).length || views.length })}
              </span>
            </div>
            <PageHeading
              as={headingAs}
              className="mt-5"
              lead={t("astro.lead")}
              accent={t("astro.accent")}
            />
            <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-[#1A1106]/70 sm:text-[16px]">{t("astro.copy")}</p>
            {showProof ? (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#1A1106]/70">
                {[t("astro.proof1"), t("astro.proof2"), t("astro.proof3")].map((line) => (
                  <span key={line} className="inline-flex items-center gap-1.5">
                    <CheckGlyph />
                    {line}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {showViewAll ? (
            <Link
              href="/astrologers"
              className="inline-flex shrink-0 items-center rounded-full border-2 border-[#e5c378] bg-white px-4 py-2 text-[13px] font-semibold text-[#1A1106] transition hover:bg-[#fff8ec]"
            >
              {t("astro.view")}
            </Link>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={t("astro.title")}>
          {topic ? (
            <Link
              href="/astrologers"
              className="rounded-full border-2 border-[#e5c378] bg-[#fff8ec] px-4 py-2 text-[13px] font-semibold text-[#1A1106]"
            >
              {t(TOPIC_LABEL[topic])} ×
            </Link>
          ) : null}
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={filter === tab.id ? tabOn : tabOff}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shown.map((view) => (
            <TalkAstrologerCard
              key={view.person.id || view.person.slug}
              view={view}
              phone={callNumber}
              whatsapp={chatNumber}
              photo={photo}
            />
          ))}
        </div>

        {showProof ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[t("astro.trust1"), t("astro.trust2")].map((line) => (
              <span
                key={line}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e5c378]/55 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1A1106]/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {line}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
