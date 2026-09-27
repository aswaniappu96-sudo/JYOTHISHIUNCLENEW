"use client";

import { useMemo, useState } from "react";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { TravelCard } from "@/components/cards/TravelCard";
import { ConchIcon } from "@/components/icons/ConchIcon";
import { Eyebrow } from "@/components/pages/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { imageSrc } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";
import type { TravelDestination, WPPage } from "@/types/wordpress";

const PAGE_SIZE = 6;

const STALE_TITLES = new Set(["Temples and sacred places", "Religious travel"]);
const STALE_COPY = "Confirm dates and temple rules locally";

const FILTERS = [
  { id: "all", label: "All Sacred Yatras", match: () => true },
  {
    id: "himalaya",
    label: "Himalayan Sanctuaries",
    match: (hay: string) =>
      /himalay|kailash|kedarnath|badrinath|amarnath|muktinath|mansarovar|gangotri|yamunotri|spiti|ladakh|nepal|tibet|vaishno/i.test(
        hay,
      ),
  },
  {
    id: "jyotirlinga",
    label: "Jyotirlinga Darshana",
    match: (hay: string) =>
      /jyotirling|rameswaram|somnath|mahakaleshwar|ujjain|omkareshwar|grishneshwar|bhimashankar|trimbak|nageshwar|vaidyanath|mallikarjuna|viswanath|vishwanath/i.test(
        hay,
      ),
  },
  {
    id: "navagraha",
    label: "Navagraha Temple Trail",
    match: (hay: string) => /navagraha|graha trail|suryanar|kanjanur|thingalur|alangludi|vaitheeswaran/i.test(hay),
  },
  {
    id: "temples",
    label: "Temple sanctuaries",
    match: (hay: string) => /guruvayur|sabarimala|ayyappa|pathanamthitta|krishna/i.test(hay),
  },
] as const;

const STATS = [
  { value: "12 Peethas", note: "Divine Shakti Peethas" },
  { value: "4 Mahadhams", note: "Primordial Cardinal Sites" },
  { value: "Max 8 Seekers", note: "Intimate Sacred Cohorts" },
  { value: "Vedic Gurus", note: "Astrologer Accompanied" },
];

const UNIQUES = [
  {
    n: "01 · Astro synchronicity",
    title: "Astrologically Calibrated Dates (Muhurtha)",
    copy: "Every departure aligns with celestial transits, Nakshatra yogas, and auspicious Tithis so the journey stays timed to the chart.",
  },
  {
    n: "02 · Garbha-griha access",
    title: "VIP Sanctum Access & No Queues",
    copy: "Direct protocol entry is arranged through hereditary temple trustees, so darshan and sankalpa can happen without crowding.",
  },
  {
    n: "03 · Pure nourishment",
    title: "Sattvic Organic Ayurvedic Diet",
    copy: "Fresh sattvic meals cooked in brass with cold-pressed oils, kept simple so the mind stays clear through the yatra.",
  },
  {
    n: "04 · Hereditary lineage",
    title: "Private Sanctum Sankalpa for Your Gotra",
    copy: "Dedicated purohits offer an individual Gotra sankalpa in your family name at key planetary altars along the route.",
  },
];

function haystack(item: TravelDestination) {
  return [item.title, item.slug, item.location, item.short_description].filter(Boolean).join(" ");
}

