"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookPoojaButton } from "@/components/booking/BookPoojaButton";
import { ProductEnquiryButton } from "@/components/booking/ProductEnquiryButton";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { Eyebrow } from "@/components/pages/PageHero";
import { imageSrc } from "@/lib/media";
import type { Pooja, Product, WPPage } from "@/types/wordpress";

type RitualCard = {
  slug: string;
  title: string;
  copy: string;
  tag: string;
  duration: string;
  extra: string;
  tags: string[];
  fromWp?: boolean;
};

type ArtifactCard = {
  slug: string;
  title: string;
  copy: string;
  planet: string;
  origin: string;
  badge: string;
  note: string;
  image?: string | null;
  fromWp?: boolean;
};

const DESIGN_RITUALS: RitualCard[] = [
  {
    slug: "maha-mrityunjaya-homam",
    title: "Maha Mrityunjaya Homam",
    copy: "The Great Death-Conquering fire rite of Lord Shiva. Performed for Ayur Vriddhi, recovery, and karmic armor against maraka grahas.",
    tag: "Shiva Tatva · Maraka Shanti",
    duration: "3.5 Hours",
    extra: "108 Sacred Ahutis",
    tags: ["Ayur Vriddhi", "Karmic Armor", "Surya/Shani Alignment"],
  },
  {
    slug: "navagraha-homam",
    title: "Navagraha Shanti Homam",
    copy: "Nine celestial rulers pacified with 9×108 ahutis. Recommended during Sade Sati, Kala Sarpa, and mixed graha pressure.",
    tag: "9 Celestial Rulers",
    duration: "4.0 Hours",
    extra: "9x108 Ahutis",
    tags: ["Sade Sati Remedy", "9 Samidhas", "Kala Sarpa Relief"],
  },
  {
    slug: "sri-sukta-mahalakshmi-pooja",
    title: "Sri Sukta & Mahalakshmi Pooja",
    copy: "Sixteen Rik mantras of Sri Sukta with lotus offerings for Dhana Prapti, Venus elevation, and business fortune.",
    tag: "Shukra & Lakshmi Tatva",
    duration: "2.5 Hours",
    extra: "16 Rik Mantras",
    tags: ["Dhana Prapti", "Venus Elevation", "Business Fortune"],
  },
  {
    slug: "sudarshana-narasimha-homam",
    title: "Sudarshana & Narasimha Homam",
    copy: "Tantric raksha fire for drishti dosha, shatru jaya, and etheric armor through 108 Sudarshana ahutis.",
    tag: "Chakra Veerya",
    duration: "3.0 Hours",
    extra: "108 Sudarshana Ahutis",
    tags: ["Drishti Dosha Nasha", "Shatru Jaya", "Etheric Armor"],
  },
  {
    slug: "manglik-kuja-dosha-nivarana",
    title: "Manglik & Kuja Dosha Nivarana",
    copy: "Mars pacification for both charts with red oleander ahutis, shielding the 7th house and vivaha soukhyam.",
    tag: "Angaraka / Mars",
    duration: "3.0 Hours",
    extra: "Red Oleander Ahutis",
    tags: ["Vivaha Soukhyam", "Mars Pacification", "7th House Shield"],
  },
  {
    slug: "santana-gopala-krishna-homam",
    title: "Santana Gopala Krishna Homam",
    copy: "Guru / 5th house rite with 108 butter ahutis for Santana Prapti, Garbha Raksha, and Brihaspati grace.",
    tag: "Guru / 5th House",
    duration: "3.5 Hours",
    extra: "108 Butter Ahutis",
    tags: ["Santana Prapti", "Garbha Raksha", "Brihaspati Grace"],
  },
];

const DESIGN_PRODUCTS: ArtifactCard[] = [
  {
    slug: "himalayan-5-mukhi-rudraksha-mala",
    title: "Himalayan 5-Mukhi Rudraksha Mala",
    copy: "Genuine high-altitude Nepal bead selection. Bestows nervous equilibrium, clarifies intellect, and invites Mahadeva's supreme protection.",
    planet: "Guru / Jupiter",
    origin: "Nepal Origin",
    badge: "Govt. Lab Tested",
    note: "108+1 Meru Bead",
  },
  {
    slug: "consecrated-navaratna-astral-ring",
    title: "Consecrated Navaratna Astral Ring",
    copy: "Nine-gem gold and panchadhatu setting, IGI certified, attuned to all nine planetary deities.",
    planet: "All 9 Planetary Deities",
    origin: "Bespoke Craft",
    badge: "IGI Certified Gems",
    note: "Gold & Silver Panchadhatu",
  },
  {
    slug: "hand-engraved-copper-sri-yantra",
    title: "Hand-Engraved Copper Sri Yantra",
    copy: "Temple-grade copper yantra engraved by hand and energized through 108 tantric japa cycles.",
    planet: "Lakshmi Tatva",
    origin: "Temple Grade",
    badge: "108x Consecrated",
    note: "Copper Prana Pratishtha",
  },
];

