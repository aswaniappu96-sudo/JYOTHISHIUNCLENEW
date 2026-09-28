import Link from "next/link";
import { PoojaCard } from "@/components/cards/PoojaCard";
import { ConchIcon } from "@/components/icons/ConchIcon";
import { PoojaBookingPanel } from "@/components/pages/PoojaBookingPanel";
import { PoojaGallery } from "@/components/pages/PoojaGallery";
import { PoojaVendorsSection } from "@/components/pages/PoojaVendorsSection";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { htmlListItems, stripPublicPrices } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { POOJAS_PATH } from "@/lib/siteRoutes";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Pooja, SiteSettings, Vendor } from "@/types/wordpress";

const FALLBACK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbWL3okzkn5bZg1MCUYym3qKo4bQQTQPlPXLbT6d1x9RWPa5sTlCq_b_-f1erDJfDWDoMb6vptFclDzhHSyqVP9IaAVKzvsBJUumDsI6J5F1JBb1Wlq1rSAXVErXWkSf0ME7OgwEkXDS_V2m3wHTS9IqaLyafkga0XEEdmfPuLA5igFfy5OWiYvTsIGHlMA5HIboICnaxpUx4bSUoZF6K6v9b43IdxK9WDFvLW7rYYgeofbUUKoRVQ-w";

const PHASES = [
  {
    label: "Phase 01 · Enquiry",
    title: "Share the sankalpa",
    copy: "Send the name, preferred date, and any family notes. We read this before confirming the ritual.",
  },
  {
    label: "Phase 02 · Confirmation",
    title: "We confirm privately",
    copy: "Timing, priest notes, and dakshina are shared on WhatsApp or email. Nothing is billed on this page.",
  },
  {
    label: "Phase 03 · Ritual",
    title: "Pooja is performed",
    copy: "The homam or pooja is offered as discussed, with your sankalpa held by the priests.",
  },
  {
    label: "Phase 04 · Follow-up",
    title: "Notes after the offering",
    copy: "We share confirmation and any prasad or next-step guidance that was arranged with you.",
  },
];

