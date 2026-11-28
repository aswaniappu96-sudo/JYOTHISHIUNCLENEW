import Link from "next/link";
import { stripPublicPrices, telHref } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";
import type { TravelDestination } from "@/types/wordpress";

const FALLBACK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNdldoo4iCBMkr4QouH5UzKsQ7d8kXWDkfELH7tIk0C_HK51RzCjVJA1w3DtQXj-RbELSb_NnlHv-oa1mLugs-xpYCJXj-TaprbDpT0a3G_-Md65b1-GIHoCdPg_nyBD74Owc6pIsLgmfgGKPM2OrzFZsEipT90S37G7IZjq5Ymy30xRHaAl-RM0aKherHMqtJ1-DA6osmRywj0s6prU60oRtIvngWQETR-uXz1XCmjc03zuRKTLtEA";

const iconClass =
  "inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-primary/30 bg-transparent text-primary transition hover:bg-surface-highest";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.06 6.5 2.06 12c0 1.76.46 3.48 1.34 5L2 22l5.18-1.36A9.9 9.9 0 0 0 12.04 22c5.46 0 9.98-4.5 9.98-10s-4.52-10-9.98-10zm0 18c-1.5 0-2.97-.4-4.24-1.16l-.3-.18-3.07.8.82-3-.2-.31A8 8 0 0 1 4.06 12c0-4.42 3.6-8 7.98-8 4.38 0 7.98 3.58 7.98 8s-3.6 8-7.98 8zm4.4-5.96c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.38-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.24 1.02.39 1.37.5.57.18 1.09.16 1.5.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

function CallIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <path
        d="M7.2 4.8c.4-.4 1.1-.5 1.6-.2l2.2 1.3c.5.3.7.9.5 1.4L10.8 9.8a11.2 11.2 0 0 0 3.4 3.4l2.5-.7c.5-.2 1.1 0 1.4.5l1.3 2.2c.3.5.2 1.2-.2 1.6l-1.1 1.1c-.5.5-1.2.7-1.9.5-3.3-.9-6.3-3.2-8.6-5.5S3.3 8.3 2.4 5c-.2-.7 0-1.4.5-1.9L4 2.9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TravelCard({
  travel,
  whatsappNumber,
  phone = "",
  variant = "standard",
}: {
  travel: TravelDestination;
  whatsappNumber?: string;
  phone?: string;
  variant?: "standard" | "rail";
}) {
  const title = stripPublicPrices(travel.title);
  const summary = stripPublicPrices(travel.short_description);
  const location = stripPublicPrices(travel.location);
  const src = imageSrc(travel.featured_image, FALLBACK);
  const waHref = whatsappNumber
    ? whatsappUrl(whatsappNumber, travel.whatsapp_message || `Hello, I would like to know more about travel to ${title}.`)
    : "";
  const callHref = phone.trim() ? telHref(phone) : "";

  if (variant === "rail") {
    return (
      <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-surface-lowest shadow-md ring-1 ring-primary/10 transition hover:-translate-y-0.5 hover:ring-primary/35">
        <div className="relative h-44 overflow-hidden">
          <img src={src} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-serif text-[20px] leading-snug text-[#1f1408]">{title}</h3>
          <Link href={`/religious-travel/${travel.slug}`} className="mt-auto rounded-full bg-primary-container px-3 py-1 text-center text-[11px] font-semibold text-on-primary">
            View
          </Link>
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
        {location ? (
          <span className="absolute top-4 left-4 rounded-full bg-surface-lowest/80 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-primary uppercase backdrop-blur-md">
            {location}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-[22px] leading-tight text-on-surface">{title}</h3>
        {summary ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-on-surface-variant">{summary}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/religious-travel/${travel.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
          >
            Read more
          </Link>
          {waHref ? (
            <a href={waHref} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={iconClass}>
              <WhatsAppIcon />
            </a>
          ) : null}
          {callHref ? (
            <a href={callHref} aria-label="Call" className={iconClass}>
              <CallIcon />
            </a>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-on-surface-variant">Dates and dakshina confirmed privately</p>
      </div>
    </article>
  );
}
