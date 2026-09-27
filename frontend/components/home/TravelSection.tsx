import { TravelCard } from "@/components/cards/TravelCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/home/SectionHeading";
import type { TravelDestination } from "@/types/wordpress";

export function TravelSection({
  travel,
  whatsappNumber,
}: {
  travel: TravelDestination[];
  whatsappNumber?: string;
}) {
  return (
    <section className="relative my-8 w-full px-4 py-12 md:px-12">
      <SectionHeading
        eyebrow="Sacred Pilgrimages & Mandalas"
        title="Celestial Spiritual Journeys"
        copy="Guidance for darshan, timing, and family rituals — not a packaged tour checkout."
      />
      <div className="mx-auto mt-12 grid max-w-7xl gap-7 lg:grid-cols-3">
        {travel.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.08}>
            <TravelCard travel={item} whatsappNumber={whatsappNumber} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center">
        <ButtonLink href="/religious-travel" variant="light">
          View all destinations →
        </ButtonLink>
      </div>
    </section>
  );
}
