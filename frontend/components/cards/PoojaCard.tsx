"use client";

import Link from "next/link";
import { BookPoojaButton } from "@/components/booking/BookPoojaButton";
import { useLocalized } from "@/lib/localized";
import { imageSrc } from "@/lib/media";
import type { Pooja } from "@/types/wordpress";

const FALLBACKS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbWL3okzkn5bZg1MCUYym3qKo4bQQTQPlPXLbT6d1x9RWPa5sTlCq_b_-f1erDJfDWDoMb6vptFclDzhHSyqVP9IaAVKzvsBJUumDsI6J5F1JBb1Wlq1rSAXVErXWkSf0ME7OgwEkXDS_V2m3wHTS9IqaLyafkga0XEEdmfPuLA5igFfy5OWiYvTsIGHlMA5HIboICnaxpUx4bSUoZF6K6v9b43IdxK9WDFvLW7rYYgeofbUUKoRVQ-w",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDCgwpvhr-e9ByB50W7ZvTkF3HsnIsNn6yug0Reu4zvdaiOupYnI9wV_jmQ-d9F7RCQs6TUE8Qxy4JUw-wttIcsLLiVKpJq53SZF0PjiYobwpt2yuMGzEOL9Iml7njUi-xd7MMmlc767ENOFJyJR58aNZ0ESXCCRXUYP7k-QhBgUlLoc6pTprpZgR2x9mHfAGP1EQU6fD8dAJBBV5dZDKaBpzUOFaMRMfQXXAI_k5jBbBBnknASDWx8w",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD6vwXvFwWTl9DdS3WxNvBSUNcIq6C6i6dhEa_1z0cFOCVTTLJG1Xdie6yvU5L2WxrCDLl0CCy6RsPz3eNnxp5jbzC2M2agr3IVSKjmfCcN3o-yWaQrD65hSaAkUZUON_PcaLxxGl_hWePN8PLOmD2ctMU-ZeXKZJzc_bab6ctXeOWugx9VrzHBJbJG6KbKc20RtYJyDJuLYP7RAcbbpm7-cwgWgAAQFqHLC4LQha31E-Bl1oKszKBCnw",
];

const detailsClass =
  "inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-5 py-2.5 text-sm font-semibold text-on-primary";

function DetailsLink({ slug }: { slug: string }) {
  return (
    <Link href={`/pooja/${slug}`} className={detailsClass}>
      Details
    </Link>
  );
}

export function PoojaCard({
  pooja: raw,
  variant = "standard",
}: {
  pooja: Pooja;
  variant?: "standard" | "featured" | "compact" | "tile" | "rail";
}) {
  const pooja = useLocalized(raw);
  const src = imageSrc(pooja.featured_image, FALLBACKS[Math.abs(pooja.id) % FALLBACKS.length]);

  if (variant === "featured") {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
          <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" />
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
            {pooja.booking_enabled ? <BookPoojaButton pooja={pooja}>Book now</BookPoojaButton> : null}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "rail") {
    return (
      <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
          <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-serif text-[20px] leading-snug text-[#1f1408]">{pooja.title}</h3>
          <div className="mt-auto flex flex-wrap gap-1.5">
            <Link href={`/pooja/${pooja.slug}`} className="rounded-full bg-primary-container px-3 py-1 text-[11px] font-semibold text-on-primary">
              View
            </Link>
            {pooja.booking_enabled ? <BookPoojaButton pooja={pooja}>Book</BookPoojaButton> : null}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "tile") {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
          <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="font-serif text-lg leading-snug text-on-surface">{pooja.title}</h3>
          <div className="mt-auto flex flex-wrap gap-2">
            <DetailsLink slug={pooja.slug} />
            {pooja.booking_enabled ? <BookPoojaButton pooja={pooja}>Book</BookPoojaButton> : null}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)] sm:flex-row">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#F7F0E2] sm:aspect-auto sm:h-auto sm:w-[44%]">
          <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" />
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
            {pooja.booking_enabled ? <BookPoojaButton pooja={pooja}>Book now</BookPoojaButton> : null}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F0E2]">
        <img src={src} alt={pooja.title} className="h-full w-full object-cover object-center" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-[22px] leading-tight text-on-surface">{pooja.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-on-surface-variant">{pooja.short_description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <DetailsLink slug={pooja.slug} />
          {pooja.booking_enabled ? <BookPoojaButton pooja={pooja}>Book now</BookPoojaButton> : null}
        </div>
      </div>
    </article>
  );
}
