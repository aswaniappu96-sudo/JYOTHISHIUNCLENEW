"use client";

import Link from "next/link";
import { PageHeading } from "@/components/home/SectionHeading";
import { TalkAstrologerCard } from "@/components/pages/TalkAstrologerCard";
import { usePortal } from "@/components/portal/PortalProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { mediaUrl } from "@/lib/api/client";
import { astrologerViewFor, buildAstrologerViews } from "@/lib/astrologer-display";
import { htmlParagraphs, telHref } from "@/lib/html";
import { SECTION_INNER } from "@/lib/layout";
import { whatsappUrl } from "@/lib/whatsapp";
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

function VideoGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect x="3" y="7" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 11.2 20 8.5v7l-5-2.7v-1.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function ChatGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
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
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M7.2 4.8c.4-.4 1.1-.5 1.6-.2l2.2 1.3c.5.3.7.9.5 1.4L10.8 9.8a11.2 11.2 0 0 0 3.4 3.4l2.5-.7c.5-.2 1.1 0 1.4.5l1.3 2.2c.3.5.2 1.2-.2 1.6l-1.1 1.1c-.5.5-1.2.7-1.9.5-3.3-.9-6.3-3.2-8.6-5.5S3.3 8.3 2.4 5c-.2-.7 0-1.4.5-1.9L4 2.9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const actionBtn =
  "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#e5c378] bg-white px-4 text-[14px] font-bold text-[#1A1106] transition hover:bg-[#fff8ec]";
const actionBtnGold =
  "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#e5c378] px-4 text-[14px] font-bold text-[#1A1106] transition hover:bg-[#F1D59B]";

export function AstrologerProfileView({
  person,
  related = [],
  phone,
  whatsapp,
}: {
  person: Astrologer;
  related?: Astrologer[];
  phone?: string;
  whatsapp?: string;
}) {
  const { t, locale } = usePrefs();
  const { openConsultation } = usePortal();
  const all = [person, ...related.filter((item) => item.slug !== person.slug)];
  const view = astrologerViewFor(person, all, locale);
  const others = buildAstrologerViews(related.filter((item) => item.slug !== person.slug), locale).slice(0, 4);
  const src = mediaUrl(person.featured_image?.full || person.featured_image?.url);
  const glyph = (view.name || "ॐ").trim().charAt(0);
  const callNumber = usablePhone(phone);
  const chatNumber = usableWhatsapp(whatsapp);
  const about = htmlParagraphs(view.about);
  const summary = view.summary;

  return (
    <div className="py-10 sm:py-14">
      <div className={SECTION_INNER}>
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-[#1A1106]/60">
          <Link href="/" className="transition hover:text-[#9A6F3A]">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <Link href="/astrologers" className="transition hover:text-[#9A6F3A]">
            {t("astro.back")}
          </Link>
          <span>/</span>
          <span className="text-[#1A1106]">{view.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="relative overflow-hidden rounded-[28px] border-2 border-[#e5c378] bg-[#fff8ec]">
            <div className="relative aspect-[4/5] w-full">
              {src ? (
                <img src={src} alt={view.name} className="h-full w-full object-cover object-top" />
              ) : (
                <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center text-[#1A1106]">
                  <span className="font-serif text-7xl">{glyph}</span>
                  <span className="mt-3 text-lg font-semibold">{view.name}</span>
                </div>
              )}
              {view.online ? (
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {t("astro.onlineBadge")}
                </span>
              ) : null}
            </div>
          </div>

          <div>
            <PageHeading as="h1" title={view.name} className="max-w-3xl" />
            <p className="mt-3 text-[15px] font-medium text-[#1A1106]">
              <span className="text-[#9A6F3A]">★</span> {view.rating}{" "}
              <span className="font-normal text-[#1A1106]/55">{t("astro.reviews", { n: view.reviews })}</span>
            </p>

            {view.tags.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {view.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#e5c378]/60 bg-white px-3 py-1 text-[12px] font-semibold text-[#1A1106]/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                [t("astro.experience"), t("astro.years", { n: view.experienceYears })],
                [t("astro.languagesLabel"), view.languages],
                [t("astro.priceMin"), t("astro.priceEnquire")],
                [t("astro.available"), view.online ? t("astro.filterOnline") : t("astro.available")],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[#e5c378]/45 bg-white px-4 py-3">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1A1106]/50">{label}</dt>
                  <dd className="mt-1 text-[15px] font-semibold text-[#1A1106]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <a
                href={whatsappUrl(
                  chatNumber,
                  view.name
                    ? `Namaste. I would like to chat with ${view.name} at JyothishiUncle.`
                    : "Namaste. I would like to chat with an astrologer at JyothishiUncle.",
                )}
                target="_blank"
                rel="noreferrer"
                className={actionBtn}
              >
                <ChatGlyph />
                {t("astro.chat")}
              </a>
              <a href={telHref(callNumber)} className={actionBtn}>
                <CallGlyph />
                {t("astro.call")}
              </a>
              <button
                type="button"
                onClick={() => openConsultation({ astrologerName: view.name, whatsapp: chatNumber })}
                className={actionBtnGold}
              >
                <VideoGlyph />
                {t("astro.video")}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-3xl">
          <h2 className="font-serif text-[28px] font-medium text-[#1A1106]">{t("astro.about")}</h2>
          {summary ? <p className="mt-3 text-[16px] leading-relaxed text-[#1A1106]/80">{summary}</p> : null}
          {about.length ? (
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#1A1106]/75">
              {about.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          ) : !summary ? (
            <p className="mt-3 text-[15px] leading-relaxed text-[#1A1106]/70">{view.specialty}</p>
          ) : null}
          {view.firstSession ? (
            <p className="mt-5 rounded-2xl border border-[#e5c378]/50 bg-[#fff8ec] px-4 py-3 text-[14px] text-[#1A1106]/80">
              <span className="font-semibold">{t("astro.firstSession")}: </span>
              {view.firstSession}
            </p>
          ) : null}
        </div>

        {others.length ? (
          <div className="mt-14">
            <h2 className="font-serif text-[28px] font-medium text-[#1A1106]">{t("astro.view")}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {others.map((item) => (
                <TalkAstrologerCard
                  key={item.person.id || item.person.slug}
                  view={item}
                  phone={callNumber}
                  whatsapp={chatNumber}
                  photo="full"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
