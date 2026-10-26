"use client";

import Link from "next/link";
import { ghostBtn, ModalShell } from "@/components/portal/ModalShell";
import { POOJAS_PATH, PRODUCTS_PATH } from "@/lib/siteRoutes";

const CARDS = [
  {
    href: "/astrologers",
    emoji: "🔮",
    title: "Astrologers",
    copy: "You can connect with our astrologers for kundli, prashna, and personal guidance.",
  },
  {
    href: PRODUCTS_PATH,
    emoji: "📿",
    title: "Spiritual products",
    copy: "You can purchase spiritual products, yantras, and pooja items.",
  },
  {
    href: POOJAS_PATH,
    emoji: "🪔",
    title: "Poojas",
    copy: "You can book pooja and homam with a priest, live from temple.",
  },
  {
    href: "/religious-travel",
    emoji: "🛕",
    title: "Religious travel",
    copy: "You can book religious travel with temple yatra, stay, and darshan notes.",
  },
] as const;

export function ServicesWelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell eyebrow="Our services" title="Find your path" onClose={onClose} wide>
      <p className="mb-5 text-sm leading-relaxed text-on-surface-variant">
        Four ways to begin. Pick one, or close this and browse freely.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((card) => (
          <article
            key={card.href}
            className="flex h-full flex-col rounded-2xl border border-[#EAD9B0] bg-white/90 p-4 shadow-[0_8px_24px_rgba(46,32,12,0.08)]"
          >
            <p className="text-2xl" aria-hidden>
              {card.emoji}
            </p>
            <h3 className="mt-2 font-serif text-xl text-primary">{card.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-on-surface-variant">{card.copy}</p>
            <Link
              href={card.href}
              onClick={onClose}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary-container px-4 py-2.5 text-sm font-bold text-on-primary transition hover:brightness-95"
            >
              Explore
            </Link>
          </article>
        ))}
      </div>
      <button type="button" onClick={onClose} className={`${ghostBtn} mt-4`}>
        Close
      </button>
    </ModalShell>
  );
}
