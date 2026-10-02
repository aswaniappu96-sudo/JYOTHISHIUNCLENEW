"use client";

import { useMemo, useState } from "react";
import { BookPoojaButton } from "@/components/booking/BookPoojaButton";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { usePortal } from "@/components/portal/PortalProvider";
import { imageSrc } from "@/lib/media";
import { useJuList } from "@/lib/useJuList";
import type { Pooja, Vendor } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

const GRADIENTS = [
  "from-[#d4a017] to-[#f3d78a]",
  "from-[#e07a3a] to-[#f4b183]",
  "from-[#5b6bb8] to-[#a8b4e8]",
  "from-[#2d9a6a] to-[#8fd4b4]",
  "from-[#c45c7a] to-[#f0a8bc]",
  "from-[#b07a3a] to-[#e8c9a0]",
  "from-[#6b5a9a] to-[#c4b8e0]",
  "from-[#4a8c8c] to-[#a8d4d4]",
];

type TempleKind = ReturnType<typeof templeKind>;

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

function PinGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-[#B08A4A]" fill="none" aria-hidden>
      <path d="M12 21s7-6.2 7-11.2A7 7 0 1 0 5 9.8C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="9.5" r="2.1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function TempleGlyph({ kind }: { kind: TempleKind }) {
  if (kind === "Ganesha Temple") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#6b4a12]" fill="none" aria-hidden>
        <path d="M8 16c0-2 1.6-4 4-5 2.4 1 4 3 4 5H8Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 9.2c.4-1.8 1.2-3.2 2-4.2.8 1 1.6 2.4 2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="10.2" cy="12.2" r=".8" fill="currentColor" />
        <circle cx="13.8" cy="12.2" r=".8" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "Vishnumaya Temple") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#6b4a12]" fill="none" aria-hidden>
        <path d="M12 4v3M12 17v3M7 7.5 9 9.5M17 7.5 15 9.5M7 16.5 9 14.5M17 16.5 15 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (kind === "Saneeswara Temple") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#6b4a12]" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 5v2.2M12 16.8V19M5 12h2.2M16.8 12H19M7.2 7.2l1.5 1.5M15.3 15.3l1.5 1.5M16.8 7.2l-1.5 1.5M8.7 15.3 7.2 16.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "Devi Temple") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#6b4a12]" fill="none" aria-hidden>
        <path d="M12 5 8.5 11h7L12 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8.5 11h7v7H8.5v-7Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#6b4a12]" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function PoojaTemplesSection({
  vendors = [],
  poojas = [],
}: {
  vendors?: Vendor[];
  poojas?: Pooja[];
}) {
  const { t } = usePrefs();
  const { openPooja } = usePortal();
  const temples = useJuList<Vendor>("/vendors", vendors);
  const rites = useJuList<Pooja>("/poojas", poojas);
  const [active, setActive] = useState(0);
  const selected = temples[Math.min(active, Math.max(temples.length - 1, 0))];
  const related = useMemo(() => (selected ? poojasForTemple(selected, rites) : []), [selected, rites]);
  const scroll = temples.length > 5;

  if (!temples.length) return null;

  return (
    <section id="pooja-temples" className="relative w-full scroll-mt-36 pb-10 sm:pb-14">
      <div className={INNER}>
        <div className="rounded-[28px] border border-dashed border-[#E6D5A8] bg-[#fffaf0]/80 px-4 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B08A4A]">{t("temple.kicker")}</p>
              <PageHeading className="mt-2" lead={t("temple.lead")} accent={t("temple.accent")} />
            </div>
            <div className="flex max-w-md flex-col items-start gap-2 lg:items-end lg:text-right">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#B08A4A]">
                ✦ {t("temple.liveSankalpa")}
              </span>
              <p className="text-[13px] leading-relaxed text-[#7a6448]">{t("temple.copy")}</p>
            </div>
          </div>

          <div
            className={
              scroll
                ? "no-scrollbar mt-7 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
                : "mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            }
          >
            {temples.map((temple, index) => {
              const src = imageSrc(temple.featured_image);
              const kind = templeKind(temple.title);
              const loc = (temple.location || "").trim();
              const showLoc = Boolean(loc && loc.toLowerCase() !== temple.title.toLowerCase() && !temple.title.toLowerCase().includes(loc.toLowerCase()));
              const selectedCard = index === Math.min(active, temples.length - 1);
              return (
                <button
                  key={temple.id || temple.slug}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`overflow-hidden rounded-[22px] border bg-white text-left shadow-[0_10px_24px_rgba(30,22,14,0.05)] transition ${
                    scroll ? "w-[220px] shrink-0 snap-start" : "w-full"
                  } ${selectedCard ? "border-[#1E160E] ring-1 ring-[#1E160E]" : "border-[#EDE0C4] hover:border-[#D9C08F]"}`}
                >
                  <div className={`relative h-[96px] overflow-hidden bg-linear-to-br ${GRADIENTS[index % GRADIENTS.length]}`}>
                    {src ? (
                      <img src={src} alt={temple.title} className="absolute inset-0 h-full w-full object-cover" />
                    ) : null}
                    <div className={`absolute inset-0 bg-linear-to-br ${GRADIENTS[index % GRADIENTS.length]} ${src ? "opacity-50" : ""}`} />
                    <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-white/92 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      {t("temple.livePooja")}
                    </span>
                    <span className="absolute top-2.5 left-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-[12px] border border-white/80 bg-white/90 shadow-sm">
                      {src ? <img src={src} alt="" className="h-full w-full rounded-[10px] object-cover" /> : <TempleGlyph kind={kind} />}
                    </span>
                  </div>
                  <div className="px-3.5 py-3">
                    <h3 className="line-clamp-2 font-serif text-[17px] leading-snug text-[#1A1106]">{temple.title}</h3>
                    {showLoc ? (
                      <p className="mt-1.5 flex items-start gap-1 text-[12px] text-[#8a7358]">
                        <PinGlyph />
                        <span className="line-clamp-1">{loc}</span>
                      </p>
                    ) : null}
                    <span className="mt-2 inline-flex rounded-full bg-[#F8EFD8] px-2.5 py-1 text-[10px] font-medium text-[#8B6914]">
                      {kind}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selected ? (
            <div className="mt-5 flex flex-col gap-3 rounded-[20px] border border-[#EDE0C4] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF6E4] text-[15px] text-[#9A6F3A]">ॐ</span>
                <div>
                  <p className="text-[13px] font-semibold text-[#1A1106]">
                    {t("temple.poojasAt")} {selected.title}
                    {selected.location && selected.location.trim().toLowerCase() !== selected.title.toLowerCase() ? (
                      <span className="font-normal text-[#8a7358]"> — {selected.location}</span>
                    ) : null}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {related.map((pooja) => (
                      <BookPoojaButton
                        key={pooja.id}
                        pooja={{ slug: pooja.slug, title: pooja.title, vendor: selected.slug }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD9B0] bg-[#FFF8EC] px-3 py-1.5 text-[12px] font-semibold text-[#6b4a12] transition hover:bg-[#FBF0D9]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C4A227]" />
                        {pooja.title}
                      </BookPoojaButton>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = (Math.min(active, temples.length - 1) + 1) % temples.length;
                  setActive(next);
                }}
                className="shrink-0 text-[12px] text-[#B08A4A]"
              >
                {t("temple.click")}
              </button>
            </div>
          ) : null}

          <p className="mt-6 text-center text-[11px] tracking-wide text-[#C4B08A]">
            — {t("temple.foot")} —
          </p>
          <p className="mt-2 text-center text-[11px] text-[#B08A4A]">{t("temple.note")}</p>
        </div>
      </div>
    </section>
  );
}
