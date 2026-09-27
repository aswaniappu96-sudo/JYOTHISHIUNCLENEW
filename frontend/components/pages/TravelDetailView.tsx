import Link from "next/link";
import { TravelCard } from "@/components/cards/TravelCard";
import { ConchIcon } from "@/components/icons/ConchIcon";
import { TravelEnquireForm } from "@/components/pages/TravelEnquireForm";
import { TravelGallery } from "@/components/pages/TravelGallery";
import { htmlListItems, htmlParagraphs, stripPublicPrices, telHref } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";
import type { SiteSettings, TravelDestination } from "@/types/wordpress";

const FALLBACK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNdldoo4iCBMkr4QouH5UzKsQ7d8kXWDkfELH7tIk0C_HK51RzCjVJA1w3DtQXj-RbELSb_NnlHv-oa1mLugs-xpYCJXj-TaprbDpT0a3G_-Md65b1-GIHoCdPg_nyBD74Owc6pIsLgmfgGKPM2OrzFZsEipT90S37G7IZjq5Ymy30xRHaAl-RM0aKherHMqtJ1-DA6osmRywj0s6prU60oRtIvngWQETR-uXz1XCmjc03zuRKTLtEA";

const INCLUDE_FALLBACKS = [
  "Darshan and temple-rule notes for the family",
  "Pooja and sankalpa guidance where needed",
  "Preferred dates confirmed privately",
  "Follow-up on WhatsApp or phone",
];

