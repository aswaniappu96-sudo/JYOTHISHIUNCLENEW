import { SectionHeading } from "@/components/home/SectionHeading";
import { stripHtml } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import type { Vendor } from "@/types/wordpress";

function vendorCopy(vendor: Vendor) {
  const short = vendor.short_description?.trim();
  if (short) return short;
  const fromHtml = stripHtml(vendor.full_description || "").trim();
  if (!fromHtml) return "";
  return fromHtml.length > 180 ? `${fromHtml.slice(0, 177).trim()}…` : fromHtml;
}

export function PoojaVendorsSection({ vendors, embed = false }: { vendors: Vendor[]; embed?: boolean }) {
  if (!vendors.length) return null;

  return (
    <section id="pooja-temples" className={embed ? "scroll-mt-28 space-y-4" : "scroll-mt-28 space-y-8"}>
      {embed ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 bg-primary" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Pooja temples</span>
          </div>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Pooja can be arranged through various temples. Choose a temple in the booking form for an online or offline ritual.
          </p>
        </div>
      ) : (
        <SectionHeading
          eyebrow="Pooja temples"
          title="Pooja Temples"
          badge="Temples"
          copy="Pooja can be arranged through various temples. Choose a temple in the booking form for an online or offline ritual."
        />
      )}
      <div className={`grid grid-cols-1 gap-4 ${embed ? "sm:grid-cols-3" : "gap-6 md:grid-cols-3"}`}>
        {vendors.map((vendor) => {
          const src = imageSrc(vendor.featured_image);
          const copy = vendorCopy(vendor);
          const location = vendor.location?.trim();
          const showLocation = location && location.toLowerCase() !== vendor.title.toLowerCase();
          return (
            <article
              key={vendor.id || vendor.slug}
              className="overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white p-4 shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]"
            >
              {src ? (
                <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-[#F7F0E2]">
                  <img src={src} alt={vendor.title} className="h-full w-full object-contain object-center" />
                </div>
              ) : (
                <div className="mb-4 flex aspect-square items-center justify-center rounded-xl bg-[#F7F0E2] font-serif text-4xl text-primary/35">
                  ॐ
                </div>
              )}
              <h3 className="font-serif text-xl leading-snug text-primary">{vendor.title}</h3>
              {showLocation ? (
                <p className="mt-1 text-xs font-medium tracking-wide text-on-surface-variant">{location}</p>
              ) : null}
              {copy ? <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{copy}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
