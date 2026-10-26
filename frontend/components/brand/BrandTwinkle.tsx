"use client";

import { useEffect } from "react";

export function BrandTwinkle() {
  useEffect(() => {
    const played = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (!entry.isIntersecting) {
            if (entry.intersectionRatio === 0) played.delete(el);
            continue;
          }
          if (played.has(el)) continue;
          played.add(el);
          el.classList.remove("brand-mark-flash");
          void el.offsetWidth;
          el.classList.add("brand-mark-flash");
        }
      },
      { threshold: [0, 0.7] },
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
