import { AstrologerActions } from "@/components/pages/AstrologerActions";
import { Eyebrow } from "@/components/pages/PageHero";
import { mediaUrl } from "@/lib/api/client";
import { imageSrc } from "@/lib/media";
import type { Astrologer, WPPage } from "@/types/wordpress";

const PORTRAITS = [
  {
    location: "Thrissur, Kerala",
    rating: "4.98",
    status: "Online",
    statusClass: "text-primary",
    image:
      "https://lh3.googleusercontent.com/aida/AEtjO1Voy-pcdyFT9UshkkWHmBAL_GbTTYwCOsaeEyUZPTiIYM3uSCZoVusJWPrMHzr5yPlMXtDLiY8-T3jYBR_VPmVuyw6H9IlF85cBCJ4IQyJfOBCfwiBclf2ScosH86nf4lm7dmkaDBeai6C-nz0GcnGGf11guCJyo-q7ErdC-2Q9E5V8mBjYcS4XXw30kp0uhmjTIiwVnQYc5O9FihpaDTHXhzuZSt7Sp2mIFENNQIW18e2uLv5Pk32lwa7d",
  },
  {
    location: "Varanasi, Uttar Pradesh",
    rating: "4.95",
    status: "Available",
    statusClass: "text-secondary",
    image:
      "https://lh3.googleusercontent.com/aida/AEtjO1WB2rAH0dHvWpR3PhSUu78UEyyIi42-waEZy6IMShkKo7MfCJEBAViEFbM76b_nhvyTQWxqDX6F62rTlDIN2jrbmOu0g08plCBJs3EfJ2GEICIx18tEZwyfl54t6VDCDmviTs0VgqlAkogLj9MDxWmYlcCVv_y9GluYSS8vOn1GcqbPugKmygM7IOUjnhdFFXeJUy3SXiAKBdBUyFS0D5puN4RKscSZYflvKqrGqKa-XYGefWM5hChzlQs6",
  },
  {
    location: "Rameswaram, Tamil Nadu",
    rating: "4.97",
    status: "Online",
    statusClass: "text-tertiary-container",
    image:
      "https://lh3.googleusercontent.com/aida/AEtjO1VGPiTVY-XMVFR8sF2lveyWePLlHmij3LZHqZMptzGZozy3YCnYd6aywg2khwpWYq2ellG7pBal2I9VJK5JrpGIiQWqZ42aTj9Fad6Zo8yvsY0q-ewzT5TXMSc0ZIIKbp0H8VfjnIN1TsO718xD-1hCDBzOl3z5HwcxTW6loFJLF_avzZ6iicc4HlYntZWboRuHof4NxBw9UwYtrp6N7BIjMXDpMWJS_mw8YX7HHKIml3jkRmQcDdoJT21x",
  },
  {
    location: "Ujjain, Madhya Pradesh",
    rating: "4.96",
    status: "Online",
    statusClass: "text-primary",
    image:
      "https://lh3.googleusercontent.com/aida/AEtjO1W38JfQciZ-r6y7ixId-udcuockZPIZZm4c4ma6JwOQzlOtF-F4r80cehKS5w2F4EpaXL5LR1S4KP69GeOThdrGKGnyYiGiJwfJSgQZtNQGCbwqdRg0UM-9R0TUIXKZ7vbhfYy0dtbJFP42ykg-mkka8QuXkbmtHBlwI7XOCOwDPNANxwhIUjelFh3PCw5EGXmoEOpQvcYcT4VG9hl9wtXdESxf9MVzUqtj6h37pQiwfO-OaCm-6hmJ_RCG",
  },
];

export function AstrologersHero({ page }: { page?: WPPage | null }) {
  const heroImage = imageSrc(page?.featured_image);
  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-8 text-center md:px-12">
      {heroImage ? <img src={heroImage} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" /> : null}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-secondary-container/20 blur-[140px]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center">
        <Eyebrow className="mb-4">{page?.eyebrow || "Parashara & Surya Siddhanta Lineage · Revered Jyothishis"}</Eyebrow>
        <h1 className="max-w-4xl font-serif text-[38px] tracking-tight text-primary md:text-[56px] md:leading-[68px]">
          {page?.title || "Hereditary Vedic Astrologers & Cosmic Gurus"}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-on-surface-variant">
          {page?.hero_copy ||
            "Connect in sacred 1-on-1 communion with enlightened masters of Ashtamangala Prashnam, Jathaka Shastra, and Nadi palm leaf wisdom. Every consultation is strictly confidential and spiritually sanctified."}
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

export function AstrologerGrid({ astrologers }: { astrologers: Astrologer[] }) {
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
            <h2 className="mt-1 font-serif text-[32px] text-on-surface">Sacred Consultation Lineage</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span>Synchronized to Lahiri Ayanamsha:</span>
            <span className="rounded bg-surface-high px-2.5 py-1 text-primary">24° 11&apos; 36&quot;</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ person, meta }) => {
            const src = mediaUrl(person.featured_image?.url || person.featured_image?.full) || meta.image;
            return (
              <article
                key={person.id || meta.location}
                className="group flex flex-col justify-between rounded-xl border border-outline-variant/20 bg-surface-low/90 p-4 shadow-2xl backdrop-blur-xl transition hover:shadow-[0_0_35px_-8px_rgba(229,195,120,0.25)]"
              >
                <div>
                  <div className="relative h-72 w-full overflow-hidden rounded-lg bg-surface-lowest">
                    <img alt={person.title || "Vedic Astrologer portrait"} src={src} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-surface-lowest/80 via-transparent to-transparent" />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-primary/30 bg-surface-lowest/90 px-2.5 py-1 backdrop-blur-md">
                      <span className="text-xs text-tertiary-container">★</span>
                      <span className="text-xs font-bold text-on-surface">{meta.rating}</span>
                    </div>
                    {person.title ? (
                      <div className="absolute right-3 bottom-3 left-3">
                        <p className="font-serif text-lg text-primary">{person.title}</p>
                        {person.specialty ? <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">{person.specialty}</p> : null}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-on-surface">{person.location || meta.location}</span>
                    <span className={`flex items-center gap-1.5 text-[11px] font-medium ${meta.statusClass}`}>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                      {meta.status}
                    </span>
                  </div>
                  {person.short_description ? (
                    <p className="mt-2 line-clamp-2 text-xs text-on-surface-variant">{person.short_description}</p>
                  ) : null}
                </div>
                <AstrologerActions />
              </article>
            );
          })}
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
        <h2 className="mt-1 font-serif text-[30px] text-primary md:text-[40px]">The Timeless Wisdom of Jyotisha: Eye of the Vedas</h2>
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
