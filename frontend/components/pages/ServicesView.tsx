"use client";

import { useEffect, useState } from "react";
import { PoojaCard } from "@/components/cards/PoojaCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { PoojaVendorsSection } from "@/components/pages/PoojaVendorsSection";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { Eyebrow } from "@/components/pages/PageHero";
import { imageSrc } from "@/lib/media";
import type { Pooja, Product, Vendor, WPPage } from "@/types/wordpress";

export function ServicesView({
  poojas,
  products,
  page,
  whatsappNumber,
  vendors = [],
}: {
  poojas: Pooja[];
  products: Product[];
  page?: WPPage | null;
  whatsappNumber: string;
  vendors?: Vendor[];
}) {
  const [tab, setTab] = useState<"pooja" | "products">("pooja");
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
              PRIESTHOOD: <span className="text-on-surface">Vedic Tantra Namboothiri Peetham</span>
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {poojas.map((pooja) => (
                <PoojaCard key={pooja.id} pooja={pooja} />
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-outline">Includes Chandi Homam, Rudrabhishekam, Kala Bhairava & Bagalamukhi Yajna on enquiry.</p>
            {vendors.length ? (
              <div className="mt-16">
                <PoojaVendorsSection vendors={vendors} />
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <section id="products" className="scroll-mt-28 px-4 pb-16 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">02 / Sacred products</span>
                <span className="h-px w-12 bg-secondary/40" />
              </div>
              <h2 className="font-serif text-[30px] tracking-tight text-on-surface md:text-[40px]">Sacred Planetary Products & Talismans</h2>
              <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
                Items for puja and japa, prepared with care. Fees are shared privately after you enquire.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
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
            Confidential sessions online through video consulting. Calendar dates that are already taken stay closed.
          </p>
          <div className="mt-6">
            <BookConsultationButton />
          </div>
        </div>
      </section>
    </div>
  );
}
