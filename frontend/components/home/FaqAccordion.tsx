"use client";

import { useState } from "react";
import type { FaqItem } from "@/types/wordpress";
import { SectionHeading } from "@/components/home/SectionHeading";

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(faqs[0]?.id ?? null);

  return (
    <section id="faq" className="relative my-8 w-full px-4 py-12 md:px-12">
      <SectionHeading
        eyebrow="Sacred Inquiries & Clarity"
        title="Cosmic Queries & Clarity"
        copy="Questions families often ask about consultation, pooja, and travel."
      />
      <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-2">
        {faqs.map((faq, index) => {
          const isOpen = open === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl bg-surface-low/80 p-4 shadow-md backdrop-blur-2xl transition ${
                isOpen ? "bg-surface-high/60 shadow-[0_0_20px_rgba(229,195,120,0.15)]" : ""
              }`}
            >
              <button
                type="button"
                suppressHydrationWarning
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : faq.id)}
              >
                <span className="flex items-center gap-3 pr-4 font-semibold text-on-surface">
                  <span className="font-serif text-[22px] leading-none text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{faq.question}</span>
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-highest text-primary">
                  {isOpen ? "–" : "+"}
                </span>
              </button>
              {isOpen ? (
                <div
                  className="prose-ju mt-3 border-t border-outline-variant/30 pt-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
