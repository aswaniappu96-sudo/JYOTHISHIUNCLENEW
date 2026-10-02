"use client";

import { useEffect, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { stripPublicPrices } from "@/lib/html";
import { useJuList } from "@/lib/useJuList";
import type { FaqItem } from "@/types/wordpress";

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const { t } = usePrefs();
  const list = useJuList<FaqItem>("/faqs", faqs);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open == null && list[0]) {
      setOpen(list[0].id);
    }
  }, [list, open]);

  if (!list.length) return null;

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-serif text-[22px] font-bold tracking-[-0.01em] text-[#1E160E]">{t("enquiry.faqTitle")}</h2>
        <p className="mt-1.5 text-[13px] text-[#8A7E70]">{t("enquiry.faqCopy")}</p>
      </div>
      <div className="space-y-3">
        {list.map((faq) => {
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
                <span className="text-[14px] font-[650] leading-[1.4] text-[#1E160E]">{faq.question}</span>
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
                    <div
                      className="prose-ju text-[13px] leading-[1.65] text-[#6B6055]"
                      dangerouslySetInnerHTML={{ __html: stripPublicPrices(faq.answer || "") }}
                    />
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
