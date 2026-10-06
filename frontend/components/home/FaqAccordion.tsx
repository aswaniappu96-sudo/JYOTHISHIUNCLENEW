"use client";

import { useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { FaqItem } from "@/types/wordpress";

const FAQ_KEYS = [
  { id: 1, q: "faq.q1", a: "faq.a1" },
  { id: 2, q: "faq.q2", a: "faq.a2" },
  { id: 3, q: "faq.q3", a: "faq.a3" },
  { id: 4, q: "faq.q4", a: "faq.a4" },
  { id: 5, q: "faq.q5", a: "faq.a5" },
  { id: 6, q: "faq.q6", a: "faq.a6" },
  { id: 7, q: "faq.q7", a: "faq.a7" },
] as const;

export function FaqAccordion({ faqs: _faqs }: { faqs?: FaqItem[] }) {
  const { t } = usePrefs();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-serif text-[22px] font-bold tracking-[-0.01em] text-[#1E160E]">{t("enquiry.faqTitle")}</h2>
        <p className="mt-1.5 text-[13px] text-[#8A7E70]">{t("enquiry.faqCopy")}</p>
      </div>
      <div className="space-y-3">
        {FAQ_KEYS.map((faq) => {
          const isOpen = open === faq.id;
          return (
            <div
              key={faq.id}
              className={`group relative rounded-[14px] border bg-white transition-all ${
                isOpen
                  ? "border-[#EAD9B0] bg-[#FFFBF0] shadow-[0_4px_16px_rgba(166,122,59,0.08)]"
                  : "border-[#EAD9B0]/80 hover:border-[#EAD9B0] hover:shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
              }`}
            >
              <button
                type="button"
                suppressHydrationWarning
                className="flex w-full items-start justify-between gap-4 px-4 py-3.5 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : faq.id)}
              >
                <span className="text-[14px] font-[650] leading-[1.4] text-[#1E160E]">{t(faq.q)}</span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[13px] transition-all ${
                    isOpen
                      ? "rotate-45 border-[#A67A3B] bg-[#A67A3B] text-white"
                      : "border-[#EAD9B0] bg-[#FFFBF0] text-[#A67A3B] group-hover:bg-[#F5EBD8]"
                  }`}
                >
                  +
                </span>
              </button>
              <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="px-4 pt-0 pb-4">
                    <div className="mb-3 h-px w-full bg-[#EAD9B0]/60" />
                    <p className="text-[13px] leading-[1.65] text-[#6B6055]">{t(faq.a)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
