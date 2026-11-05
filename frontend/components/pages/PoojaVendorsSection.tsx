"use client";

import { SectionHeading } from "@/components/home/SectionHeading";
import { usePortal } from "@/components/portal/PortalProvider";
import { stripHtml } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import type { Pooja, Vendor } from "@/types/wordpress";

function vendorCopy(vendor: Vendor) {
  const short = vendor.short_description?.trim();
  if (short) return short;
  const fromHtml = stripHtml(vendor.full_description || "").trim();
  if (!fromHtml) return "";
  return fromHtml.length > 180 ? `${fromHtml.slice(0, 177).trim()}…` : fromHtml;
}

function poojasAtTemple(vendor: Vendor, poojas: Pooja[]) {
  const picked = (vendor.pooja_ids || [])
    .map((id) => poojas.find((item) => item.id === id))
    .filter((item): item is Pooja => Boolean(item));
  const list = picked.length ? picked : poojas;
  return list.map((item) => ({ slug: item.slug, title: item.title }));
}

export function PoojaVendorsSection({
  vendors,
  poojas = [],
  embed = false,
}: {
  vendors: Vendor[];
  poojas?: Pooja[];
  embed?: boolean;
}) {
  const { openPooja } = usePortal();
  if (!vendors.length) return null;

  return (
    <section id="pooja-temples" className={embed ? "scroll-mt-28 space-y-4" : "scroll-mt-28 space-y-8"}>
      {embed ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 bg-primary" />
            <span className="text-[11px] font-bold tracking-[0.22em] text-primary uppercase">Pooja temples</span>
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
          copy="Choose a temple to book. The booking form opens with that temple selected."
        />
      )}
      <div className={`grid grid-cols-1 gap-4 ${embed ? "sm:grid-cols-3" : "gap-6 md:grid-cols-3"}`}>
        {vendors.map((vendor) => {
          const src = imageSrc(vendor.featured_image);
          const copy = vendorCopy(vendor);
          const location = vendor.location?.trim();
          const showLocation = location && location.toLowerCase() !== vendor.title.toLowerCase();
          const choices = poojasAtTemple(vendor, poojas);
          return (
            <button
              key={vendor.id || vendor.slug}
              type="button"
              onClick={() =>
                openPooja({
                  slug: choices[0]?.slug || "",
                  title: choices[0]?.title || vendor.title,
                  vendor: vendor.slug,
                  poojaChoices: choices,
                })
              }
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAD9B0] bg-white text-left shadow-[0_14px_40px_rgba(46,32,12,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(46,32,12,0.2)]"
            >
              {src ? (
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#F7F0E2]">
                  <img src={src} alt="" className="h-full w-full object-cover object-center" />
                </div>
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#F7F0E2] font-serif text-4xl text-primary/35">
                  ॐ
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-xl leading-snug text-primary">{vendor.title}</h3>
                {showLocation ? (
                  <p className="mt-1 text-xs font-medium tracking-wide text-on-surface-variant">{location}</p>
                ) : null}
                {copy ? <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{copy}</p> : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