export function PoojaDetailView({
  pooja,
  settings,
  relatedPoojas = [],
  vendors = [],
}: {
  pooja: Pooja;
  settings: SiteSettings;
  relatedPoojas?: Pooja[];
  vendors?: Vendor[];
}) {
  const title = stripPublicPrices(pooja.title);
  const summary = stripPublicPrices(pooja.short_description);
  const about = stripPublicPrices(pooja.full_description);
  const benefitsHtml = stripPublicPrices(pooja.benefits);
  const requirementsHtml = stripPublicPrices(pooja.requirements);
  const benefits = htmlListItems(benefitsHtml);
  const requirements = htmlListItems(requirementsHtml);

  const images = [
    pooja.featured_image ? { url: imageSrc(pooja.featured_image, FALLBACK), alt: pooja.featured_image.alt || title } : null,
    ...pooja.gallery.map((item) => ({ url: imageSrc(item, FALLBACK), alt: item.alt || title })),
  ].filter((item): item is { url: string; alt: string } => Boolean(item?.url));

  const uniqueImages = images.filter((item, index) => images.findIndex((other) => other.url === item.url) === index);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-12 md:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap text-on-surface-variant">
        <Link href="/" className="transition hover:text-primary">
          Home
        </Link>
        <span className="text-outline-variant">/</span>
        <Link href="/services" className="transition hover:text-primary">
          Services
        </Link>
        <span className="text-outline-variant">/</span>
        <Link href={POOJAS_PATH} className="transition hover:text-primary">
          Poojas & Homams
        </Link>
        <span className="text-outline-variant">/</span>
        <span className="font-medium tracking-wide text-primary">{title}</span>
      </nav>

      <div className="mb-7 max-w-4xl space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container/40 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-secondary uppercase">
            <ConchIcon className="h-3 w-3" />
            Pooja & homam
          </span>
          <span className="inline-flex items-center rounded-full bg-surface-high px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-on-surface-variant uppercase">
            Traditional Vedic ritual
          </span>
        </div>
        <h1 className="font-serif text-[30px] leading-[38px] tracking-tight text-primary md:text-[40px] md:leading-[48px]">
          {title}
        </h1>
        {summary ? <p className="max-w-3xl text-base leading-relaxed text-on-surface-variant">{summary}</p> : null}
        <ul className="max-w-3xl space-y-2 pt-2 text-sm leading-relaxed text-on-surface-variant md:text-base">
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            We arrange pooja required as per horoscope
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Pooja can be arranged through various temples
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Pooja can be arranged through various priests online or offline
          </li>
        </ul>
      </div>

      {vendors.length ? (
        <div className="mb-10">
          <PoojaVendorsSection vendors={vendors} />
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col space-y-10 lg:col-span-7">
          {uniqueImages.length ? <PoojaGallery images={uniqueImages} title={title} /> : null}

          {about ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-8 bg-primary" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">About this pooja</span>
              </div>
              <div className="prose-ju text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: about }} />
            </div>
          ) : null}

          {benefits.length ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-8 bg-primary" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Why families choose this</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {benefits.map((item) => (
                  <div key={item} className="flex flex-col space-y-2 rounded-xl bg-surface-container p-4 shadow-md">
                    <p className="text-sm leading-relaxed text-on-surface-variant">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : benefitsHtml ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-8 bg-primary" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Benefits</span>
              </div>
              <div className="prose-ju" dangerouslySetInnerHTML={{ __html: benefitsHtml }} />
            </div>
          ) : null}

          {requirements.length ? (
            <div className="space-y-4 rounded-2xl bg-surface-low p-6 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-8 bg-secondary" />
                <h2 className="font-serif text-[22px] text-on-surface">What to keep ready</h2>
              </div>
              <div className="space-y-4">
                {requirements.map((item, index) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-high text-sm font-bold text-primary shadow-md">
                      {index + 1}
                    </div>
                    <p className="pt-1.5 text-sm leading-relaxed text-on-surface-variant">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : requirementsHtml ? (
            <div className="space-y-3 rounded-2xl bg-surface-low p-6 shadow-xl">
              <h2 className="font-serif text-[22px] text-on-surface">Requirements</h2>
              <div className="prose-ju" dangerouslySetInnerHTML={{ __html: requirementsHtml }} />
            </div>
          ) : null}

          <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface-container p-6 shadow-lg sm:flex-row">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-highest text-2xl text-primary ring-2 ring-primary-container">
              ॐ
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-primary">Guided with traditional care</p>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                Every pooja is arranged with a clear sankalpa. Dakshina is confirmed privately — this page never shows a
                price.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 lg:sticky lg:top-24 lg:col-span-5">
          <PoojaBookingPanel
            slug={pooja.slug}
            title={title}
            phone={settings.phone_number}
            whatsappNumber={settings.whatsapp_number}
            whatsappMessage={pooja.whatsapp_message || `Hello, I am interested in ${title}.`}
            bookingEnabled={pooja.booking_enabled}
            vendors={vendors}
          />
        </div>
      </div>

      <div className="mt-12 space-y-4 rounded-3xl bg-surface-low p-6 shadow-2xl md:p-8">
        <div className="mx-auto max-w-2xl space-y-1 text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">How it is arranged</p>
          <h2 className="font-serif text-[32px] leading-10 text-on-surface">From enquiry to offering</h2>
          <p className="text-sm text-on-surface-variant">A simple path — no checkout, no public price list.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {PHASES.map((phase) => (
            <div key={phase.label} className="flex flex-col space-y-2 rounded-2xl bg-surface-container p-4 shadow-md">
              <span className="text-[11px] font-bold tracking-[0.18em] text-secondary uppercase">{phase.label}</span>
              <p className="font-semibold text-primary">{phase.title}</p>
              <p className="text-sm leading-relaxed text-on-surface-variant">{phase.copy}</p>
            </div>
          ))}
        </div>
      </div>

      {relatedPoojas.length ? (
        <section className="mt-12">
          <SectionHeading eyebrow="Vedic Rituals & Parihara" title="Sacred Spiritual Services & Homams" badge="Services" />
          <div className="mx-auto mt-12 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedPoojas.slice(0, 3).map((item, index) => (
              <Reveal key={item.id} delay={index * 0.08}>
                <PoojaCard pooja={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <div className="relative my-12 flex flex-col items-center justify-center space-y-4 overflow-hidden rounded-3xl bg-linear-to-r from-surface-lowest via-surface-high to-surface-lowest p-8 text-center shadow-2xl md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,195,120,0.12),transparent_70%)]" />
        <div className="relative z-10 flex max-w-3xl flex-col items-center space-y-2">
          <span className="rounded-full bg-primary-container/20 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
            Book with care
          </span>
          <h2 className="font-serif text-[30px] leading-[38px] tracking-tight text-primary md:text-[40px] md:leading-[48px]">
            Reserve this consecrated pooja
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant">
            Share your details and we will confirm the ritual privately. Prices are never listed on the website.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#book"
            className="rounded-full bg-primary-container px-8 py-3.5 text-sm font-bold tracking-wide text-on-primary shadow-[0_0_30px_rgba(229,195,120,0.5)] transition hover:brightness-95"
          >
            Reserve your sankalpa
          </a>
          {settings.whatsapp_number ? (
            <a
              href={whatsappUrl(settings.whatsapp_number, pooja.whatsapp_message || `Hello, I have a question about ${title}.`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-surface-high px-7 py-3.5 text-sm text-on-surface transition hover:text-primary"
            >
              Speak on WhatsApp first
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
