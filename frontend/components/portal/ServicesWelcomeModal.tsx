"use client";

import { useEffect } from "react";
import Link from "next/link";
import { POOJAS_PATH, PRODUCTS_PATH } from "@/lib/siteRoutes";

const LEAVES = [
  {
    href: "/astrologers",
    title: "Astrologers",
    script: "ज्योतिष",
    copy: "Connect with expert astrologers for kundli, prashna, and personal guidance.",
    image: "/images/astrologers/page-1.jpg",
    focus: "object-[center_20%]",
  },
  {
    href: PRODUCTS_PATH,
    title: "Spiritual Products",
    script: "आध्यात्मिक",
    copy: "Blessed yantras, rudraksha, incense, and authentic pooja essentials.",
    image: "/images/hero/banner-products.jpg",
    focus: "object-[78%_center]",
  },
  {
    href: POOJAS_PATH,
    title: "Poojas",
    script: "पूजा",
    copy: "Book authentic pooja and homam with a priest, live from temple.",
    image: "/images/hero/banner-pooja.jpg",
    focus: "object-[82%_center]",
  },
  {
    href: "/religious-travel",
    title: "Religious Travel",
    script: "यात्रा",
    copy: "Embark on divine journeys with temple yatra, stay, and darshan guidance.",
    image: "/images/hero/banner-temple.jpg",
    focus: "object-[80%_center]",
  },
] as const;

export function ServicesWelcomeModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const html = document.documentElement;
    const previousHtml = html.style.overflow;
    const previousBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previousHtml;
      document.body.style.overflow = previousBody;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto bg-[#1a120c]/55 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="services-welcome-title"
      onClick={onClose}
    >
      <div
        className="thaliola-sheet relative flex max-h-[92vh] w-full max-w-[860px] flex-col overflow-hidden rounded-[28px] border border-[#e6d3b0] shadow-[0_30px_80px_rgba(28,16,6,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <svg className="pointer-events-none absolute -top-8 -right-10 h-64 w-64 text-[#c4a36a]/25" viewBox="0 0 200 200" aria-hidden>
          <g fill="none" stroke="currentColor" strokeWidth="0.7">
            {Array.from({ length: 8 }).map((_, index) => (
              <circle key={index} cx="100" cy="100" r={18 + index * 12} />
            ))}
            {Array.from({ length: 12 }).map((_, index) => {
              const angle = (index * 30 * Math.PI) / 180;
              return (
                <line
                  key={`ray-${index}`}
                  x1={(100 + Math.cos(angle) * 16).toFixed(2)}
                  y1={(100 + Math.sin(angle) * 16).toFixed(2)}
                  x2={(100 + Math.cos(angle) * 96).toFixed(2)}
                  y2={(100 + Math.sin(angle) * 96).toFixed(2)}
                />
              );
            })}
          </g>
        </svg>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#e4d3b4] bg-[#f7f1e6]/80 text-lg text-[#8a7358] transition hover:text-[#3d2b1c]"
          aria-label="Close"
        >
          ×
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-7">

        <p className="text-[11px] font-semibold tracking-[0.28em] text-[#9a8064] uppercase">Our services</p>
        <h2
          id="services-welcome-title"
          className="mt-2 pr-10 text-[2.15rem] leading-none text-[#3c2a1c] sm:text-5xl"
          style={{ fontFamily: "var(--font-brand), Cinzel, serif" }}
        >
          Find your path
        </h2>
        <p className="mt-3 max-w-xl text-sm text-[#8d7b68] sm:text-[15px]">
          Four sacred paths begin here. Choose one to explore.
        </p>

        <div className="relative mt-6">
          <div className="pointer-events-none absolute top-5 bottom-5 left-[11px] border-l border-dashed border-[#7a5a32]/70" aria-hidden />
          <ul className="relative space-y-3">
            {LEAVES.map((leaf) => (
              <li key={leaf.href} className="relative pl-7">
                <span
                  className="absolute top-1/2 left-[5px] z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-[#f6efe2] bg-[#4a3424] shadow-[inset_0_0_0_2px_#c6a56a]"
                  aria-hidden
                />
                <article className="thaliola-leaf relative grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-[18px] py-3 pr-7 pl-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-x-4 sm:py-3.5 sm:pr-9 sm:pl-4">
                  <span
                    className="absolute top-1/2 right-2.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#3f2d1d] ring-2 ring-[#d9c29a]"
                    aria-hidden
                  />
                  <img
                    src={leaf.image}
                    alt=""
                    className={`col-start-1 row-start-1 h-16 w-16 rounded-xl object-cover shadow-[0_4px_10px_rgba(62,40,16,0.18)] sm:row-span-2 sm:h-[72px] sm:w-[72px] ${leaf.focus}`}
                  />
                  <h3
                    className="col-start-2 row-start-1 text-[1.05rem] leading-tight text-[#3d2a1c] sm:self-end sm:text-[1.35rem]"
                    style={{ fontFamily: "var(--font-brand), Cinzel, serif" }}
                  >
                    {leaf.title}{" "}
                    <span className="ml-1 align-middle text-sm font-medium text-[#a08b72]" style={{ fontFamily: '"Noto Serif Devanagari", serif' }}>
                      {leaf.script}
                    </span>
                  </h3>
                  <p className="col-span-2 col-start-1 row-start-2 text-[13px] leading-snug text-[#6f5e4e] sm:col-span-1 sm:col-start-2 sm:self-start sm:text-sm">
                    {leaf.copy}
                  </p>
                  <Link
                    href={leaf.href}
                    onClick={onClose}
                    className="col-span-2 col-start-1 row-start-3 inline-flex w-fit items-center justify-self-end gap-1.5 rounded-full bg-[#e4c48a] px-4 py-2 text-[11px] font-bold tracking-[0.14em] text-[#3d2a14] shadow-[inset_0_1px_0_rgba(255,248,230,0.7)] transition hover:bg-[#dcb56e] sm:col-span-1 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:self-center"
                  >
                    EXPLORE
                    <span aria-hidden>→</span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 text-xs text-[#a08b72]">Choose a sacred leaf</p>
        </div>
      </div>
    </div>
  );
}
