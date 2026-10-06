"use client";

import Link from "next/link";
import { usePortal } from "@/components/portal/PortalProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { mediaUrl } from "@/lib/api/client";
import type { AstrologerView } from "@/lib/astrologer-display";
import { telHref } from "@/lib/html";
import { whatsappUrl } from "@/lib/whatsapp";

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
  "inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-[#e5c378] bg-white px-2 text-[12px] font-bold text-[#1A1106] transition hover:bg-[#fff8ec]";
const actionBtnGold =
  "inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#e5c378] px-2 text-[12px] font-bold text-[#1A1106] transition hover:bg-[#F1D59B]";

function OnlineBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-white shadow-sm">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      {label}
    </span>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-baseline justify-between gap-3 text-[13px] leading-snug">
      <span className="text-[#1A1106]/55">{label}</span>
      <span className="text-right font-semibold text-[#1A1106]">{value}</span>
    </p>
  );
}

export function TalkAstrologerCard({
  view,
  phone,
  whatsapp,
  photo = "round",
}: {
  view: AstrologerView;
  phone: string;
  whatsapp: string;
  photo?: "round" | "full";
}) {
  const { t } = usePrefs();
  const { openConsultation } = usePortal();
  const src = mediaUrl(view.person.featured_image?.full || view.person.featured_image?.url);
  const glyph = (view.name || view.location || "ॐ").trim().charAt(0);
  const profileHref = view.person.slug ? `/astrologers/${view.person.slug}` : "/astrologers";
  const callHref = telHref(phone);
  const chatHref = whatsappUrl(
    whatsapp,
    view.name
      ? `Namaste. I would like to chat with ${view.name} at JyothishiUncle.`
      : "Namaste. I would like to chat with an astrologer at JyothishiUncle.",
  );

  return (
    <article
      className={`flex h-full flex-col rounded-[28px] border-2 border-[#e5c378] bg-white shadow-[0_12px_32px_-16px_rgba(26,17,6,0.16)] ${photo === "full" ? "overflow-hidden" : ""}`}
    >
      {photo === "full" ? (
        <Link href={profileHref} className="relative aspect-[4/5] w-full overflow-hidden bg-[#fff8ec]">
          {src ? (
            <img src={src} alt={view.name || "Astrologer"} className="h-full w-full object-cover object-top" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-[#1A1106]">
              <span className="font-serif text-6xl">{glyph}</span>
              <span className="mt-2 text-sm font-semibold">{view.name || "Astrologer"}</span>
            </div>
          )}
          {view.online ? (
            <div className="absolute top-3 left-3">
              <OnlineBadge label={t("astro.onlineBadge")} />
            </div>
          ) : null}
        </Link>
      ) : (
        <Link href={profileHref} className="relative mx-auto mt-6 block">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#e5c378] bg-[#fff8ec] font-serif text-3xl font-bold text-[#9A6F3A]">
            {src ? <img src={src} alt="" className="h-full w-full object-cover object-top" /> : glyph}
          </div>
          {view.online ? (
            <div className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap">
              <OnlineBadge label={t("astro.onlineBadge")} />
            </div>
          ) : null}
        </Link>
      )}

      <div className={`flex flex-1 flex-col p-5 ${photo === "round" ? "pt-7" : ""}`}>
        <h3 className="font-serif text-[22px] font-medium leading-snug">
          <Link href={profileHref} className="text-[#1A1106] hover:text-[#9A6F3A]">
            {view.name || view.location}
          </Link>
        </h3>
        <p className="mt-1 text-[13px] font-medium text-[#1A1106]">
          <span className="text-[#9A6F3A]">★</span> {view.rating}{" "}
          <span className="font-normal text-[#1A1106]/55">{t("astro.reviews", { n: view.reviews })}</span>
        </p>

        {view.tags.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {view.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#e5c378]/60 bg-[#fff8ec] px-2.5 py-0.5 text-[11px] font-semibold text-[#1A1106]/75"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : view.specialty ? (
          <p className="mt-3 text-[13px] text-[#1A1106]/70">{view.specialty}</p>
        ) : null}

        <div className="mt-4 space-y-2 border-t border-[#e5c378]/35 pt-3">
          <Fact label={t("astro.experience")} value={t("astro.years", { n: view.experienceYears })} />
          <Fact label={t("astro.languagesLabel")} value={view.languages} />
          <Fact label={t("astro.priceMin")} value={t("astro.priceEnquire")} />
        </div>

        <div className="mt-4 flex gap-2">
          <a href={chatHref} target="_blank" rel="noreferrer" className={actionBtn}>
            <ChatGlyph />
            {t("astro.chat")}
          </a>
          <a href={callHref} className={actionBtn}>
            <CallGlyph />
            {t("astro.call")}
          </a>
          <button
            type="button"
            onClick={() => openConsultation({ astrologerName: view.name, whatsapp })}
            className={actionBtnGold}
          >
            <VideoGlyph />
            {t("astro.video")}
          </button>
        </div>

        <Link
          href={profileHref}
          className="mt-4 inline-flex items-center justify-center gap-1 text-[13px] font-semibold text-[#9A6F3A] transition hover:text-[#1A1106]"
        >
          {t("astro.profile")}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
