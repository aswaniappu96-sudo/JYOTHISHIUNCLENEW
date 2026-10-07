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
  "inline-flex items-center justify-center rounded-full border border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface-highest";

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
    <a href={href} target="_blank" rel="noreferrer" className={waClass}>
      WhatsApp
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
      <article className="group relative flex h-full min-h-[420px] overflow-hidden rounded-2xl bg-surface-low shadow-xl lg:min-h-0">
        <img
          src={src}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1408]/90 via-[#1a1408]/35 to-transparent" />
        <span className="absolute top-4 left-4 z-10 rounded-full bg-primary-container/90 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-on-primary uppercase">
          {available}
        </span>
        <div className="relative z-10 mt-auto flex w-full flex-col gap-4 p-6 md:p-8">
          <h3 className="font-serif text-[28px] leading-tight text-[#fffbf3] md:text-[34px]">{title}</h3>
          {summary ? <p className="max-w-xl line-clamp-3 text-sm leading-6 text-[#fffbf3]/85">{summary}</p> : null}
          <div className="flex flex-wrap gap-2">
            <DetailsLink slug={product.slug} />
            <ProductEnquiryButton product={product}>Buy</ProductEnquiryButton>
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#fffbf3]/50 bg-transparent px-5 py-2.5 text-sm font-semibold text-[#fffbf3] transition hover:bg-[#fffbf3]/15"
              >
                WhatsApp
              </a>
            ) : null}
          </div>
          <p className="text-xs text-[#fffbf3]/70">Fees shared privately</p>
        </div>
      </article>
    );
  }

  if (variant === "rail") {
    return (
      <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-surface-lowest shadow-md ring-1 ring-primary/10 transition hover:-translate-y-0.5 hover:ring-primary/35">
        <div className="relative h-44 overflow-hidden">
          <img src={src} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
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
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-low shadow-lg">
        <div className="relative h-40 overflow-hidden">
          <img src={src} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
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
      <article className="group flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl bg-surface-low shadow-xl sm:flex-row">
        <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[44%]">
          <img
            src={src}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface-low/70 to-transparent sm:bg-linear-to-r" />
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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-low shadow-xl">
      <div className="relative h-80 overflow-hidden">
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface-low via-surface-low/40 to-transparent" />
        <span className="absolute top-4 left-4 rounded-full bg-surface-lowest/80 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-primary uppercase backdrop-blur-md">
          {available}
        </span>
        <h3 className="absolute right-4 bottom-4 left-4 font-serif text-[22px] leading-tight text-on-surface">{title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {summary ? <p className="line-clamp-3 text-sm leading-6 text-on-surface-variant">{summary}</p> : null}
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
