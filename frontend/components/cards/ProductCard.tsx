"use client";

import Link from "next/link";
import { ProductEnquiryButton } from "@/components/booking/ProductEnquiryButton";
import { stripPublicPrices } from "@/lib/html";
import { useLocalized } from "@/lib/localized";
import { imageSrc } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/wordpress";

const FALLBACK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwRPRNFIImOONiELqUSNAYVhTd4Iss895DAAluR8Eu74Trm-lB0dVHlVC4VOGmvLlVM6bdOzjW3doOPL3FWIjU-Kc8rF1trVM_l9ng95NuAu9UcTOLw3cCysDzqzcIYQn9DLdYk8QC8PcPJTSLndnLYhuovXHiVpdnmxrc4C4RlnMGuSe17US7SLkeraJBYVJdeugQcbmZfnBBA7eUXc9xvljqZJEP2C5dN1XETBYXd3tLsjKUZXWiVg";

const detailsClass =
  "inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-5 py-2.5 text-sm font-semibold text-on-primary";
const waClass =
  "inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-primary/30 bg-transparent text-primary transition hover:bg-surface-highest";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.06 6.5 2.06 12c0 1.76.46 3.48 1.34 5L2 22l5.18-1.36A9.9 9.9 0 0 0 12.04 22c5.46 0 9.98-4.5 9.98-10s-4.52-10-9.98-10zm0 18c-1.5 0-2.97-.4-4.24-1.16l-.3-.18-3.07.8.82-3-.2-.31A8 8 0 0 1 4.06 12c0-4.42 3.6-8 7.98-8 4.38 0 7.98 3.58 7.98 8s-3.6 8-7.98 8zm4.4-5.96c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.38-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.24 1.02.39 1.37.5.57.18 1.09.16 1.5.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

function availabilityLabel(value: string) {
  if (value === "made_to_order") return "Made to order";
  if (value === "unavailable") return "Enquire";
  return "Available";
}

function DetailsLink({ slug }: { slug: string }) {
  return (
    <Link href={`/product/${slug}`} className={detailsClass}>
      Details
    </Link>
  );
}

function WhatsAppLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={waClass}>
      <WhatsAppIcon />
    </a>
  );
}

export function ProductCard({
  product: raw,
  whatsappNumber,
  variant = "standard",
}: {
  product: Product;
  whatsappNumber: string;
  variant?: "standard" | "featured" | "compact" | "tile" | "rail";
}) {
  const product = useLocalized(raw);
  const title = stripPublicPrices(product.title);
  const summary = stripPublicPrices(product.short_description);
  const src = imageSrc(product.featured_image, FALLBACK);
  const available = availabilityLabel(product.availability);
  const waHref = whatsappNumber
    ? whatsappUrl(whatsappNumber, product.whatsapp_message || `Hello, I would like to know more about ${title}.`)
    : "";

  if (variant === "featured") {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
          <img src={src} alt={title} className="h-full w-full object-cover object-center" />
          <span className="absolute top-4 left-4 z-10 rounded-full bg-primary-container/90 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-on-primary uppercase">
            {available}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
          <h3 className="font-serif text-[28px] leading-tight text-on-surface md:text-[34px]">{title}</h3>
          {summary ? <p className="max-w-xl line-clamp-3 text-sm leading-6 text-on-surface-variant">{summary}</p> : null}
          <div className="mt-auto flex flex-wrap gap-2">
            <DetailsLink slug={product.slug} />
            <ProductEnquiryButton product={product}>Buy</ProductEnquiryButton>
            {waHref ? <WhatsAppLink href={waHref} /> : null}
          </div>
          <p className="text-xs text-on-surface-variant">Fees shared privately</p>
        </div>
      </article>
    );
  }

  if (variant === "rail") {
    return (
      <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
          <img src={src} alt={title} className="h-full w-full object-cover object-center" />
          <span className="absolute top-2 left-2 rounded-full bg-surface-lowest/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
            {available}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-serif text-[20px] leading-snug text-[#1f1408]">{title}</h3>
          <div className="mt-auto flex flex-wrap gap-1.5">
            <Link href={`/product/${product.slug}`} className="rounded-full bg-primary-container px-3 py-1 text-[11px] font-semibold text-on-primary">
              View
            </Link>
            <ProductEnquiryButton product={product}>Enquire</ProductEnquiryButton>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "tile") {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
          <img src={src} alt={title} className="h-full w-full object-cover object-center" />
          <span className="absolute top-3 left-3 rounded-full bg-surface-lowest/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            {available}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="font-serif text-lg leading-snug text-on-surface">{title}</h3>
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2">
              <DetailsLink slug={product.slug} />
              <ProductEnquiryButton product={product}>Enquire</ProductEnquiryButton>
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">Fees shared privately</p>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)] sm:flex-row">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#F7F0E2] sm:aspect-auto sm:h-auto sm:w-[44%]">
          <img src={src} alt={title} className="h-full w-full object-cover object-center" />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3 p-5">
          <div>
            <h3 className="font-serif text-[20px] leading-snug text-on-surface">{title}</h3>
            {summary ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-on-surface-variant">{summary}</p> : null}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <DetailsLink slug={product.slug} />
              <ProductEnquiryButton product={product}>Buy</ProductEnquiryButton>
              {waHref ? <WhatsAppLink href={waHref} /> : null}
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">Fees shared privately</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
        <img src={src} alt={title} className="h-full w-full object-cover object-center" />
        <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-primary uppercase shadow-sm">
          {available}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-[22px] leading-tight text-on-surface">{title}</h3>
        {summary ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-on-surface-variant">{summary}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <DetailsLink slug={product.slug} />
          <ProductEnquiryButton product={product}>Buy</ProductEnquiryButton>
          {waHref ? <WhatsAppLink href={waHref} /> : null}
        </div>
        <p className="mt-3 text-xs text-on-surface-variant">Fees shared privately</p>
      </div>
    </article>
  );
}
