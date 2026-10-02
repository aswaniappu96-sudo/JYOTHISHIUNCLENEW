"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { POOJAS_PATH, PRODUCTS_PATH } from "@/lib/siteRoutes";

const TILE_W = 190;

const TILES = [
  { id: "kundli", href: "/#all-services", emoji: "📜", line1: "qs.kundli1", line2: "qs.kundli2" },
  { id: "horoscope", href: "/#horoscope", emoji: "☀️", line1: "qs.daily1", line2: "qs.daily2" },
  { id: "yatra", href: "/religious-travel", emoji: "🛕", line1: "qs.yatra1", line2: "qs.yatra2" },
  { id: "pooja", href: POOJAS_PATH, emoji: "🪔", line1: "qs.pooja1", line2: "qs.pooja2" },
  { id: "video", href: "/#consultation", emoji: "📹", line1: "qs.video1", line2: "qs.video2" },
  { id: "products", href: PRODUCTS_PATH, emoji: "📿", line1: "qs.store1", line2: "qs.store2" },
  { id: "prashna", href: "/#all-services", emoji: "❓", line1: "qs.prashna1", line2: "qs.prashna2" },
  { id: "matchmaking", href: "/#all-services", emoji: "💞", line1: "qs.match1", line2: "qs.match2" },
] as const;

