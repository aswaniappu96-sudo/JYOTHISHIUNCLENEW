import { AstrologerCard, PORTRAITS } from "@/components/pages/AstrologerCard";
import { PageHeading } from "@/components/home/SectionHeading";
import { Eyebrow } from "@/components/pages/PageHero";
import { decodeWpText } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import type { Astrologer, WPPage } from "@/types/wordpress";

export { PORTRAITS };

export function AstrologersHero({ page }: { page?: WPPage | null }) {
  const heroImage = imageSrc(page?.featured_image);
  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-8 text-center md:px-12">
      {heroImage ? <img src={heroImage} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" /> : null}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-secondary-container/20 blur-[140px]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center">
        <Eyebrow className="mb-4">{decodeWpText(page?.eyebrow || "Parashara & Surya Siddhanta Lineage · Revered Jyothishis")}</Eyebrow>
        <PageHeading as="h1" title={decodeWpText(page?.title || "Hereditary Vedic Astrologers & Cosmic Gurus")} className="max-w-4xl" />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-on-surface-variant">
          {decodeWpText(
            page?.hero_copy ||
              "Connect in sacred 1-on-1 communion with enlightened masters of Ashtamangala Prashnam, Jathaka Shastra, and Nadi palm leaf wisdom. Every consultation is strictly confidential and spiritually sanctified.",
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {["Surya Siddhanta Ephemeris Core", "Private Sankalpa Audio & Video Chambers", "Centuries of Familial Gurukula Heritage"].map(
            (item) => (
              <span key={item} className="rounded-full bg-surface-low px-3 py-1 text-xs text-on-surface shadow-sm">
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export function AstrologerGrid({
  astrologers,
  phone,
  whatsapp,
}: {
  astrologers: Astrologer[];
  phone?: string;
  whatsapp?: string;
}) {
  const cards = astrologers.length
    ? astrologers.map((person, i) => ({ person, meta: PORTRAITS[i % PORTRAITS.length] }))
    : PORTRAITS.map((meta, i) => ({
        person: {
          id: i,
          slug: `astrologer-${i + 1}`,
          title: "",
          short_description: "",
          specialty: "",
          full_description: "",
          first_session_note: "First call and chat are free.",
          featured_image: null,
          display_order: i,
        } as Astrologer,
        meta,
      }));

  return (
    <section className="px-4 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Verified Living Masters</span>
            <PageHeading title="Sacred Consultation Lineage" className="mt-1" />
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span>Synchronized to Lahiri Ayanamsha:</span>
            <span className="rounded bg-surface-high px-2.5 py-1 text-primary">24° 11&apos; 36&quot;</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ person, meta }) => (
            <AstrologerCard
              key={person.id || meta.location}
              person={person}
              meta={meta}
              phone={phone}
              whatsapp={whatsapp}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function JyotishaWisdom() {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-12">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-secondary">Jyotishya Vedanga Shastra</span>
        <PageHeading title="The Timeless Wisdom of Jyotisha: Eye of the Vedas" className="mt-1" />
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          Jyotisha is not fatalistic fortune-telling; it is celestial illumination (Jyoti = Divine Light). It maps the
          vibrational architecture through which consciousness journeys into physical reality.
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {[
          ["Karmic Geometries", "Karma & The 12 Bhavas", "Every natal chart is a metaphysical mirror of your Prarabdha Karma (the ripened portion of your cosmic ledger). The 12 houses map the interplay between pre-ordained soul trajectories and your divine Purushartha (conscious free will).", "Tanubhava to Mokshabhava", "12 Sacred Anchors"],
          ["Temporal Mechanics", "Dasha-Bukthi Planetary Clock", "The 120-year Vimshottari Dasha system behaves as a precise biological and spiritual chronometer. Learn why certain years trigger sudden dharmic awakenings, fortune, or necessary karmic friction.", "Vimshottari 120-Yr Cycle", "Nakshatra Lords"],
          ["Harmonizing Science", "Authentic Parihara Remedies", "True Vedic remedial measures never foster fear. Through sound resonance (Mantra Japa), sacred fire ceremonies (Homams), certified gems, and Dana, afflicted planetary frequencies are neutralized naturally.", "Zero Superstition Mandate", "Vedic Tantra Sastra"],
        ].map(([k, title, copy, left, right]) => (
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