function mergeRituals(poojas: Pooja[]): RitualCard[] {
  const fromWp: RitualCard[] = poojas.map((pooja, i) => {
    const design = DESIGN_RITUALS.find((item) => pooja.slug.includes(item.slug.split("-")[0]) || pooja.title.toLowerCase().includes(item.title.toLowerCase().slice(0, 12)));
    return {
      slug: pooja.slug,
      title: pooja.title,
      copy: pooja.short_description || design?.copy || "",
      tag: design?.tag || (i === 0 ? "Ganapathi · Vighnaharta" : "Shastric Anushthana"),
      duration: design?.duration || "Individualized",
      extra: design?.extra || "Individual Sankalpa",
      tags: design?.tags || ["Individual Sankalpa", "HD Live Stream", "Prasadam Worldwide"],
      fromWp: true,
    };
  });
  const extras = poojas.length ? [] : DESIGN_RITUALS;
  return [...fromWp, ...extras];
}

function mergeProducts(products: Product[]): ArtifactCard[] {
  const fromWp: ArtifactCard[] = products.map((product, i) => {
    const design = DESIGN_PRODUCTS[i];
    return {
      slug: product.slug,
      title: product.title,
      copy: product.short_description || design?.copy || "",
      planet: design?.planet || "Consecrated Artifact",
      origin: product.availability === "in_stock" ? "Available" : "Enquire",
      badge: design?.badge || "108x Consecrated",
      note: design?.note || "Temple grade",
      image: product.featured_image?.url || product.featured_image?.full || null,
      fromWp: true,
    };
  });
  const extras = products.length ? [] : DESIGN_PRODUCTS;
  return [...fromWp, ...extras];
}

