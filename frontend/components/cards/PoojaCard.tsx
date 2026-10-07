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
      <article className="group relative flex h-full min-h-[420px] overflow-hidden rounded-2xl bg-surface-low shadow-xl lg:min-h-0">
        <img
          src={src}
          alt={pooja.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1408]/90 via-[#1a1408]/35 to-transparent" />
        <div className="relative z-10 mt-auto flex w-full flex-col gap-4 p-6 md:p-8">
          <span className="w-fit rounded-full bg-primary-container/90 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-on-primary uppercase">
            Featured
          </span>
          <h3 className="font-serif text-[28px] leading-tight text-[#fffbf3] md:text-[34px]">{pooja.title}</h3>
          {pooja.short_description ? (
            <p className="max-w-xl line-clamp-3 text-sm leading-6 text-[#fffbf3]/85">{pooja.short_description}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <DetailsLink slug={pooja.slug} />
            {pooja.booking_enabled ? (
              <BookPoojaButton
                pooja={pooja}
                className="inline-flex items-center justify-center rounded-full border border-[#fffbf3]/50 bg-transparent px-5 py-2.5 text-sm font-semibold text-[#fffbf3] transition hover:bg-[#fffbf3]/15"
              >
                Book now
              </BookPoojaButton>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "rail") {
    return (
      <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-surface-lowest shadow-md ring-1 ring-primary/10 transition hover:-translate-y-0.5 hover:ring-primary/35">
        <div className="relative h-44 overflow-hidden">
          <img src={src} alt={pooja.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
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
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-low shadow-lg">
        <div className="relative h-40 overflow-hidden">
          <img
            src={src}
            alt={pooja.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
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
      <article className="group flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl bg-surface-low shadow-xl sm:flex-row">
        <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[44%]">
          <img
            src={src}
            alt={pooja.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface-low/70 to-transparent sm:bg-linear-to-r" />
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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-low shadow-xl">
      <div className="relative h-80 overflow-hidden">
        <img
          src={src}
          alt={pooja.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface-low via-surface-low/40 to-transparent" />
        <h3 className="absolute right-4 bottom-4 left-4 font-serif text-[22px] leading-tight text-on-surface">{pooja.title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="line-clamp-3 text-sm leading-6 text-on-surface-variant">{pooja.short_description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <DetailsLink slug={pooja.slug} />
          {pooja.booking_enabled ? <BookPoojaButton pooja={pooja}>Book now</BookPoojaButton> : null}
        </div>
      </div>
    </article>
  );
}
