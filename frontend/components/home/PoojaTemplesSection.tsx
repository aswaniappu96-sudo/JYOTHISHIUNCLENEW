"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookPoojaButton } from "@/components/booking/BookPoojaButton";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { stripHtml, telHref } from "@/lib/html";
import { useLocalizedList } from "@/lib/localized";
import { imageSrc } from "@/lib/media";
import { POOJAS_PATH } from "@/lib/siteRoutes";
import { useJuList } from "@/lib/useJuList";
import type { Pooja, Vendor } from "@/types/wordpress";

function templeKind(title: string) {
  const key = title.toLowerCase();
  if (/ganapathi|ganesha|ganesh/.test(key)) return "Ganesha Temple";
  if (/vishnumaya/.test(key)) return "Vishnumaya Temple";
  if (/saneeswara|shani|thirunallar/.test(key)) return "Saneeswara Temple";
  if (/krishna/.test(key)) return "Krishna Temple";
  if (/vishnu|guruvayur|tirupati/.test(key)) return "Krishna Temple";
  if (/shiva|mahadeva|kedar/.test(key)) return "Shiva Temple";
  if (/hanuman/.test(key)) return "Hanuman Temple";
  if (/devi|durga|lakshmi|mookambika|amman|bhadrakali/.test(key)) return "Devi Temple";
  return "Temple";
}

function templeCopy(temple: Vendor) {
  const short = temple.short_description?.trim();
  if (short) return short;
  const fromHtml = stripHtml(temple.full_description || "").trim();
  if (!fromHtml) return "";
  return fromHtml.length > 180 ? `${fromHtml.slice(0, 177).trim()}…` : fromHtml;
}

function poojasForTemple(temple: Vendor, poojas: Pooja[]) {
  const hay = `${temple.title} ${temple.short_description || ""} ${templeKind(temple.title)}`.toLowerCase();
  const matched = poojas.filter((pooja) => {
    const title = pooja.title.toLowerCase();
    if (/ganapathi|ganesha|ganesh/.test(title) && /ganapathi|ganesha|ganesh/.test(hay)) return true;
    if (/sudarshan|vishnu/.test(title) && /vishnu|sudarshan|guruvayur|krishna/.test(hay)) return true;
    if (/mrityunjaya|shiva/.test(title) && /shiva|mahadeva|mrityunjaya/.test(hay)) return true;
    if (/aghora/.test(title) && /aghora|bhairava|shiva/.test(hay)) return true;
    if (/lakshmi|durga|devi/.test(title) && /devi|lakshmi|durga|mookambika|bhadrakali/.test(hay)) return true;
    return title.split(/\s+/).some((word) => word.length > 4 && hay.includes(word));
  });
  return matched.length ? matched : poojas.slice(0, 4);
}

function CallGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M7.2 4.8c.4-.4 1.1-.5 1.6-.2l2.2 1.3c.5.3.7.9.5 1.4L10.8 9.8a11.2 11.2 0 0 0 3.4 3.4l2.5-.7c.5-.2 1.1 0 1.4.5l1.3 2.2c.3.5.2 1.2-.2 1.6l-1.1 1.1c-.5.5-1.2.7-1.9.5-3.3-.9-6.3-3.2-8.6-5.5S3.3 8.3 2.4 5c-.2-.7 0-1.4.5-1.9L4 2.9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PoojaTemplesSection({
  vendors = [],
  poojas = [],
  phone = "",
}: {
  vendors?: Vendor[];
  poojas?: Pooja[];
  phone?: string;
}) {
  const { t } = usePrefs();
  const temples = useLocalizedList(useJuList<Vendor>("/vendors", vendors));
  const rites = useLocalizedList(useJuList<Pooja>("/poojas", poojas));
  const [active, setActive] = useState(0);
  const pauseUntil = useRef(0);

  useEffect(() => {
    if (temples.length < 2) return;
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      setActive((index) => (index + 1) % temples.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [temples.length]);

  const pickTemple = (index: number) => {
    setActive(index);
    pauseUntil.current = Date.now() + 12000;
  };

  const selected = temples[Math.min(active, Math.max(temples.length - 1, 0))];
  const related = useMemo(() => (selected ? poojasForTemple(selected, rites) : []), [selected, rites]);
  const featuredSrc = selected ? imageSrc(selected.featured_image) : "";
  const featuredCopy = selected ? templeCopy(selected) : "";
  const featuredPlace = selected?.location?.trim();
  const showPlace = Boolean(featuredPlace && featuredPlace.toLowerCase() !== selected?.title.toLowerCase());

  if (!temples.length) return null;

  return (
    <div
      id="pooja-temples"
      className="grid scroll-mt-36 grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch"
      onMouseEnter={() => {
        pauseUntil.current = Number.MAX_SAFE_INTEGER;
      }}
      onMouseLeave={() => {
        pauseUntil.current = Date.now() + 2500;
      }}
    >
      <aside className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[#EAD9B0] bg-[#FFFBF0] p-4 shadow-[0_8px_24px_-16px_rgba(184,126,59,0.22)] md:p-5">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#9A7A4A] uppercase">{t("articles.templeKicker")}</p>
        <h3 className="mt-1.5 font-serif text-[22px] font-medium leading-[1.2] tracking-[-0.02em] text-[#1A1106]">
          {t("articles.templeLead")} <span className="italic text-[#9A6F3A]">{t("articles.templeAccent")}</span>
        </h3>
        <p className="mt-2 text-[13px] leading-[1.55] text-[#6B5E53]">{t("articles.templeCopy")}</p>
        <ul className="mt-3 space-y-1.5">
          {[t("articles.templePoint1"), t("articles.templePoint2"), t("articles.templePoint3")].map((point) => (
            <li key={point} className="flex items-start gap-2 text-[13px] text-[#4A3C2E]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B87E3B]" />
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {temples.slice(0, 6).map((temple, index) => {
            const src = imageSrc(temple.featured_image);
            const on = index === Math.min(active, temples.length - 1);
            return (
              <button
                key={temple.id || temple.slug}
                type="button"
                onClick={() => pickTemple(index)}
                className={`min-w-0 text-left ${on ? "" : "opacity-80 hover:opacity-100"}`}
              >
                <div
                  className={`aspect-square overflow-hidden rounded-[12px] bg-[#F7F0E2] ${
                    on ? "ring-2 ring-[#1E160E]" : "ring-1 ring-[#EAD9B0]"
                  }`}
                >
                  {src ? (
                    <img src={src} alt={temple.title} className="h-full w-full object-contain object-center" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-serif text-[#C9A86A]">ॐ</div>
                  )}
                </div>
                <p className="mt-1.5 line-clamp-2 text-center text-[10px] font-medium leading-snug text-[#5C4A32]">{temple.title}</p>
              </button>
            );
          })}
        </div>
        {selected && related.length ? (
          <div className="mt-3">
            <p className="text-[12px] font-semibold text-[#1A1106]">
              {t("temple.poojasAt")} {selected.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {related.map((pooja) => (
                <BookPoojaButton
                  key={pooja.id}
                  pooja={{ slug: pooja.slug, title: pooja.title, vendor: selected.slug }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD9B0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#6b4a12] transition hover:bg-[#FBF0D9]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C4A227]" />
                  {pooja.title}
                </BookPoojaButton>
              ))}
            </div>
          </div>
        ) : null}
        {phone.trim() ? (
          <a
            href={telHref(phone)}
            className="mt-4 inline-flex items-center justify-center gap-1.5 self-start rounded-full bg-[#1E160E] px-4 py-2 text-[12px] font-semibold text-[#FBF0D9] transition hover:bg-[#3A2F25]"
          >
            <CallGlyph /> {t("astro.call")}
          </a>
        ) : (
          <Link
            href={POOJAS_PATH}
            className="mt-4 inline-flex items-center justify-center gap-1.5 self-start rounded-full bg-[#1E160E] px-4 py-2 text-[12px] font-semibold text-[#FBF0D9] transition hover:bg-[#3A2F25]"
          >
            {t("articles.templeCta")} <span aria-hidden>→</span>
          </Link>
        )}
      </aside>

      {selected ? (
        <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-[#EAD9B0] bg-white p-4 shadow-[0_14px_40px_rgba(46,32,12,0.16)] md:p-5">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[#9A7A4A] uppercase">{t("temple.featured")}</p>
          <div className="relative mt-3 min-h-[240px] flex-1 overflow-hidden rounded-[16px] bg-[#F7F0E2] lg:min-h-0">
            {featuredSrc ? (
              <img src={featuredSrc} alt={selected.title} className="absolute inset-0 h-full w-full object-contain object-center" />
            ) : (
              <div className="flex h-full min-h-[240px] w-full items-center justify-center font-serif text-5xl text-[#C9A86A]">ॐ</div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-medium tracking-wide text-[#9A7A4A]">
              {templeKind(selected.title)}
              {showPlace ? ` · ${featuredPlace}` : ""}
            </p>
            <h3 className="mt-1 font-serif text-[20px] font-medium leading-snug text-[#1A1106]">{selected.title}</h3>
            <p className="mt-2 line-clamp-4 text-[13px] leading-[1.55] text-[#6B5E53]">
              {featuredCopy || t("temple.copy")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-2.5 py-1 text-[11px] font-medium text-[#6B4A23]">
                {t("temple.liveSankalpa")}
              </span>
              <span className="rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-2.5 py-1 text-[11px] font-medium text-[#6B4A23]">
                {t("temple.livePooja")}
              </span>
              <span className="rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-2.5 py-1 text-[11px] font-medium text-[#6B4A23]">
                {t("articles.templePoint3")}
              </span>
            </div>
          </div>
        </article>
      ) : null}
    </div>
  );
}