export function ServicesView({
  poojas,
  products,
  page,
}: {
  poojas: Pooja[];
  products: Product[];
  page?: WPPage | null;
}) {
  const [tab, setTab] = useState<"pooja" | "products">("pooja");
  const rituals = mergeRituals(poojas);
  const artifacts = mergeProducts(products);
  const heroImage = imageSrc(page?.featured_image);

  useEffect(() => {
    const apply = () => {
      if (window.location.hash === "#products") setTab("products");
      if (window.location.hash === "#pooja") setTab("pooja");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-12 text-center md:px-12">
        {heroImage ? <img src={heroImage} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" /> : null}
        <div className="pointer-events-none absolute top-0 left-1/2 h-[340px] w-[700px] -translate-x-1/2 rounded-full bg-secondary-container/25 blur-[120px]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center">
          <Eyebrow className="mb-4">{page?.eyebrow || "Vedic Tantric Shastra · Anushthana Protocols"}</Eyebrow>
          <h1 className="mb-3 max-w-4xl font-serif text-[38px] leading-tight tracking-tight text-primary drop-shadow-[0_2px_15px_rgba(255,224,157,0.3)] md:text-[56px] md:leading-[68px]">
            {page?.title || "Sacred Services & Divine Consecrations"}
          </h1>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-on-surface-variant">
            {page?.hero_copy ||
              "Ancient Shastric Poojas, Vedic Homams & Consecrated Planetary Artifacts calibrated precisely to your individual birth Nakshatra, Dasha coordinates, and planetary afflictions."}
          </p>
          <div className="flex items-center gap-1 rounded-full bg-surface-lowest/80 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => {
                setTab("pooja");
                window.history.replaceState(null, "", "#pooja");
              }}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-lg font-semibold transition ${tab === "pooja" ? "bg-primary-container text-on-primary shadow-[0_0_20px_rgba(229,195,120,0.4)]" : "text-on-surface-variant hover:text-primary"}`}
            >
              Poojas & Consecrated Homams
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("products");
                window.history.replaceState(null, "", "#products");
              }}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-lg font-semibold transition ${tab === "products" ? "bg-primary-container text-on-primary shadow-[0_0_20px_rgba(229,195,120,0.4)]" : "text-on-surface-variant hover:text-primary"}`}
            >
              Sacred Planetary Products
            </button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-on-surface-variant/80">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              CURRENT MUHURTA: <strong className="font-semibold text-primary">Abhijit (Surya Auspice)</strong>
            </span>
            <span className="text-outline-variant">|</span>
            <span>
              PRIESTHOOD: <span className="text-on-surface">Kerala Tantra Namboothiri Peetham</span>
            </span>
            <span className="text-outline-variant">|</span>
            <span>
              SANKALPA GUARANTEE: <span className="text-on-surface">100% Individualized</span>
            </span>
          </div>
        </div>
      </section>

      {tab === "pooja" ? (
        <section id="pooja" className="scroll-mt-28 px-4 pb-16 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">01 / Agnikarya & Yajnas</span>
                  <span className="h-px w-12 bg-primary/40" />
                </div>
                <h2 className="font-serif text-[30px] tracking-tight text-on-surface md:text-[40px]">Sacred Fire Homams & Poojas</h2>
                <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
                  HD Live Sankalpa Stream & Consecrated Prasadam shipped worldwide. Fees are shared privately after your
                  booking request.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rituals.map((ritual) => (
                <article key={ritual.slug} className="group flex flex-col justify-between rounded-xl bg-surface-container/70 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.4)] backdrop-blur-xl transition hover:bg-surface-high/90">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{ritual.tag}</span>
                    </div>
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                      <span>{ritual.duration}</span>
                      <span className="text-outline-variant">•</span>
                      <span className="font-medium text-primary">{ritual.extra}</span>
                      <span className="text-outline-variant">•</span>
                      <span>Individualized</span>
                    </div>
                    <h3 className="mb-2 font-serif text-[22px] text-on-surface transition group-hover:text-primary">{ritual.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-on-surface-variant">{ritual.copy}</p>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {ritual.tags.map((tag) => (
                        <span key={tag} className="rounded bg-surface-highest px-2 py-0.5 text-[11px] text-on-surface-variant">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-outline">Fees shared privately</span>
                    <div className="flex gap-2">
                      {ritual.fromWp ? (
                        <Link href={`/pooja/${ritual.slug}`} className="rounded-full bg-surface-highest px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-on-primary">
                          View
                        </Link>
                      ) : null}
                      <BookPoojaButton pooja={{ slug: ritual.slug, title: ritual.title }}>Book Ritual</BookPoojaButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-outline">Includes Chandi Homam, Rudrabhishekam, Kala Bhairava & Bagalamukhi Yajna on enquiry.</p>
          </div>
        </section>
      ) : (
        <section id="products" className="scroll-mt-28 px-4 pb-16 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">02 / Prana Pratishtha Artifacts</span>
                  <span className="h-px w-12 bg-secondary/40" />
                </div>
                <h2 className="font-serif text-[30px] tracking-tight text-on-surface md:text-[40px]">Sacred Planetary Products & Talismans</h2>
                <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
                  Sourced ethically from original geological origins, certified untreated, and energised through 108
                  Tantric Japa cycles to establish resonance with your cosmic frequency.
                </p>
              </div>
              <div className="rounded-full bg-surface-highest/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-md">
                Laboratory Certified & 108x Consecrated
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artifacts.map((item) => (
                <article key={item.slug} className="group flex flex-col overflow-hidden rounded-xl bg-surface-container/70 shadow-[0_12px_36px_rgba(0,0,0,0.4)] backdrop-blur-xl transition hover:bg-surface-high/90">
                  <div className="relative h-60 w-full overflow-hidden bg-linear-to-br from-surface-lowest to-secondary-container">
                    {item.image ? <img alt={item.title} src={item.image} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : null}
                    <div className="absolute inset-0 bg-linear-to-t from-surface-container via-surface-container/20 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-surface-lowest/80 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-md">
                      {item.planet}
                    </span>
                    <span className="absolute top-3 right-3 rounded-lg bg-surface-highest/90 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      {item.origin}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold uppercase text-primary">{item.badge}</span>
                        <span className="text-xs text-secondary">{item.note}</span>
                      </div>
                      <h3 className="mb-2 font-serif text-[22px] text-on-surface transition group-hover:text-primary">{item.title}</h3>
                      <p className="mb-4 line-clamp-2 text-sm text-on-surface-variant">{item.copy}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-outline">Fees shared privately</span>
                      <div className="flex gap-2">
                        {item.fromWp ? (
                          <Link href={`/product/${item.slug}`} className="rounded-full bg-surface-highest px-4 py-2 text-sm font-semibold text-primary">
                            View Details
                          </Link>
                        ) : null}
                        <ProductEnquiryButton product={{ slug: item.slug, title: item.title }}>Buy</ProductEnquiryButton>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="consultation" className="px-4 pb-20 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-2xl bg-surface-low/90 p-8 text-center shadow-2xl md:p-12">
          <span className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Live Astrological Ephemeris Sync</span>
          <h2 className="font-serif text-[30px] text-primary md:text-[40px]">Book a 1-on-1 Consultation</h2>
          <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
            Confidential sessions from Oman via WhatsApp, Google Meet, or Zoom. Calendar dates that are already taken
            stay closed.
          </p>
          <div className="mt-6">
            <BookConsultationButton />
          </div>
        </div>
      </section>
    </div>
  );
}
