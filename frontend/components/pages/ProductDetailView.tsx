import Link from "next/link";
import { ProductCard } from "@/components/cards/ProductCard";
import { ConchIcon } from "@/components/icons/ConchIcon";
import { ProductEnquireForm } from "@/components/pages/ProductEnquireForm";
import { ProductGallery } from "@/components/pages/ProductGallery";
import { htmlListItems, htmlParagraphs, stripPublicPrices, telHref } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { PRODUCTS_PATH } from "@/lib/siteRoutes";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Product, SiteSettings, Testimonial } from "@/types/wordpress";

const FALLBACK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwRPRNFIImOONiELqUSNAYVhTd4Iss895DAAluR8Eu74Trm-lB0dVHlVC4VOGmvLlVM6bdOzjW3doOPL3FWIjU-Kc8rF1trVM_l9ng95NuAu9UcTOLw3cCysDzqzcIYQn9DLdYk8QC8PcPJTSLndnLYhuovXHiVpdnmxrc4C4RlnMGuSe17US7SLkeraJBYVJdeugQcbmZfnBBA7eUXc9xvljqZJEP2C5dN1XETBYXd3tLsjKUZXWiVg";

const ASSURANCE_FALLBACKS = [
  ["Family guidance", "Notes on use, packing, and care are shared before dispatch."],
  ["Private confirmation", "Quantity and dakshina are confirmed on WhatsApp. This page never shows a price."],
  ["Careful dispatch", "Items are packed with care once the family confirms the details."],
  ["Follow-up", "We stay in touch on WhatsApp or phone after the enquiry."],
];

const PHASES = [
  {
    n: "01",
    title: "Share what you need",
    copy: "Send the name, quantity, and any notes. We read this before confirming the item.",
  },
  {
    n: "02",
    title: "We confirm privately",
    copy: "Availability, packing, and dakshina are shared on WhatsApp or email. Nothing is billed here.",
  },
  {
    n: "03",
    title: "Prepared and sent",
    copy: "Once confirmed, the product is prepared and dispatched as discussed with the family.",
  },
];

function availabilityLabel(value: string) {
  if (value === "made_to_order") return "Made to order";
  if (value === "unavailable") return "Enquire";
  return "Available";
}

function assurancePair(item: string): [string, string] {
  const idx = item.indexOf(": ");
  if (idx > 1 && idx < 36) {
    return [item.slice(0, idx), item.slice(idx + 2)];
  }
  return ["", item];
}

