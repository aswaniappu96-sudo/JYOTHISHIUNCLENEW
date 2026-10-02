import { AstrologerActions } from "@/components/pages/AstrologerActions";
import { mediaUrl } from "@/lib/api/client";
import { decodeWpText } from "@/lib/html";
import { publicSpecialtyLine } from "@/lib/siteServices";
import type { Astrologer } from "@/types/wordpress";

export type PortraitMeta = {
  location: string;
  rating: string;
  status: string;
  statusClass: string;
};

export const PORTRAITS: PortraitMeta[] = [
  { location: "India", rating: "4.98", status: "Online", statusClass: "text-primary" },
  { location: "Varanasi, Uttar Pradesh", rating: "4.95", status: "Available", statusClass: "text-secondary" },
  { location: "Rameswaram, Tamil Nadu", rating: "4.97", status: "Online", statusClass: "text-tertiary-container" },
  { location: "Ujjain, Madhya Pradesh", rating: "4.96", status: "Online", statusClass: "text-primary" },
];

export function AstrologerCard({
  person,
  meta,
  phone,
  whatsapp,
  compact = false,
}: {
  person: Astrologer;
  meta: PortraitMeta;
  phone?: string;
  whatsapp?: string;
  compact?: boolean;
}) {
  const src = mediaUrl(person.featured_image?.full || person.featured_image?.url);
  const specialty = publicSpecialtyLine(decodeWpText(person.specialty || ""));
  const location = decodeWpText(person.location || "") || meta.location;
  const summary = decodeWpText(person.short_description || "");
  const name = decodeWpText(person.title || "");

  return (
    <article className="group flex h-full flex-col justify-between rounded-xl border border-outline-variant/20 bg-surface-low/90 p-4 shadow-2xl backdrop-blur-xl transition hover:shadow-[0_0_35px_-8px_rgba(229,195,120,0.25)]">
      <div>
        <div className={`relative w-full overflow-hidden rounded-lg bg-surface-container ${compact ? "aspect-square" : "aspect-[4/5]"}`}>
          {src ? (
            <img alt={name || "Vedic astrologer"} src={src} className="h-full w-full object-contain object-center" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[#f3e6d0] px-4 text-center" aria-hidden>
              <span className="font-serif text-6xl text-[#1f1408]">{(name || "ॐ").trim().charAt(0)}</span>
              <span className="mt-2 text-sm font-semibold text-[#3a2a14]">{name || "Astrologer"}</span>
              <span className="mt-1 text-xs text-[#4a3520]">Portrait coming soon</span>
            </div>
          )}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-primary/30 bg-surface-lowest/90 px-2.5 py-1 backdrop-blur-md">
            <span className="text-xs text-tertiary-container">★</span>
            <span className="text-xs font-bold text-on-surface">{meta.rating}</span>
          </div>
        </div>
        {name ? <h3 className="mt-3 font-serif text-xl leading-snug text-[#1f1408]">{name}</h3> : null}
        {specialty ? (
          <p className="mt-1 text-[12px] font-medium uppercase tracking-widest text-[#4a3520]">{specialty}</p>
        ) : null}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-on-surface">{location}</span>
          <span className={`flex items-center gap-1.5 text-[11px] font-medium ${meta.statusClass}`}>
            <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
            {meta.status}
          </span>
        </div>
        {summary && !compact ? (
          <p className="mt-2 line-clamp-2 text-xs text-on-surface-variant">{summary}</p>
        ) : null}
      </div>
      <AstrologerActions name={name} phone={phone} whatsapp={whatsapp} compact={compact} />
    </article>
  );
}
