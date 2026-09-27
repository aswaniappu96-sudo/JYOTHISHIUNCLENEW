import { AstrologerActions } from "@/components/pages/AstrologerActions";
import { mediaUrl } from "@/lib/api/client";
import { decodeWpText } from "@/lib/html";
import type { Astrologer } from "@/types/wordpress";

export type PortraitMeta = {
  location: string;
  rating: string;
  status: string;
  statusClass: string;
};

export const PORTRAITS: PortraitMeta[] = [
  { location: "Thrissur", rating: "4.98", status: "Online", statusClass: "text-primary" },
  { location: "Varanasi, Uttar Pradesh", rating: "4.95", status: "Available", statusClass: "text-secondary" },
  { location: "Rameswaram, Tamil Nadu", rating: "4.97", status: "Online", statusClass: "text-tertiary-container" },
  { location: "Ujjain, Madhya Pradesh", rating: "4.96", status: "Online", statusClass: "text-primary" },
];

export function AstrologerCard({
  person,
  meta,
  phone,
  whatsapp,
}: {
  person: Astrologer;
  meta: PortraitMeta;
  phone?: string;
  whatsapp?: string;
}) {
  const src = mediaUrl(person.featured_image?.full || person.featured_image?.url);
  const specialty = decodeWpText(person.specialty || "");
  const location = decodeWpText(person.location || "") || meta.location;
  const summary = decodeWpText(person.short_description || "");
  const name = decodeWpText(person.title || "");

  return (
    <article className="group flex h-full flex-col justify-between rounded-xl border border-outline-variant/20 bg-surface-low/90 p-4 shadow-2xl backdrop-blur-xl transition hover:shadow-[0_0_35px_-8px_rgba(229,195,120,0.25)]">
      <div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-container">
          {src ? (
            <img alt="Vedic astrologer" src={src} className="h-full w-full object-contain object-center" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-serif text-6xl text-primary/35" aria-hidden>
              ॐ
            </div>
          )}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-primary/30 bg-surface-lowest/90 px-2.5 py-1 backdrop-blur-md">
            <span className="text-xs text-tertiary-container">★</span>
            <span className="text-xs font-bold text-on-surface">{meta.rating}</span>
          </div>
        </div>
        {specialty ? (
          <p className="mt-2 text-[11px] uppercase tracking-widest text-on-surface-variant">{specialty}</p>
        ) : null}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-on-surface">{location}</span>
          <span className={`flex items-center gap-1.5 text-[11px] font-medium ${meta.statusClass}`}>
            <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
            {meta.status}
          </span>
        </div>
        {summary ? (
          <p className="mt-2 line-clamp-2 text-xs text-on-surface-variant">{summary}</p>
        ) : null}
      </div>
      <AstrologerActions name={name} phone={phone} whatsapp={whatsapp} />
    </article>
  );
}
