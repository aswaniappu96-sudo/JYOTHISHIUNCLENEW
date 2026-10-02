import Link from "next/link";
import { stripPublicPrices } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";
import type { TravelDestination } from "@/types/wordpress";

const FALLBACK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNdldoo4iCBMkr4QouH5UzKsQ7d8kXWDkfELH7tIk0C_HK51RzCjVJA1w3DtQXj-RbELSb_NnlHv-oa1mLugs-xpYCJXj-TaprbDpT0a3G_-Md65b1-GIHoCdPg_nyBD74Owc6pIsLgmfgGKPM2OrzFZsEipT90S37G7IZjq5Ymy30xRHaAl-RM0aKherHMqtJ1-DA6osmRywj0s6prU60oRtIvngWQETR-uXz1XCmjc03zuRKTLtEA";

export function TravelCard({
  travel,
  whatsappNumber,
  variant = "standard",
}: {
  travel: TravelDestination;
  whatsappNumber?: string;
  variant?: "standard" | "rail";
}) {
  const title = stripPublicPrices(travel.title);
  const summary = stripPublicPrices(travel.short_description);
  const location = stripPublicPrices(travel.location);
  const src = imageSrc(travel.featured_image, FALLBACK);
  const waHref = whatsappNumber
    ? whatsappUrl(whatsappNumber, travel.whatsapp_message || `Hello, I would like to know more about travel to ${title}.`)
    : "";

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
        <div className="absolute inset-0 bg-linear-to-t from-surface-low via-surface-low/40 to-transparent" />
        {location ? (
          <span className="absolute top-4 left-4 rounded-full bg-surface-lowest/80 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-primary uppercase backdrop-blur-md">
            {location}
          </span>
        ) : null}
        <h3 className="absolute right-4 bottom-4 left-4 font-serif text-[22px] leading-tight text-on-surface">{title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {summary ? <p className="line-clamp-3 text-sm leading-6 text-on-surface-variant">{summary}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/religious-travel/${travel.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
          >
            Read more
          </Link>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface-highest"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-on-surface-variant">Dates and dakshina confirmed privately</p>
      </div>
    </article>
  );
}
