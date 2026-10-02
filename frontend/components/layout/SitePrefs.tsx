"use client";

import { useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { LOCALES } from "@/lib/i18n";
import { mediaUrl } from "@/lib/api/client";
import { telHref } from "@/lib/html";
import { whatsappUrl } from "@/lib/whatsapp";
import { useJuList } from "@/lib/useJuList";
import type { Astrologer } from "@/types/wordpress";

const FALLBACK_PHONE = "+91 84519 89496";
const FALLBACK_WHATSAPP = "918451989496";
const FALLBACK_SOCIAL = {
  instagram: "https://www.instagram.com/jyothishiuncle",
  facebook: "https://www.facebook.com/jyothishiuncle",
  youtube: "https://www.youtube.com/@jyothishiuncle",
};

function usablePhone(value?: string) {
  const text = (value || "").trim();
  if (!text || /0000/.test(text) || text.replace(/\D/g, "") === "96800000000") return FALLBACK_PHONE;
  return text;
}

export function usableWhatsapp(value?: string) {
  const text = (value || "").trim();
  if (!text || /0000/.test(text) || text.replace(/\D/g, "") === "96800000000") return FALLBACK_WHATSAPP;
  return text;
}

function iconBtnClass(active = true) {
  return `flex h-8 w-8 items-center justify-center rounded-full text-primary transition hover:bg-primary/10 ${
    active ? "" : "opacity-50"
  }`;
}

export function OnlineNow({ astrologers = [] }: { astrologers?: Astrologer[] }) {
  const { t } = usePrefs();
  const list = useJuList<Astrologer>("/astrologers", astrologers);
  const people = list.filter((person) => person?.title || person?.slug);
  const photos = people
    .map((person) => mediaUrl(person.featured_image?.full || person.featured_image?.url))
    .filter((src): src is string => Boolean(src))
    .slice(0, 3);
  const count = people.length;

  return (
    <div className="twinkle inline-flex items-center gap-2 rounded-full border border-primary/25 bg-surface-lowest/90 px-2.5 py-1 shadow-sm">
      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
      <p className="hidden text-[11px] font-semibold text-on-surface sm:block">
        {count ? t("online.now", { n: count }) : t("astro.kicker")}
      </p>
      <div className="flex -space-x-2">
        {photos.length
          ? photos.map((src) => (
              <img key={src} src={src} alt="" className="h-6 w-6 rounded-full object-cover ring-2 ring-surface-lowest" />
            ))
          : people.slice(0, 3).map((person) => (
              <span
                key={person.id || person.slug}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container text-[10px] font-bold text-on-primary ring-2 ring-surface-lowest"
              >
                {(person.title || "ॐ").trim().charAt(0)}
              </span>
            ))}
      </div>
    </div>
  );
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M7.2 3.8h2.4l1.2 3-1.6 1.1a12.5 12.5 0 0 0 6.9 6.9l1.1-1.6 3 1.2v2.4c0 .8-.7 1.5-1.5 1.5C10.8 18.3 5.7 13.2 5.7 5.3c0-.8.7-1.5 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopBarContact({
  phone,
  whatsapp,
  instagram,
  facebook,
  youtube,
}: {
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}) {
  const number = usablePhone(phone);
  const wa = usableWhatsapp(whatsapp);
  const ig = instagram || FALLBACK_SOCIAL.instagram;
  const fb = facebook || FALLBACK_SOCIAL.facebook;
  const yt = youtube || FALLBACK_SOCIAL.youtube;

  return (
    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
      <a
        href={telHref(number)}
        className="inline-flex max-w-[46vw] items-center gap-1.5 truncate rounded-full border border-primary/20 bg-surface-lowest/90 px-2.5 py-1 text-[12px] font-bold tracking-wide text-on-surface hover:text-primary sm:max-w-none sm:text-[13px]"
      >
        <PhoneGlyph />
        <span>{number}</span>
      </a>
      <a href={ig} target="_blank" rel="noreferrer" className={iconBtnClass()} aria-label="Instagram">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
        </svg>
      </a>
      <a href={fb} target="_blank" rel="noreferrer" className={iconBtnClass()} aria-label="Facebook">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M14.2 21v-7.1h2.4l.4-2.8h-2.8V9.3c0-.8.2-1.4 1.4-1.4H17V5.4c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H8.8v2.8h2.6V21h2.8Z" />
        </svg>
      </a>
      <a href={yt} target="_blank" rel="noreferrer" className={iconBtnClass()} aria-label="YouTube">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M21.6 8.2a2.7 2.7 0 0 0-1.9-1.9C18 6 12 6 12 6s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 8.2 28 28 0 0 0 2.1 12a28 28 0 0 0 .3 3.8 2.7 2.7 0 0 0 1.9 1.9C6 18 12 18 12 18s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .3-3.8 28 28 0 0 0-.3-3.8ZM10 15.1V8.9L15.2 12 10 15.1Z" />
        </svg>
      </a>
      <a
        href={whatsappUrl(wa, "Hello, I would like to know more about JyothishiUncle.")}
        target="_blank"
        rel="noreferrer"
        className={iconBtnClass()}
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M12.04 3.9A8.1 8.1 0 0 0 5.1 15.4L4 20l4.7-1.1a8.1 8.1 0 1 0 3.34-15ZM12 18.3a6.2 6.2 0 0 1-3.16-.86l-.23-.14-2.79.65.67-2.72-.15-.24a6.2 6.2 0 1 1 5.66 3.31Zm3.4-4.64c-.19-.1-1.1-.54-1.27-.6-.17-.06-.3-.1-.42.1-.13.19-.49.6-.6.72-.11.13-.22.14-.41.05-.19-.1-.8-.3-1.53-.94-.56-.5-.94-1.12-1.05-1.31-.11-.19-.01-.3.08-.39.09-.09.19-.22.29-.33.1-.11.13-.19.19-.32.06-.13.03-.24-.02-.33-.05-.1-.42-1.01-.58-1.38-.15-.36-.3-.31-.42-.32h-.36c-.12 0-.33.05-.5.24-.17.19-.66.64-.66 1.56s.68 1.81.77 1.94c.1.13 1.34 2.04 3.25 2.86.45.2.81.31 1.08.4.46.14.87.12 1.2.07.37-.05 1.1-.45 1.26-.88.15-.43.15-.8.11-.88-.05-.08-.17-.13-.36-.22Z" />
        </svg>
      </a>
    </div>
  );
}

export function ThemeToggle() {
  const { theme, setTheme, t } = usePrefs();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface-lowest text-primary"
      aria-label={dark ? t("nav.themeLight") : t("nav.themeDark")}
      title={dark ? t("nav.themeLight") : t("nav.themeDark")}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path d="M16 13a6 6 0 0 1-7-7 6.5 6.5 0 1 0 7 7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

export function LanguageSwitch() {
  const { locale, setLocale, t } = usePrefs();
  const [open, setOpen] = useState(false);
  const current = LOCALES.find((item) => item.id === locale) || LOCALES[0];

  return (
    <div className="relative">
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 items-center gap-1 rounded-full border border-outline-variant bg-surface-lowest px-3 text-[11px] font-semibold text-primary"
        aria-expanded={open}
        aria-label={t("nav.language")}
      >
        {current.native}
        <span className="text-[9px] opacity-70">▾</span>
      </button>
      {open ? (
        <div className="absolute top-full right-0 z-[95] mt-2 w-40 rounded-xl bg-surface-lowest p-1 shadow-[0_12px_32px_rgba(90,60,20,0.16)] ring-1 ring-outline-variant">
          {LOCALES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`block w-full rounded-lg px-3 py-2 text-left text-[13px] ${
                item.id === locale ? "bg-primary-container/40 font-semibold text-on-surface" : "text-on-surface hover:bg-surface-low"
              }`}
              onClick={() => {
                setLocale(item.id);
                setOpen(false);
              }}
            >
              {item.native}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
