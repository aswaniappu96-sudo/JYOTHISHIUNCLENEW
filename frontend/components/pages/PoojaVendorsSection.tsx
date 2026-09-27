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

export function PoojaVendorsSection({ vendors }: { vendors: Vendor[] }) {
  if (!vendors.length) return null;

  return (
    <section id="pooja-temples" className="scroll-mt-28 space-y-8">
      <SectionHeading
        eyebrow="Pooja temples"
        title="Pooja Temples"
        badge="Temples"
        copy="Pooja can be arranged through various temples. Choose a temple in the booking form for an online or offline ritual."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {vendors.map((vendor) => {
          const src = imageSrc(vendor.featured_image);
          const copy = vendorCopy(vendor);
          const location = vendor.location?.trim();
          const showLocation = location && location.toLowerCase() !== vendor.title.toLowerCase();
          return (
            <article
              key={vendor.id || vendor.slug}
              className="overflow-hidden rounded-2xl bg-surface-low p-4 shadow-xl"
            >
              {src ? (
                <div className="mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-surface-container">
                  <img src={src} alt={vendor.title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="mb-4 flex aspect-[16/10] items-center justify-center rounded-xl bg-surface-container font-serif text-4xl text-primary/35">
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
