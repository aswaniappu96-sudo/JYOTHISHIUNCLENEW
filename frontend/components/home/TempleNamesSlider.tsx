"use client";

import { useLocalizedList } from "@/lib/localized";
import { liveCatalogPhoto } from "@/lib/catalogImages";
import { imageSrc } from "@/lib/media";
import { withCurrentTemplePosts } from "@/lib/templeNames";
import { useJuList } from "@/lib/useJuList";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { Vendor } from "@/types/wordpress";

const FALLBACK_TEMPLES: Vendor[] = [
  {
    id: 1,
    slug: "sri-mahaganapathi-temple",
    title: "Hanuman Swami Temple",
    short_description: "",
    featured_image: null,
    display_order: 1,
    full_description: "",
    location: "Hanuman Swami Temple",
  },
  {
    id: 2,
    slug: "sri-mahavishnu-temple",
    title: "Vishnumaya Swami – Karimkutty Swami Temple",
    short_description: "",
    featured_image: null,
    display_order: 2,
    full_description: "",
    location: "Vishnumaya Swami – Karimkutty Swami",
  },
  {
    id: 3,
    slug: "sri-mahadeva-temple",
    title: "Bhadrakali Temple",
    short_description: "",
    featured_image: null,
    display_order: 3,
    full_description: "",
    location: "",
  },
];

const GRADIENTS = [
  "from-[#f6e3c2] to-[#e8c48a]",
  "from-[#f0d4b8] to-[#e0b07a]",
  "from-[#efe0c4] to-[#d9b87a]",
];

function templeKind(title: string) {
  const key = title.toLowerCase();
  if (/hanuman|ganapathi|ganesha/.test(key)) return "Hanuman";
  if (/vishnumaya|vishnu/.test(key)) return "Vishnumaya";
  if (/bhadrakali|devi|durga/.test(key)) return "Devi";
  if (/shiva|mahadeva/.test(key)) return "Shiva";
  return "Temple";
}

export function TempleNamesSlider({ vendors = [] }: { vendors?: Vendor[] }) {
  const { t } = usePrefs();
  const temples = useLocalizedList(
    withCurrentTemplePosts(useJuList<Vendor>("/vendors", vendors.length ? vendors : FALLBACK_TEMPLES, true)),
  );
  if (!temples.length) return null;

  const stream = [...temples, ...temples, ...temples, ...temples];

  return (
    <div id="pooja-temples" className="scroll-mt-36">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold tracking-[0.14em] text-[#B5A48A] uppercase">
          {t("temple.marquee")}
        </span>
        <span className="hidden text-[11px] text-[#C3B49A] md:inline">{t("review.pause")}</span>
      </div>
      <div className="review-marquee-mask relative overflow-hidden rounded-[20px] border border-[#EAD9B0] bg-white/70 backdrop-blur">
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-16 bg-linear-to-r from-[#FFFBF0] to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-linear-to-l from-[#FFFBF0] to-transparent" />
        <div className="review-marquee flex w-max gap-3 px-3 py-3.5">
          {stream.map((temple, index) => {
            const src = liveCatalogPhoto("temple", temple.slug, imageSrc(temple.featured_image));
            const initial = (temple.title || "T").trim().charAt(0).toUpperCase();
            const kind = templeKind(temple.title || "");
            return (
              <div
                key={`${temple.slug || temple.id}-${index}`}
                className="flex shrink-0 items-center gap-3 rounded-full border border-[#EAD9B0] bg-white py-1.5 pr-4 pl-1.5 shadow-[0_1px_0_#EAD9B0]"
              >
                {src ? (
                  <img
                    src={src}
                    alt=""
                    className="h-7 w-7 rounded-full border border-white object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border border-white bg-linear-to-br ${GRADIENTS[index % GRADIENTS.length]} text-[11px] font-bold text-[#5A3D1E]`}
                  >
                    {initial}
                  </div>
                )}
                <span className="max-w-[280px] truncate text-[13px] font-medium text-[#4A3D2E]">{temple.title}</span>
                <span className="rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#8C6F3A] uppercase">
                  {kind}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