export function TravelDetailView({
  travel,
  settings,
  related = [],
}: {
  travel: TravelDestination;
  settings: SiteSettings;
  related?: TravelDestination[];
}) {
  const title = stripPublicPrices(travel.title);
  const summary = stripPublicPrices(travel.short_description);
  const location = stripPublicPrices(travel.location);
  const aboutHtml = stripPublicPrices(travel.full_description);
  const infoHtml = stripPublicPrices(travel.travel_information);
  const aboutParagraphs = htmlParagraphs(aboutHtml);
  const infoItems = htmlListItems(infoHtml);
  const infoParagraphs = htmlParagraphs(infoHtml);
  const included = infoItems.length ? infoItems : INCLUDE_FALLBACKS;
  const phone = travel.phone || settings.phone_number;
  const whatsapp = settings.whatsapp_number;
  const waHref = whatsappUrl(
    whatsapp,
    travel.whatsapp_message || `Hello, I need guidance for ${title}.`,
  );

  const images = [
    travel.featured_image ? { url: imageSrc(travel.featured_image, FALLBACK), alt: travel.featured_image.alt || title } : null,
    ...travel.gallery.map((item) => ({ url: imageSrc(item, FALLBACK), alt: item.alt || title })),
  ].filter((item): item is { url: string; alt: string } => Boolean(item?.url));
  const uniqueImages = images.filter((item, index) => images.findIndex((other) => other.url === item.url) === index);

  const whyCards = [
    {
      label: "Temple guidance",
      title: "Darshan with a clear sankalpa",
      copy: aboutParagraphs[0] || summary || "We share timing, dress, and darshan notes so the family can visit with clarity.",
    },
    {
      label: "Travel notes",
      title: "Practical notes for the journey",
      copy: infoParagraphs[0] || infoItems[0] || "Travel points, temple rules, and festival dates are confirmed with you before you leave.",
    },
    {
      label: "Private confirmation",
      title: "Nothing is billed on this page",
      copy: "Dates, dakshina, and next steps are shared on WhatsApp or email. This page never shows a price.",
    },
  ];

  const sidebarIncludes = included.slice(0, 4);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-12 md:pt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
            <Link href="/" className="transition hover:text-primary">
              Home
            </Link>
            <span className="text-outline-variant">/</span>
            <Link href="/religious-travel" className="transition hover:text-primary">
              Temple Yatra
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="font-medium tracking-wide text-primary">{title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col space-y-6 lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-high px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-primary uppercase">
                <ConchIcon className="h-3 w-3" />
                Temple yatra
              </span>
              {location ? (
                <span className="inline-flex items-center rounded-full bg-surface-container px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-on-surface-variant uppercase">
                  {location}
                </span>
              ) : null}
            </div>
            <h1 className="font-serif text-[30px] leading-[38px] tracking-tight text-primary md:text-[40px] md:leading-[48px]">
              {title}
            </h1>
            {summary ? <p className="max-w-3xl text-base leading-relaxed text-on-surface-variant">{summary}</p> : null}
            {uniqueImages.length ? <TravelGallery images={uniqueImages} title={title} location={location} /> : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:col-span-4">
            <div className="space-y-5 rounded-2xl bg-surface-high/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Yatra enquiry</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">Confirmed privately</span>
              </div>
              <div>
                <p className="font-serif text-2xl text-primary">Share your dates</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Dakshina and travel notes are confirmed on WhatsApp or email. This page never shows a price.
                </p>
              </div>
              <div className="space-y-3 rounded-xl bg-surface-lowest/70 p-4">
                {sidebarIncludes.map((item) => (
                  <p key={item} className="flex items-start gap-2 text-sm text-on-surface">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="flex flex-col gap-2.5">
                <a
                  href="#yatra-form"
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary-container px-6 py-3 text-sm font-semibold text-on-primary shadow-[0_8px_24px_rgba(201,162,39,0.35)] transition hover:brightness-95"
                >
                  Reserve yatra slot
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-surface-container px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface-highest"
                >
                  WhatsApp yatra desk
                </a>
                {phone ? (
                  <a
                    href={telHref(phone)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-surface-container px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface-highest"
                  >
                    Call {phone}
                  </a>
                ) : null}
              </div>
              <p className="rounded-xl bg-surface-container p-3 text-xs leading-relaxed text-on-surface-variant">
                Batches and temple rules are confirmed with you before travel. No checkout on this page.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <section className="mt-16 bg-surface-low py-16">
        <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-12">
          <div className="mx-auto max-w-3xl space-y-2 text-center">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Sacred wisdom</p>
            <h2 className="font-serif text-[32px] leading-10 text-on-surface">Why this temple yatra</h2>
            <p className="text-sm text-on-surface-variant">Guidance for darshan, timing, and family rituals — not a packaged tour checkout.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {whyCards.map((card) => (
              <article key={card.label} className="flex flex-col space-y-3 rounded-2xl bg-surface-container p-6 shadow-lg">
                <span className="text-[11px] font-bold tracking-[0.18em] text-secondary uppercase">{card.label}</span>
                <h3 className="font-serif text-xl text-primary">{card.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {aboutHtml || infoHtml ? (
        <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 md:px-12">
          {aboutHtml ? (
            <div className="space-y-3">
              <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">About this yatra</p>
              <h2 className="font-serif text-[32px] text-on-surface">The path, simply explained</h2>
              <div className="prose-ju max-w-4xl text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: aboutHtml }} />
            </div>
          ) : null}
          {infoHtml ? (
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">The path of illumination</p>
                  <h2 className="font-serif text-[32px] text-on-surface">Travel information</h2>
                </div>
                <p className="max-w-md text-sm text-on-surface-variant">Practical notes so the family can plan with a calm sankalpa.</p>
              </div>
              {infoItems.length ? (
                <div className="space-y-4">
                  {infoItems.map((item, index) => (
                    <div key={item} className="grid grid-cols-1 gap-4 rounded-2xl bg-surface-container p-6 shadow-md lg:grid-cols-12">
                      <div className="lg:col-span-3">
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold tracking-wider text-primary uppercase">
                          Note {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-on-surface-variant lg:col-span-9">{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="prose-ju max-w-4xl" dangerouslySetInnerHTML={{ __html: infoHtml }} />
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="bg-surface-low py-16">
        <div className="mx-auto max-w-7xl space-y-8 px-4 md:px-12">
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">What is arranged</p>
            <h2 className="font-serif text-[32px] text-on-surface">What is included in this yatra guidance</h2>
            <p className="text-sm text-on-surface-variant">We keep the family informed so attention stays on darshan — not on a public price list.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {included.map((item) => (
              <article key={item} className="flex items-start gap-3 rounded-2xl bg-surface-container p-5 shadow-md">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <p className="text-sm leading-relaxed text-on-surface">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="yatra-form" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 md:px-12">
        <div className="space-y-8 rounded-3xl bg-surface-high/80 p-6 shadow-2xl sm:p-10">
          <div className="flex flex-col justify-between gap-3 border-b border-outline-variant/30 pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Sacred registration</p>
              <h2 className="font-serif text-[32px] text-on-surface">Reserve your yatra slot</h2>
            </div>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Send the name, preferred dates, and any family notes. We confirm the rest privately.
            </p>
          </div>
          <TravelEnquireForm slug={travel.slug} title={title} whatsappNumber={whatsapp} />
        </div>
      </section>

      <section className="bg-surface-lowest py-12">
        <div className="mx-auto max-w-5xl px-4 md:px-12">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-surface-container p-6 shadow-xl sm:flex-row sm:p-8">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-secondary uppercase">Yatra desk</p>
              <h3 className="font-serif text-xl text-on-surface">Questions before this sacred journey?</h3>
              <p className="mt-1 text-sm text-on-surface-variant">Speak with the JyothishiUncle team on a call or WhatsApp.</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {phone ? (
                <a
                  href={telHref(phone)}
                  className="inline-flex items-center justify-center rounded-full bg-surface-highest px-5 py-2.5 text-sm font-semibold text-primary"
                >
                  Call {phone}
                </a>
              ) : null}
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-12">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Other yatras</p>
          <h2 className="mt-1 font-serif text-[32px] text-on-surface">More temple journeys</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <TravelCard key={item.id} travel={item} whatsappNumber={whatsapp} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
