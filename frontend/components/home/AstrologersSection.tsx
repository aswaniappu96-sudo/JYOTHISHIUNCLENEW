"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageHeading } from "@/components/home/SectionHeading";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { PORTRAITS } from "@/components/pages/AstrologerCard";
import { usePortal } from "@/components/portal/PortalProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { mediaUrl } from "@/lib/api/client";
import { decodeWpText, telHref } from "@/lib/html";
import { publicSpecialtyLine } from "@/lib/siteServices";
import { useJuList } from "@/lib/useJuList";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Astrologer } from "@/types/wordpress";

const INNER = "mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";
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

const modeBtn =
  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#e5c378] bg-white text-[#1A1106] transition hover:bg-[#fff8ec]";
const modeBtnGold =
  "flex h-10 w-10 items-center justify-center rounded-full bg-[#e5c378] text-[#1A1106] transition hover:bg-[#F1D59B]";

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8.5 12.2 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function specialtyTags(text: string) {
  return text
    .split(" · ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export function AstrologersSection({
  astrologers,
  phone,
  whatsapp,
}: {
  astrologers: Astrologer[];
  phone?: string;
  whatsapp?: string;
}) {
  const { t } = usePrefs();
  const { openConsultation } = usePortal();
  const list = useJuList<Astrologer>("/astrologers", astrologers);
  const shown = useMemo(() => list.filter((person) => Boolean(person?.title || person?.slug)), [list]);
  const callNumber = usablePhone(phone);
  const chatNumber = usableWhatsapp(whatsapp);
  const callHref = telHref(callNumber);

  if (!shown.length) {
    return (
      <section id="astrologers" className="relative w-full py-12 sm:py-16">
        <div className={`${INNER} flex flex-col items-center rounded-2xl border-2 border-[#e5c378] bg-white p-6 text-center`}>
          <p className="text-base text-[#1A1106]">{t("hero.talk")}</p>
          <div className="mt-3">
            <BookConsultationButton>{t("astro.book")}</BookConsultationButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="astrologers" className="relative w-full scroll-mt-36 py-12 sm:py-16">
      <div className={INNER}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e5c378]/55 bg-white px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A1106]/70">
                {t("online.now", { n: shown.length })}
              </span>
            </div>
            <PageHeading className="mt-5" lead={t("astro.lead")} accent={t("astro.accent")} />
            <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-[#1A1106]/70 sm:text-[16px]">{t("astro.copy")}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#1A1106]/70">
              {[t("astro.proof1"), t("astro.proof2"), t("astro.proof3")].map((line) => (
                <span key={line} className="inline-flex items-center gap-1.5">
                  <CheckGlyph />
                  {line}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/astrologers"
            className="inline-flex shrink-0 items-center rounded-full border-2 border-[#e5c378] bg-white px-4 py-2 text-[13px] font-semibold text-[#1A1106] transition hover:bg-[#fff8ec]"
          >
            {t("astro.view")}
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shown.slice(0, 4).map((person, index) => {
            const meta = PORTRAITS[index % PORTRAITS.length];
            const place = decodeWpText(person.location || "") || meta.location;
            const specialty = publicSpecialtyLine(decodeWpText(person.specialty || person.short_description || ""));
            const tags = specialtyTags(specialty);
            const src = mediaUrl(person.featured_image?.full || person.featured_image?.url);
            const name = decodeWpText(person.title || "");
            const glyph = (place || "ॐ").trim().charAt(0);

            return (
              <article
                key={person.id || person.slug}
                className="flex flex-col rounded-[28px] border-2 border-[#e5c378] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(26,17,6,0.16)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#e5c378] bg-[#fff8ec] font-serif text-xl font-bold text-tertiary">
                    {src ? <img src={src} alt="" className="h-full w-full object-cover object-top" /> : glyph || "ॐ"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="flex items-center gap-1.5 font-serif text-[20px] font-medium leading-snug text-[#1A1106]">
                      <span className="truncate">{place}</span>
                      <CheckGlyph />
                    </h3>
                    {tags.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[#e5c378]/60 bg-[#fff8ec] px-2.5 py-0.5 text-[11px] font-semibold text-[#1A1106]/75"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <p className="mt-4 text-[13px] font-medium text-[#1A1106]">
                  <span className="text-tertiary">★</span> {meta.rating}
                </p>

                <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => openConsultation({ astrologerName: name, whatsapp: chatNumber })}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className={modeBtnGold}>
                      <VideoGlyph />
                    </span>
                    <span className="text-[10px] font-bold tracking-wide text-[#1A1106]">{t("astro.video")}</span>
                  </button>
                  <a
                    href={whatsappUrl(
                      chatNumber,
                      name
                        ? `Namaste. I would like to chat with ${name} at JyothishiUncle.`
                        : "Namaste. I would like to chat with an astrologer at JyothishiUncle.",
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1"
                  >
                    <span className={modeBtn}>
                      <ChatGlyph />
                    </span>
                    <span className="text-[10px] font-bold tracking-wide text-[#1A1106]">{t("strip.chatTitle")}</span>
                  </a>
                  <a href={callHref} className="flex flex-col items-center gap-1">
                    <span className={modeBtn}>
                      <CallGlyph />
                    </span>
                    <span className="text-[10px] font-bold tracking-wide text-[#1A1106]">{t("strip.callTitle")}</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

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
      </div>
    </section>
  );
}