export function QuickServicesSection() {
  const { t } = usePrefs();
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [grabbing, setGrabbing] = useState(false);
  const drag = useRef({ startX: 0, scrollLeft: 0, down: false, moved: false });
  const skipNav = useRef(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      setActive(Math.min(Math.round(el.scrollLeft / TILE_W), TILES.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const nudge = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * (scroller.current.clientWidth * 0.6), behavior: "smooth" });
  };

  const onPointerDown = (event: React.PointerEvent) => {
    const el = scroller.current;
    if (!el) return;
    skipNav.current = false;
    drag.current = { startX: event.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, down: true, moved: false };
    setGrabbing(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!drag.current.down) return;
    const el = scroller.current;
    if (!el) return;
    const delta = event.pageX - el.offsetLeft - drag.current.startX;
    if (Math.abs(delta) > 6) {
      drag.current.moved = true;
      skipNav.current = true;
    }
    el.scrollLeft = drag.current.scrollLeft - delta * 1.2;
  };

  const endDrag = (event: React.PointerEvent) => {
    drag.current.down = false;
    setGrabbing(false);
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      /* already released */
    }
  };

  return (
    <section id="quick-services" className="relative w-full overflow-hidden scroll-mt-36 py-10 md:py-14">
      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]">
        <div className="mb-5 flex items-end justify-between gap-4 md:mb-7">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FBF0D9]">
                <span className="text-[11px]">✦</span>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9A8560]">{t("qs.kicker")}</p>
            </div>
            <PageHeading lead={t("qs.lead")} accent={t("qs.accent")} />
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-1.5 rounded-full border border-[#EAD9B0]/80 bg-white px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#A68C6A] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <span className="opacity-60">←</span> {t("qs.drag")} <span className="opacity-60">→</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => nudge(-1)}
                aria-label="Previous"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAD9B0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition hover:bg-[#FFFDf5] active:scale-[0.98]"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                aria-label="Next"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1E160E] bg-[#1E160E] text-white shadow-[0_4px_14px_rgba(30,22,14,0.18)] transition hover:bg-[#2a2118] active:scale-[0.98]"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-[#fff8ec] to-transparent md:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-[#fff8ec] to-transparent md:w-20" />
          <div
            ref={scroller}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className={`no-scrollbar -my-3 flex snap-x snap-mandatory touch-pan-y select-none gap-3 overflow-x-auto scroll-smooth py-3 pr-6 md:gap-[14px] ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}
          >
            {TILES.map((tile, index) => (
              <ServiceTile
                key={tile.id}
                emoji={tile.emoji}
                href={tile.href}
                index={index}
                line1={t(tile.line1)}
                line2={t(tile.line2)}
                skipClickRef={skipNav}
              />
            ))}
            <div className="w-6 shrink-0 md:w-2" />
          </div>

          <div className="mt-5 flex items-center justify-between md:hidden">
            <div className="rounded-full border border-[#EAD9B0]/80 bg-white px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#A68C6A] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              ← {t("qs.drag")} →
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => nudge(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EAD9B0] bg-white shadow-sm">
                ←
              </button>
              <button type="button" onClick={() => nudge(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1E160E] bg-[#1E160E] text-white shadow-md">
                →
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 md:mt-5 md:justify-start">
            {TILES.map((tile, index) => (
              <button
                key={tile.id}
                type="button"
                aria-label={`Go to ${index + 1}`}
                onClick={() => scroller.current?.scrollTo({ left: index * TILE_W, behavior: "smooth" })}
                className={`h-1.5 rounded-full transition-all duration-300 ${active === index ? "w-6 bg-[#1E160E]" : "w-1.5 bg-[#EAD9B0] hover:bg-[#D9B07A]"}`}
              />
            ))}
            <span className="ml-3 hidden text-[10px] font-medium uppercase tracking-wide text-[#B8A183] md:inline">
              {active + 1} / {TILES.length}
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[11px] text-[#9A8560] md:mt-10">
          <div className="h-px w-8 bg-[#EAD9B0]" />
          <span className="tracking-wide">{t("qs.foot")}</span>
        </div>
      </div>
    </section>
  );
}

function ServiceTile({
  emoji,
  href,
  index,
  line1,
  line2,
  skipClickRef,
}: {
  emoji: string;
  href: string;
  index: number;
  line1: string;
  line2: string;
  skipClickRef: React.MutableRefObject<boolean>;
}) {
  const [spark, setSpark] = useState(false);

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (skipClickRef.current) {
          event.preventDefault();
          return;
        }
        setSpark(true);
        window.setTimeout(() => setSpark(false), 900);
      }}
      className="group relative w-[168px] shrink-0 snap-start text-left md:w-[176px]"
    >
      <div
        className={`relative h-[124px] overflow-hidden rounded-[16px] border border-[#EAD9B0] bg-white shadow-[0_2px_12px_rgba(30,22,14,0.06),0_0_0_1px_rgba(234,217,176,0.3)_inset] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:border-[#D9C08F] group-hover:shadow-[0_10px_28px_rgba(30,22,14,0.12),0_0_0_1px_rgba(234,217,176,0.5)_inset] md:h-[128px] ${spark ? "scale-[0.97]" : ""}`}
      >
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
          <div className="qs-shine absolute top-0 bottom-0 w-[55%] bg-linear-to-r from-transparent via-white/70 to-transparent" style={{ animationDelay: `${index * 0.35}s`, left: "-30%" }} />
        </div>
        <span className="pointer-events-none absolute select-none text-[10px]" style={{ left: 42, top: 14, animation: "qs-twinkle 2.2s ease-in-out infinite, qs-float 2.2s ease-in-out infinite", animationDelay: `${index * 0.2}s` }}>
          ✨
        </span>
        <span className="pointer-events-none absolute select-none text-[7px] opacity-80" style={{ left: 88, top: 22, animation: "qs-twinkle 2.8s ease-in-out infinite", animationDelay: `${0.6 + index * 0.15}s` }}>
          ✦
        </span>
        <span className="pointer-events-none absolute select-none text-[8px]" style={{ right: 34, top: 38, animation: "qs-twinkle 2.4s ease-in-out infinite", animationDelay: `${1.1 + index * 0.18}s` }}>
          ✧
        </span>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-linear-to-b from-white to-transparent opacity-70" />
        <div className="absolute top-[10px] right-[10px] z-20 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#E7C9A0] bg-[#D9B07A] shadow-[0_2px_6px_rgba(217,176,122,0.35)] transition-all duration-300 group-hover:scale-[1.06] group-hover:rotate-45 group-hover:bg-[#D0A46E]">
          <span className="text-[12px] leading-none font-bold text-[#1E160E]">→</span>
        </div>
        <div className="absolute top-3 left-3">
          <div className="relative flex h-[38px] w-[38px] items-center justify-center rounded-[11px] border border-[#F0DEB3]/80 bg-[#FBF0D9] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)]">
            <span className="text-[18px] leading-none">{emoji}</span>
            <div className="pointer-events-none absolute inset-0 rounded-[11px] bg-linear-to-br from-white/80 via-transparent to-transparent opacity-60" />
          </div>
        </div>
        <div className="absolute right-3 bottom-3 left-3">
          <div className="flex flex-col gap-px">
            <span className="text-[13px] leading-[1.15] font-bold tracking-[-0.01em] text-[#1E160E]">{line1}</span>
            <span className="text-[13px] leading-[1.15] font-semibold tracking-[-0.01em] text-[#1E160E]">{line2}</span>
          </div>
          <div className="mt-1.5 h-[2px] w-0 rounded-full bg-[#E7C08A] transition-all duration-300 group-hover:w-[22px]" />
        </div>
        {spark ? <div className="pointer-events-none absolute inset-0 animate-[qs-twinkle_0.6s_ease] bg-[#FBF0D9]/50" /> : null}
      </div>
      <div className="mx-auto mt-1.5 h-1 w-[40%] rounded-full bg-[#EAD9B0]/50 opacity-0 blur-[2px] transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
}
