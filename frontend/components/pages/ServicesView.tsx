"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PoojaCard } from "@/components/cards/PoojaCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { PoojaVendorsSection } from "@/components/pages/PoojaVendorsSection";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { PageHeading } from "@/components/home/SectionHeading";
import { Eyebrow } from "@/components/pages/PageHero";
import { imageSrc } from "@/lib/media";
import { POOJAS_PATH, PRODUCTS_PATH, servicesTab } from "@/lib/siteRoutes";
import type { Pooja, Product, Vendor, WPPage } from "@/types/wordpress";

export function ServicesView({
  poojas,
  products,
  page,
  whatsappNumber,
  vendors = [],
  initialTab = "poojas",
}: {
  poojas: Pooja[];
  products: Product[];
  page?: WPPage | null;
  whatsappNumber: string;
  vendors?: Vendor[];
  initialTab?: "poojas" | "products";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = servicesTab(searchParams.get("tab") ?? initialTab);
  const heroImage = imageSrc(page?.featured_image);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#products") {
      router.replace(PRODUCTS_PATH, { scroll: false });
    } else if (hash === "#pooja" || hash === "#poojas") {
      router.replace(POOJAS_PATH, { scroll: false });
    }
  }, [router]);

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-12 text-center md:px-12">
        {heroImage ? <img src={heroImage} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" /> : null}
        <div className="pointer-events-none absolute top-0 left-1/2 h-[340px] w-[700px] -translate-x-1/2 rounded-full bg-secondary-container/25 blur-[120px]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center">
          <Eyebrow className="mb-4">{page?.eyebrow || "Vedic Tantric Shastra · Anushthana Protocols"}</Eyebrow>
          <PageHeading as="h1" title={page?.title || "Sacred Services & Divine Consecrations"} className="mb-3 max-w-4xl" />
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-on-surface-variant">
            {page?.hero_copy ||
              "Ancient Shastric Poojas, Vedic Homams & Consecrated Planetary Artifacts calibrated precisely to your individual birth Nakshatra, Dasha coordinates, and planetary afflictions."}
          </p>
          <div
            role="tablist"
            aria-label="Poojas or products"
            className="mx-auto flex w-full max-w-[280px] items-center rounded-full border border-[#EAD9B0]/80 bg-white/85 p-0.5 shadow-[0_4px_14px_rgba(46,32,12,0.08)] backdrop-blur-md sm:max-w-none sm:w-auto sm:p-1"
          >
            <Link
              href={POOJAS_PATH}
              replace
              scroll={false}
              role="tab"
              aria-label="Poojas"
              aria-selected={tab === "poojas"}
              className={`inline-flex flex-1 items-center justify-center rounded-full px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition sm:flex-none sm:px-5 sm:py-2 sm:text-[13px] md:text-[14px] ${
                tab === "poojas"
                  ? "bg-primary-container text-on-primary shadow-[0_0_12px_rgba(229,195,120,0.28)]"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="sm:hidden">Poojas</span>
              <span className="hidden sm:inline">Poojas & Homams</span>
            </Link>
            <Link
              href={PRODUCTS_PATH}
              replace
              scroll={false}
              role="tab"
              aria-label="Products"
              aria-selected={tab === "products"}
              className={`inline-flex flex-1 items-center justify-center rounded-full px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition sm:flex-none sm:px-5 sm:py-2 sm:text-[13px] md:text-[14px] ${
                tab === "products"
                  ? "bg-primary-container text-on-primary shadow-[0_0_12px_rgba(229,195,120,0.28)]"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="sm:hidden">Products</span>
              <span className="hidden sm:inline">Sacred Products</span>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-on-surface-variant/80">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              CURRENT MUHURTA: <strong className="font-semibold text-primary">Abhijit (Surya Auspice)</strong>
            </span>
            <span className="text-outline-variant">|</span>
            <span>
              PRIESTHOOD: <span className="text-on-surface">Traditional Vedic priesthood</span>
            </span>
            <span className="text-outline-variant">|</span>
            <span>
              SANKALPA GUARANTEE: <span className="text-on-surface">100% Individualized</span>
            </span>
          </div>
        </div>
      </section>

      {tab === "poojas" ? (
        <section className="px-4 pb-16 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">01 / Agnikarya & Yajnas</span>
                  <span className="h-px w-12 bg-primary/40" />
                </div>
                <PageHeading title="Sacred Fire Homams & Poojas" />
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
        <section className="px-4 pb-16 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">02 / Sacred products</span>
                <span className="h-px w-12 bg-secondary/40" />
              </div>
              <PageHeading title="Sacred Planetary Products & Talismans" />
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
          <PageHeading title="Book a 1-on-1 Consultation" />
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
