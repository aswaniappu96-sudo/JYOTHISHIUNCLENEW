"use client";

import { useEffect } from "react";

export function BrandTwinkle() {
  useEffect(() => {
    const played = new WeakSet<Element>();
    let stagger = 0;

    const play = (el: HTMLElement) => {
      el.classList.remove("brand-mark-flash");
      void el.offsetWidth;
      el.classList.add("brand-mark-flash");
    };

    const stillReading = (el: HTMLElement) => {
      const box = el.getBoundingClientRect();
      return box.bottom > window.innerHeight * 0.12 && box.top < window.innerHeight * 0.82;
    };

    const flash = (el: HTMLElement) => {
      if (played.has(el)) return;
      played.add(el);
      const delay = stagger * 140;
      stagger += 1;
      window.setTimeout(() => {
        stagger = Math.max(0, stagger - 1);
        if (!el.isConnected) return;
        play(el);
        window.setTimeout(() => {
          if (el.isConnected && stillReading(el)) play(el);
        }, 1600);
      }, delay);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (!entry.isIntersecting) {
            if (entry.intersectionRatio === 0) played.delete(el);
            continue;
          }
          flash(el);
        }
      },
      { rootMargin: "-12% 0px -18% 0px", threshold: 0.55 },
    );

    const seen = new WeakSet<Element>();
    const watch = () => {
      document.querySelectorAll(".brand-mark").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };

    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