export function TravelView({
  destinations,
  page,
  whatsappNumber,
}: {
  destinations: TravelDestination[];
  page?: WPPage | null;
  whatsappNumber: string;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const heroImage = imageSrc(page?.featured_image);

  const eyebrow =
    page?.eyebrow && !STALE_TITLES.has(page.eyebrow) ? page.eyebrow : "Tirtha Yatra · Consecrated pilgrimages";
  const title =
    page?.title && !STALE_TITLES.has(page.title) ? page.title : "Sacred Temple Yatras & Himalayan Sanctuaries";
  const copy =
    page?.hero_copy && !page.hero_copy.includes(STALE_COPY)
      ? page.hero_copy
      : "Immersive spiritual journeys led by consecrated Vedic scholars. Experience high-frequency temple vortices, private sanctum pujas, and planetary alignments at primordial sacred sites.";

  const filtered = useMemo(() => {
    const active = FILTERS.find((item) => item.id === filter) || FILTERS[0];
    if (active.id === "all") return destinations;
    return destinations.filter((item) => active.match(haystack(item)));
  }, [destinations, filter]);

  const shown = filtered.slice(0, visible);
  const remaining = Math.max(0, filtered.length - shown.length);
  const waHref = whatsappNumber
    ? whatsappUrl(
        whatsappNumber,
        "Namaste. I would like to know more about travel. Please help me choose a kundali-aligned temple yatra.",
      )
    : "";

  return (
    <div>
      <section className="relative overflow-hidden px-4 pt-12 pb-10 text-center md:px-12">
        {heroImage ? (
          <img src={heroImage} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" />
        ) : null}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-secondary-container/20 blur-[140px]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center">
          <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
          <h1 className="max-w-4xl font-serif text-[38px] leading-[46px] tracking-tight text-primary md:text-[56px] md:leading-[68px]">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-on-surface-variant">{copy}</p>
          <div className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="flex flex-col items-center rounded-2xl border border-outline-variant/40 bg-surface-low/80 px-3 py-4 shadow-sm backdrop-blur-md"
              >
                <span className="font-serif text-lg text-primary md:text-xl">{stat.value}</span>
                <span className="mt-1 text-center text-[11px] leading-4 text-on-surface-variant">{stat.note}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilter(item.id);
                    setVisible(PAGE_SIZE);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-primary-container text-on-primary shadow-[0_0_20px_rgba(229,195,120,0.4)]"
                      : "bg-surface-low text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-secondary uppercase">Elemental terrain</span>
              <h2 className="mt-1 font-serif text-[32px] text-on-surface">Current Sacred Expeditions</h2>
            </div>
            <p className="text-xs text-on-surface-variant">Only 3 to 5 spots left per departure</p>
          </div>
          {shown.length ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((item) => (
                <TravelCard key={item.id} travel={item} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-surface-low px-6 py-12 text-center text-sm text-on-surface-variant">
              No yatras in this group yet. Browse all sacred yatras from the filters above.
            </p>
          )}
          {remaining > 0 ? (
            <div className="mt-10 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setVisible((count) => count + PAGE_SIZE)}
                className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-surface-low px-6 py-2.5 text-sm font-semibold text-primary hover:bg-surface-highest"
              >
                Load more sacred yatras ({remaining} more in archive)
              </button>
              <p className="text-xs text-on-surface-variant">
                Showing {shown.length} of {filtered.length} curated yatras
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-4 py-16 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="text-[11px] font-bold tracking-[0.22em] text-secondary uppercase">Vedic excellence</span>
            <h2 className="mt-2 font-serif text-[30px] tracking-tight text-on-surface md:text-[40px]">
              What Makes Our Consecrated Yatras Unique
            </h2>
            <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
              Unlike commercial tourism, our yatras are designed as karmic transformational rituals under orthodox Shastra
              mandates.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {UNIQUES.map((item) => (
              <article
                key={item.n}
                className="flex h-full flex-col justify-between rounded-2xl bg-surface-high/70 p-6 shadow-lg backdrop-blur-xl"
              >
                <div>
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-lowest text-primary">
                    <ConchIcon className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-semibold text-on-surface">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.copy}</p>
                </div>
                <p className="mt-6 text-[11px] font-bold tracking-[0.18em] text-primary uppercase">{item.n}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-12">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center overflow-hidden rounded-3xl bg-linear-to-b from-surface-high via-surface-container to-surface-lowest p-8 text-center shadow-[0_0_80px_rgba(229,195,120,0.25)] md:p-14">
          <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-[90px]" />
          <span className="mb-4 inline-flex items-center rounded-full bg-surface-high/80 px-4 py-1 text-[11px] font-bold tracking-[0.22em] text-primary uppercase">
            Astrological guidance before travel
          </span>
          <h2 className="max-w-3xl font-serif text-[30px] leading-tight tracking-tight text-primary md:text-[40px]">
            Seeking a Customized Kundali-Calibrated Pilgrimage?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            Every soul has a karmic destination where planetary afflictions dissolve. Consult Sri Devadathan Namboothiri
            to determine which sacred temple vortex aligns with your current transit.
          </p>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <BookConsultationButton
              prefill={{ whatsapp: whatsappNumber }}
              className="inline-flex items-center justify-center rounded-full bg-primary-container px-6 py-2.5 text-sm font-semibold text-on-primary shadow-[0_0_24px_rgba(229,195,120,0.4)]"
            >
              Book Pilgrimage Consultation
            </BookConsultationButton>
            {waHref ? (
              <ButtonLink href={waHref} variant="ghost" external>
                Speak via WhatsApp
              </ButtonLink>
            ) : null}
          </div>
          <div className="mt-8 grid w-full grid-cols-1 gap-2 border-t border-outline-variant/30 pt-5 sm:grid-cols-3">
            {["Verified Sattvic Stays", "Full Medical & Oxygen Support", "Consecrated Temple Prasadam"].map((item) => (
              <div key={item} className="rounded-xl bg-surface-low/70 px-3 py-2 text-xs font-medium text-on-surface">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
