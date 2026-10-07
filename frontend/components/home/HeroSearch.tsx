"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { POOJAS_PATH } from "@/lib/siteRoutes";

const POPULAR = [
  { key: "hero.popLove", href: "/astrologers?topic=love", terms: ["love"] },
  { key: "hero.popMarriage", href: "/astrologers?topic=marriage", terms: ["marriage", "match"] },
  { key: "hero.popCareer", href: "/astrologers?topic=career", terms: ["career"] },
  { key: "hero.popBusiness", href: "/astrologers?topic=business", terms: ["business"] },
  { key: "hero.popFinance", href: "/astrologers?topic=business", terms: ["finance", "money"] },
  { key: "hero.popKundli", href: "/astrologers?topic=marriage", terms: ["kundli", "kundali", "birth", "chart"] },
  { key: "hero.popVastu", href: "/astrologers?topic=vastu", terms: ["vastu"] },
] as const;

const ctaPrimary =
  "inline-flex items-center justify-center rounded-full bg-primary-container px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary shadow-[0_10px_28px_rgba(201,162,39,0.4)] transition hover:brightness-95";

function searchHref(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return "/#astrologers";
  if (/pooja|homam|puja/.test(q)) return POOJAS_PATH;
  if (/yatra|temple|travel/.test(q)) return "/religious-travel";
  if (/horoscope|rashi/.test(q)) return "/#horoscope";
  const popular = POPULAR.find((item) => item.terms.some((term) => q.includes(term)));
  if (popular) return popular.href;
  return "/#astrologers";
}

export function HeroSearchPanel({
  onSearched,
  autoFocus = false,
}: {
  onSearched?: () => void;
  autoFocus?: boolean;
}) {
  const { t } = usePrefs();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [autoFocus]);

  const goSearch = (event?: FormEvent) => {
    event?.preventDefault();
    router.push(searchHref(query));
    onSearched?.();
  };

  return (
    <div className="rounded-2xl border border-[#f3e6c8]/25 bg-[#fff8ec]/95 p-4 text-[#1A1106] shadow-[0_12px_28px_rgba(8,4,0,0.28)]">
      <p className="text-[13px] font-bold">{t("hero.searchLabel")}</p>
      <form className="mt-2 flex flex-col gap-2 sm:flex-row" onSubmit={goSearch}>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("hero.searchPlaceholder")}
          className="min-w-0 flex-1 rounded-full border border-[#e5c378]/50 bg-white px-4 py-2.5 text-sm text-[#1A1106] outline-none placeholder:text-[#1A1106]/45 focus:border-[#e5c378]"
        />
        <button type="submit" className={`${ctaPrimary} sm:shrink-0`}>
          {t("hero.searchSubmit")}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A1106]/55">{t("hero.popular")}</span>
        {POPULAR.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            onClick={() => onSearched?.()}
            className="rounded-full border border-[#e5c378]/45 bg-white px-2.5 py-1 text-[12px] font-semibold text-[#1A1106] transition hover:bg-[#e5c378]/25"
          >
            {t(item.key)}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MobileSearchDock() {
  const { t } = usePrefs();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setOpen(true)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-lowest text-primary shadow-[0_8px_24px_rgba(8,4,0,0.18)] ring-1 ring-outline-variant transition hover:scale-105 hover:bg-surface-low"
        aria-label={t("nav.search")}
        title={t("nav.search")}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="6.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16.2 16.2 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-[#1c1008]/55 px-4 pt-28 backdrop-blur-[2px]">
          <button type="button" className="absolute inset-0" aria-label="Close search" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-xl">
            <HeroSearchPanel autoFocus onSearched={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
