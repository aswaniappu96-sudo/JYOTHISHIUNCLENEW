"use client";

import { Noto_Sans_Malayalam } from "next/font/google";

const malayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  weight: ["500", "700"],
  display: "swap",
});

const RASHIS = [
  { slug: "chingam", mal: "ചിങ്ങം", name: "Chingam", en: "Leo" },
  { slug: "kanni", mal: "കന്നി", name: "Kanni", en: "Virgo" },
  { slug: "thulam", mal: "തുലാം", name: "Thulam", en: "Libra" },
  { slug: "vrischikam", mal: "വൃശ്ചികം", name: "Vrischikam", en: "Scorpio" },
  { slug: "dhanu", mal: "ധനു", name: "Dhanu", en: "Sagittarius" },
  { slug: "makaram", mal: "മകരം", name: "Makaram", en: "Capricorn" },
  { slug: "kumbham", mal: "കുംഭം", name: "Kumbham", en: "Aquarius" },
  { slug: "meenam", mal: "മീനം", name: "Meenam", en: "Pisces" },
  { slug: "medam", mal: "മേടം", name: "Medam", en: "Aries" },
  { slug: "edavam", mal: "ഇടവം", name: "Edavam", en: "Taurus" },
  { slug: "midhunam", mal: "മിഥുനം", name: "Midhunam", en: "Gemini" },
  { slug: "karkidakam", mal: "കർക്കടകം", name: "Karkidakam", en: "Cancer" },
];

export function HoroscopeBand() {
  const loop = [...RASHIS, ...RASHIS];

  return (
    <section className="relative w-full pt-10 pb-12">
      <div className="rashi-marquee-mask pt-4">
        <div className="rashi-marquee flex w-max gap-8 pr-8">
          {loop.map((rashi, index) => (
            <article key={`${rashi.slug}-${index}`} className="flex w-48 shrink-0 flex-col items-center text-center">
              <div className="h-44 w-44 overflow-hidden rounded-full ring-2 ring-primary/70 shadow-[0_0_36px_rgba(255,224,157,0.28)]">
                <img
                  src={`/rashis/rashi-${rashi.slug}.png?v=3`}
                  alt={`${rashi.name} · ${rashi.en}`}
                  className="h-full w-full object-cover object-[center_68%]"
                />
              </div>
              <p className={`mt-3 text-xl font-bold text-primary ${malayalam.className}`}>{rashi.mal}</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                {rashi.name} · {rashi.en}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
