"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { RASHIS } from "@/lib/rashis";

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function RashiChakraBackdrop() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const clipTop = useMotionValue(10000);
  const clipPath = useTransform(clipTop, (top) => `inset(${top}px 0 0 0)`);

  const updateClip = useCallback(() => {
    const hero = document.querySelector("[data-hero]");
    clipTop.set(hero ? Math.max(0, hero.getBoundingClientRect().bottom) : 0);
  }, [clipTop]);

  useEffect(() => {
    updateClip();
    const frame = window.requestAnimationFrame(updateClip);
    window.addEventListener("resize", updateClip);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateClip);
    };
  }, [pathname, updateClip]);

  useMotionValueEvent(scrollY, "change", updateClip);

  const spokes = RASHIS.map((_, i) => {
    const a = polar(200, 200, 186, i * 30);
    return `M200 200 L${a.x.toFixed(1)} ${a.y.toFixed(1)}`;
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
      style={{ clipPath }}
    >
      <div className={`${reduce ? "" : "rashi-chakra-spin"} w-[min(120vw,72rem)] text-primary opacity-[0.06]`}>
        <svg className="aspect-square w-full" fill="none" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="188" stroke="currentColor" strokeWidth="0.9" />
          <circle cx="200" cy="200" r="146" stroke="currentColor" strokeWidth="0.55" />
          <circle cx="200" cy="200" r="88" stroke="currentColor" strokeDasharray="3 7" strokeWidth="0.55" />
          {spokes.map((d) => (
            <path key={d} d={d} stroke="currentColor" strokeWidth="0.35" />
          ))}
          {RASHIS.map((rashi, i) => {
            const p = polar(200, 200, 167, i * 30 + 15);
            return (
              <text key={rashi.slug} fill="currentColor" fontSize="11" textAnchor="middle" x={p.x} y={p.y + 4}>
                {rashi.sa}
              </text>
            );
          })}
          <circle cx="200" cy="200" r="28" stroke="currentColor" strokeWidth="0.7" />
          <text fill="currentColor" fontFamily="serif" fontSize="18" textAnchor="middle" x="200" y="207">
            ॐ
          </text>
        </svg>
      </div>
    </motion.div>
  );
}
