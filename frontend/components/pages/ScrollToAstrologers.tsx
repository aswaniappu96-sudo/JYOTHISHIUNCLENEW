"use client";

import { useEffect } from "react";

function scrollToAstrologerCards() {
  const node = document.getElementById("astrologer-cards");
  if (!node) return;
  const header = document.querySelector("header");
  const offset = (header?.getBoundingClientRect().height || 72) + 16;
  const top = node.getBoundingClientRect().top + window.scrollY - offset;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
}

export function ScrollToAstrologers() {
  useEffect(() => {
    let done = false;
    let timer = 0;
    const go = () => {
      if (done) return;
      done = true;
      timer = window.setTimeout(scrollToAstrologerCards, 60);
    };
    window.addEventListener("ju-astrologer-welcome-closed", go);
    return () => {
      window.removeEventListener("ju-astrologer-welcome-closed", go);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
