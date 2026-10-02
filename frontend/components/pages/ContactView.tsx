import Link from "next/link";
import { CategoryDesk } from "@/components/home/CategoryDesk";
import { EnquiryForm } from "@/components/home/EnquiryForm";
import { PageHeading } from "@/components/home/SectionHeading";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { EnquireButton } from "@/components/portal/EnquireButton";
import { imageSrc } from "@/lib/media";
import { POOJAS_PATH } from "@/lib/siteRoutes";
import type { Pooja, Product, SiteSettings, TravelDestination, WPPage } from "@/types/wordpress";

const HAVAN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD6vwXvFwWTl9DdS3WxNvBSUNcIq6C6i6dhEa_1z0cFOCVTTLJG1Xdie6yvU5L2WxrCDLl0CCy6RsPz3eNnxp5jbzC2M2agr3IVSKjmfCcN3o-yWaQrD65hSaAkUZUON_PcaLxxGl_hWePN8PLOmD2ctMU-ZeXKZJzc_bab6ctXeOWugx9VrzHBJbJG6KbKc20RtYJyDJuLYP7RAcbbpm7-cwgWgAAQFqHLC4LQha31E-Bl1oKszKBCnw";
const GEMS =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCTNKzLRhP5KfIj6fMRqRhJCzGScaKS-1cFPV5SAaMPa5Oui0x_YF1w4RumRrxRcZ_evk9eytAAiywKQ07Q-l8Le1zRb8pZ05lrgyugt-fPzPQEy86r8Ohy5VcU13RyzKLAlgk_JOZ-xwkV14Tf3ssN55DQtBfv26HYxu3b2Dhb_moNv7PPqEdtS3b7VZlCrPsatE_ShT-xlfy8MzI4znfPJ3W2vAqDnEbmQZfSNYy85WppaLD9V4-YqA";

export function ContactView({
  settings,
  page,
  poojas = [],
  products = [],
  travel = [],
}: {
  settings: SiteSettings;
  page: WPPage | null;
  poojas?: Pooja[];
  products?: Product[];
  travel?: TravelDestination[];
}) {
  const visual1 = imageSrc(page?.featured_image, HAVAN);
  const visual2 = imageSrc(page?.image_1 || page?.image_2, GEMS);
  const cmsHtml = page?.content && !/sample copy/i.test(page.content) ? page.content : undefined;
  const customTitle = page?.title && !/^contact( us)?$/i.test(page.title) ? page.title : null;

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-10 md:px-12">
        <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />
        <div className="mx-auto mb-12 flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-high/80 px-3.5 py-1 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                {page?.eyebrow || "Sacred Portals & Ritual Access"}
              </span>
            </div>
            <PageHeading as="h1" title={customTitle || "Sacred Forms & Booking Portals"} />
            <p className="max-w-2xl text-base text-on-surface-variant">
              {page?.hero_copy ||
                "High-fidelity sanctuary interfaces, authenticated seeker flows, auspicious Muhurtha calendars, and consecrated order mechanisms configured for celestial accuracy."}
            </p>
            {settings.address ? (
              <p className="text-sm text-on-surface-variant">
                {settings.address}
                {settings.phone_number ? ` · ${settings.phone_number}` : ""}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface-low/90 p-2 shadow-xl backdrop-blur-xl">
            <BookConsultationButton className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-on-primary">
              Launch Consultation Portal
            </BookConsultationButton>
            <Link
              href={POOJAS_PATH}
              className="inline-flex items-center justify-center rounded-xl border border-primary/30 bg-transparent px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-surface-highest"
            >
              Book Homam
            </Link>
            <EnquireButton className="inline-flex items-center rounded-xl bg-surface-high px-4 py-2.5 text-sm font-medium text-primary" subject="General Shastric Enquiry">
              Open Enquiry
            </EnquireButton>
          </div>
        </div>
        {cmsHtml ? <article className="prose-ju mx-auto mb-8 max-w-3xl" dangerouslySetInnerHTML={{ __html: cmsHtml }} /> : null}
      </section>

      <EnquiryForm whatsappNumber={settings.whatsapp_number} variant="contact" />

      <section className="mx-auto max-w-7xl px-4 pt-4 pb-16 md:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 border-t border-surface-highest/30 pt-12 md:flex-row md:items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Sanctified Environment</span>
            <PageHeading title="Where Every Form Transmutes into Ahuti" />
          </div>
          <p className="max-w-md text-sm text-on-surface-variant">
            Every form submission is received directly by authorized priests at our consecrated sanctum centers across
            Varanasi, Ujjain, and Rameswaram.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl p-6 shadow-2xl">
            <img alt={page?.image_1_title || "Vedic fire ritual"} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" src={visual1} />
            <div className="absolute inset-0 bg-linear-to-t from-surface-lowest via-surface-lowest/60 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="rounded-full bg-primary-container/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-md">
                Agni Pratishtapana
              </span>
              <h3 className="font-serif text-[22px] text-primary">Pure Vedic Sankalpa Rituals</h3>
              <p className="text-sm text-on-surface-variant">
                Chanted with authentic swaras from the Rig and Yajur Vedas under the guidance of Acharyas.
              </p>
            </div>
          </div>
          <div className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl p-6 shadow-2xl">
            <img alt={page?.image_1_title || page?.image_2_title || "Planetary gemstones"} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" src={visual2} />
            <div className="absolute inset-0 bg-linear-to-t from-surface-lowest via-surface-lowest/60 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="rounded-full bg-secondary/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-md">
                Jyotish Ratna Sanctity
              </span>
              <h3 className="font-serif text-[22px] text-secondary">{page?.image_1_title || page?.image_2_title || "Planetary Gemstones & Malas"}</h3>
              <p className="text-sm text-on-surface-variant">
                {page?.image_1_copy ||
                  page?.image_2_copy ||
                  "Certified natural stones attuned according to planetary transits and natal Kundali Dasha periods."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CategoryDesk poojas={poojas} products={products} travel={travel} />
    </div>
  );
}
