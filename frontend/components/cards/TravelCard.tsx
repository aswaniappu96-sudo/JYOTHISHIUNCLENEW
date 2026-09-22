import { ButtonLink } from "@/components/ui/ButtonLink";
import { MediaFrame } from "@/components/ui/MediaFrame";
import type { TravelDestination } from "@/types/wordpress";

export function TravelCard({ travel }: { travel: TravelDestination }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface-container/60 shadow-2xl backdrop-blur-xl transition hover:shadow-[0_0_40px_rgba(229,195,120,0.2)]">
      <div className="relative h-64 overflow-hidden bg-surface-lowest">
        <MediaFrame image={travel.featured_image} title={travel.title} className="h-full" />
        <div className="absolute inset-0 bg-linear-to-t from-surface-container via-transparent to-transparent" />
        {travel.location ? (
          <div className="absolute top-4 left-4 rounded-full bg-surface-lowest/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-md">
            {travel.location}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-between p-7">
        <div>
          <h3 className="mb-2 font-serif text-[22px] text-on-surface">{travel.title}</h3>
          <p className="mb-4 line-clamp-3 text-sm leading-6 text-on-surface-variant">{travel.short_description}</p>
        </div>
        <ButtonLink href={`/religious-travel/${travel.slug}`}>View yatra itinerary →</ButtonLink>
      </div>
    </article>
  );
}
