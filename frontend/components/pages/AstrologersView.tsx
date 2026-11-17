"use client";

import { AstrologerTalkBoard } from "@/components/pages/AstrologerTalkBoard";
import { PageHeading, SectionEyebrow } from "@/components/home/SectionHeading";
import { useLocalizedPage } from "@/lib/localized";
import { PORTRAITS } from "@/lib/astrologer-display";
import type { Astrologer, WPPage } from "@/types/wordpress";
import type { ReactNode } from "react";

export { PORTRAITS };

const DEFAULT_WISDOM: [string, string, string, string, string][] = [
  [
    "Karmic Geometries",
    "Karma & The 12 Bhavas",
    "Every natal chart is a metaphysical mirror of your Prarabdha Karma (the ripened portion of your cosmic ledger). The 12 houses map the interplay between pre-ordained soul trajectories and your divine Purushartha (conscious free will).",
    "Tanubhava to Mokshabhava",
    "12 Sacred Anchors",
  ],
  [
    "Temporal Mechanics",
    "Dasha-Bukthi Planetary Clock",
    "The 120-year Vimshottari Dasha system behaves as a precise biological and spiritual chronometer. Learn why certain years trigger sudden dharmic awakenings, fortune, or necessary karmic friction.",
    "Vimshottari 120-Yr Cycle",
    "Nakshatra Lords",
  ],
  [
    "Harmonizing Science",
    "Authentic Parihara Remedies",
    "True Vedic remedial measures never foster fear. Through sound resonance (Mantra Japa), sacred fire ceremonies (Homams), certified gems, and Dana, afflicted planetary frequencies are neutralized naturally.",
    "Zero Superstition Mandate",
    "Vedic Tantra Sastra",
  ],
];

export function AstrologerGrid({
  astrologers,
  phone,
  whatsapp,
  afterIntro,
}: {
  astrologers: Astrologer[];
  phone?: string;
  whatsapp?: string;
  afterIntro?: ReactNode;
}) {
  return (
    <AstrologerTalkBoard
      id="astrologers"
      astrologers={astrologers}
      phone={phone}
      whatsapp={whatsapp}
      photo="full"
      headingAs="h1"
      showProof
      afterIntro={afterIntro}
    />
  );
}

export function JyotishaWisdom({ page }: { page?: WPPage | null }) {
  const loc = useLocalizedPage(page);
  const cards: [string, string, string, string, string][] = [
    [
      loc?.wisdom_1_kicker || DEFAULT_WISDOM[0][0],
      loc?.wisdom_1_title || DEFAULT_WISDOM[0][1],
      loc?.wisdom_1_copy || DEFAULT_WISDOM[0][2],
      loc?.wisdom_1_left || DEFAULT_WISDOM[0][3],
      loc?.wisdom_1_right || DEFAULT_WISDOM[0][4],
    ],
    [
      loc?.wisdom_2_kicker || DEFAULT_WISDOM[1][0],
      loc?.wisdom_2_title || DEFAULT_WISDOM[1][1],
      loc?.wisdom_2_copy || DEFAULT_WISDOM[1][2],
      loc?.wisdom_2_left || DEFAULT_WISDOM[1][3],
      loc?.wisdom_2_right || DEFAULT_WISDOM[1][4],
    ],
    [
      loc?.wisdom_3_kicker || DEFAULT_WISDOM[2][0],
      loc?.wisdom_3_title || DEFAULT_WISDOM[2][1],
      loc?.wisdom_3_copy || DEFAULT_WISDOM[2][2],
      loc?.wisdom_3_left || DEFAULT_WISDOM[2][3],
      loc?.wisdom_3_right || DEFAULT_WISDOM[2][4],
    ],
  ];

  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-12">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <SectionEyebrow className="justify-center">{loc?.wisdom_eyebrow || "Jyotishya Vedanga Shastra"}</SectionEyebrow>
        <PageHeading
          title={loc?.wisdom_title || "The Timeless Wisdom of Jyotisha: Eye of the Vedas"}
          className="mt-1"
        />
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          {loc?.wisdom_copy ||
            "Jyotisha is not fatalistic fortune-telling; it is celestial illumination (Jyoti = Divine Light). It maps the vibrational architecture through which consciousness journeys into physical reality."}
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map(([k, title, copy, left, right]) => (
          <article key={title} className="flex flex-col justify-between rounded-xl bg-surface-low p-6 shadow-xl">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">{k}</span>
              <h3 className="mt-1 mb-2 font-serif text-[22px] text-on-surface">{title}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">{copy}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-outline-variant/20 pt-3 text-xs text-on-surface-variant">
              <span>{left}</span>
              <span className="text-primary">{right}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