export function ProductDetailView({
  product,
  settings,
  related = [],
  testimonials = [],
}: {
  product: Product;
  settings: SiteSettings;
  related?: Product[];
  testimonials?: Testimonial[];
}) {
  const title = stripPublicPrices(product.title);
  const summary = stripPublicPrices(product.short_description);
  const aboutHtml = stripPublicPrices(product.full_description);
  const infoHtml = stripPublicPrices(product.product_info);
  const aboutParagraphs = htmlParagraphs(aboutHtml);
  const infoItems = htmlListItems(infoHtml);
  const infoParagraphs = htmlParagraphs(infoHtml);
  const available = availabilityLabel(product.availability);
  const phone = settings.phone_number;
  const whatsapp = settings.whatsapp_number;
  const waHref = whatsappUrl(
    whatsapp,
    product.whatsapp_message || `Hello, I would like to know more about ${title}.`,
  );

  const images = [
    product.featured_image ? { url: imageSrc(product.featured_image, FALLBACK), alt: product.featured_image.alt || title } : null,
    ...product.gallery.map((item) => ({ url: imageSrc(item, FALLBACK), alt: item.alt || title })),
  ].filter((item): item is { url: string; alt: string } => Boolean(item?.url));
  const uniqueImages = images.filter((item, index) => images.findIndex((other) => other.url === item.url) === index);

  const assurances = (infoItems.length ? infoItems.map(assurancePair) : ASSURANCE_FALLBACKS).slice(0, 4);

  const whyCards = [
    {
      label: "How it is used",
      title: "Clear guidance for the family",
      copy: aboutParagraphs[0] || summary || "We share how this item is used in daily puja or japa, without a public checkout.",
    },
    {
      label: "Practical notes",
      title: "Material and packing",
      copy: infoItems[0] || infoParagraphs[0] || "Size, packing, and dispatch notes are confirmed with you privately.",
    },
    {
      label: "Private confirmation",
      title: "Nothing is billed on this page",
      copy: "Quantity and dakshina are shared on WhatsApp or email. This page never shows a price.",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/4 -right-16 h-[480px] w-[480px] rounded-full bg-secondary-container/20 blur-[140px]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-6 md:px-12 md:pt-10">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span className="text-outline-variant">/</span>
          <Link href="/services" className="transition hover:text-primary">
            Services
          </Link>
          <span className="text-outline-variant">/</span>
          <Link href={PRODUCTS_PATH} className="transition hover:text-primary">
            Products
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="truncate font-medium tracking-wide text-primary">{title}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-6">
            {uniqueImages.length ? <ProductGallery images={uniqueImages} title={title} available={available} /> : null}
            <div className="rounded-xl bg-surface-low/80 p-5 shadow-md backdrop-blur-md">
              <p className="mb-4 font-semibold text-on-surface">What families can expect</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {assurances.map(([label, copy]) => (
                  <div key={`${label}-${copy}`} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <div>
                      {label ? <p className="text-sm font-semibold text-on-surface">{label}</p> : null}
                      <p className="text-xs leading-relaxed text-on-surface-variant">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container/50 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-secondary uppercase">
                <ConchIcon className="h-3 w-3" />
                Sacred product
              </span>
              <span className="inline-flex items-center rounded-full bg-surface-high px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-on-surface-variant uppercase">
                {available}
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-[30px] leading-[38px] tracking-tight text-primary md:text-[40px] md:leading-[48px]">
                {title}
              </h1>
              {summary ? <p className="text-base leading-relaxed text-on-surface-variant">{summary}</p> : null}
            </div>
            <div className="rounded-xl bg-surface-high/90 p-5 shadow-lg">
              <p className="font-serif text-2xl text-primary md:text-[32px]">Enquire to reserve</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                Dakshina and dispatch notes are confirmed on WhatsApp or email. This page never shows a price.
              </p>
            </div>
            <div className="rounded-2xl bg-surface-container/85 p-5 shadow-xl backdrop-blur-xl sm:p-6">
              <ProductEnquireForm slug={product.slug} title={title} whatsappNumber={whatsapp} />
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-surface-high px-6 py-3.5 text-sm font-semibold text-primary shadow-sm transition hover:bg-surface-highest"
            >
              Consult on WhatsApp
            </a>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-on-surface-variant">
              <span>Packed after confirmation</span>
              {phone ? (
                <a href={telHref(phone)} className="font-semibold text-primary">
                  Call {phone}
                </a>
              ) : (
                <span>Follow-up on WhatsApp</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 bg-surface-low py-16">
        <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-12">
          <div className="mx-auto max-w-3xl space-y-2 text-center">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Sacred guidance</p>
            <h2 className="font-serif text-[32px] leading-10 text-on-surface">Why this product</h2>
            <p className="text-sm text-on-surface-variant">Guidance for puja and japa — not a public shop checkout.</p>
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
              <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">About this product</p>
              <h2 className="font-serif text-[32px] text-on-surface">Prepared with care</h2>
              <div className="prose-ju max-w-4xl text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: aboutHtml }} />
            </div>
          ) : null}
          {infoHtml ? (
            <div className="space-y-4">
              <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Product information</p>
              <h2 className="font-serif text-[32px] text-on-surface">Notes for the family</h2>
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

      <section className="bg-surface-lowest/70 py-16">
        <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-12">
          <div className="mx-auto max-w-3xl space-y-2 text-center">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">How it is arranged</p>
            <h2 className="font-serif text-[32px] text-on-surface">Three steps, simply explained</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PHASES.map((phase) => (
              <article key={phase.n} className="flex flex-col gap-3 rounded-2xl bg-surface-container/80 p-7 shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-high font-serif text-lg font-bold text-primary">
                  {phase.n}
                </span>
                <h3 className="font-serif text-xl text-primary">{phase.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{phase.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length ? (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-12">
          <p className="text-center text-[11px] font-bold tracking-[0.2em] text-primary uppercase">From families</p>
          <h2 className="mt-1 text-center font-serif text-[32px] text-on-surface">Words from seekers</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((item) => (
              <blockquote key={item.id} className="flex flex-col justify-between rounded-2xl bg-surface-container p-6 shadow-md">
                <p className="text-sm leading-relaxed text-on-surface italic">“{stripPublicPrices(item.review)}”</p>
                <footer className="mt-4 font-semibold text-primary">{item.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-12">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Other products</p>
          <h2 className="mt-1 font-serif text-[32px] text-on-surface">More for puja and japa</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} whatsappNumber={whatsapp} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
