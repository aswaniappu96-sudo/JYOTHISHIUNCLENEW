"use client";

import Link from "next/link";
import { BookPoojaButton } from "@/components/booking/BookPoojaButton";
import { useLocalized } from "@/lib/localized";
import { liveCatalogPhoto } from "@/lib/catalogImages";
import { imageSrc } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Pooja } from "@/types/wordpress";

const detailsClass =
  "inline-flex h-[42px] shrink-0 items-center justify-center rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-5 text-sm font-semibold text-on-primary";
const bookClass =
  "inline-flex h-[42px] shrink-0 items-center justify-center rounded-full bg-[#E9C07A] px-5 text-sm font-semibold text-[#1E160E] transition hover:bg-[#E0B46D]";
const waClass =
  "inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-primary/30 bg-transparent text-primary transition hover:bg-surface-highest";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.06 6.5 2.06 12c0 1.76.46 3.48 1.34 5L2 22l5.18-1.36A9.9 9.9 0 0 0 12.04 22c5.46 0 9.98-4.5 9.98-10s-4.52-10-9.98-10zm0 18c-1.5 0-2.97-.4-4.24-1.16l-.3-.18-3.07.8.82-3-.2-.31A8 8 0 0 1 4.06 12c0-4.42 3.6-8 7.98-8 4.38 0 7.98 3.58 7.98 8s-3.6 8-7.98 8zm4.4-5.96c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.38-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.24 1.02.39 1.37.5.57.18 1.09.16 1.5.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

function DetailsLink({ slug }: { slug: string }) {
  return (
    <Link href={`/pooja/${slug}`} className={detailsClass}>
      Details
    </Link>
  );
}

function WhatsAppLink({ href }: { href: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={waClass}>
      <WhatsAppIcon />
    </a>
  );
}

export function PoojaCard({
  pooja: raw,
  whatsappNumber = "",
  variant = "standard",
}: {
  pooja: Pooja;
  whatsappNumber?: string;
  variant?: "standard" | "featured" | "compact" | "tile" | "rail";
}) {
  const pooja = useLocalized(raw);
  const src = liveCatalogPhoto("pooja", pooja.slug, imageSrc(pooja.featured_image));
  const waHref = whatsappNumber.trim()
    ? whatsappUrl(whatsappNumber, pooja.whatsapp_message || `Namaste. I would like to know more about ${pooja.title}.`)
    : "";

  if (variant === "featured") {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
          {src ? <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" /> : null}
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
          <span className="w-fit rounded-full bg-primary-container/90 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-on-primary uppercase">
            Featured
          </span>
          <h3 className="font-serif text-[28px] leading-tight text-on-surface md:text-[34px]">{pooja.title}</h3>
          {pooja.short_description ? (
            <p className="max-w-xl line-clamp-3 text-sm leading-6 text-on-surface-variant">{pooja.short_description}</p>
          ) : null}
          <div className="mt-auto flex flex-wrap gap-2">
            <DetailsLink slug={pooja.slug} />
            {pooja.booking_enabled ? <BookPoojaButton pooja={pooja} className={bookClass}>Book now</BookPoojaButton> : null}
            <WhatsAppLink href={waHref} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "rail") {
    return (
      <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
          {src ? <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" /> : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-serif text-[20px] leading-snug text-[#1f1408]">{pooja.title}</h3>
          <div className="mt-auto flex flex-wrap gap-1.5">
            <Link href={`/pooja/${pooja.slug}`} className="rounded-full bg-primary-container px-3 py-1 text-[11px] font-semibold text-on-primary">
              View
            </Link>
            {pooja.booking_enabled ? <BookPoojaButton pooja={pooja} className={bookClass}>Book</BookPoojaButton> : null}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "tile") {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
          {src ? <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" /> : null}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="font-serif text-lg leading-snug text-on-surface">{pooja.title}</h3>
          <div className="mt-auto flex flex-wrap gap-2">
            <DetailsLink slug={pooja.slug} />
            {pooja.booking_enabled ? <BookPoojaButton pooja={pooja} className={bookClass}>Book</BookPoojaButton> : null}
            <WhatsAppLink href={waHref} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)] sm:flex-row">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#F7F0E2] sm:aspect-auto sm:h-auto sm:w-[44%]">
          {src ? <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" /> : null}
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3 p-5">
          <div>
            <h3 className="font-serif text-[20px] leading-snug text-on-surface">{pooja.title}</h3>
            {pooja.short_description ? (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-on-surface-variant">{pooja.short_description}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <DetailsLink slug={pooja.slug} />
            {pooja.booking_enabled ? <BookPoojaButton pooja={pooja} className={bookClass}>Book now</BookPoojaButton> : null}
            <WhatsAppLink href={waHref} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
        {src ? <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" /> : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-[22px] leading-tight text-on-surface">{pooja.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-on-surface-variant">{pooja.short_description}</p>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <DetailsLink slug={pooja.slug} />
          {pooja.booking_enabled ? <BookPoojaButton pooja={pooja} className={bookClass}>Book now</BookPoojaButton> : null}
          <WhatsAppLink href={waHref} />
        </div>
      </div>
    </article>
  );
}
