"use client";

import { useEffect, type RefObject } from "react";

const played = new WeakSet<Element>();
let stagger = 0;
let observer: IntersectionObserver | null = null;

function play(el: HTMLElement) {
  el.classList.remove("brand-mark-flash");
  void el.offsetWidth;
  el.classList.add("brand-mark-flash");
}

function stillReading(el: HTMLElement) {
  const box = el.getBoundingClientRect();
  return box.bottom > window.innerHeight * 0.12 && box.top < window.innerHeight * 0.82;
}

function flash(el: HTMLElement) {
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
}

function sharedObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
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
  return observer;
}

export function armBrandMark(el: HTMLElement) {
  sharedObserver().observe(el);
  return () => sharedObserver().unobserve(el);
}

export function useBrandFlash(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return armBrandMark(el);
  }, [ref]);
}
