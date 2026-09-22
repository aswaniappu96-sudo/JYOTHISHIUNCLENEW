import { PoojaCard } from "@/components/cards/PoojaCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/home/SectionHeading";
import type { Pooja } from "@/types/wordpress";

export function PoojaSection({ poojas }: { poojas: Pooja[]; whatsappNumber?: string }) {
  const featured = poojas.slice(0, 3);

  return (
    <section id="pooja" className="relative my-8 w-full px-4 py-12 md:px-12">
      <SectionHeading
        eyebrow="Vedic Rituals & Parihara"
        title="Sacred Spiritual Services & Homams"
      />
      <div className="mx-auto mt-12 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((pooja, index) => (
          <Reveal key={pooja.id} delay={index * 0.08}>
            <PoojaCard pooja={pooja} />
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <ButtonLink href="/services#pooja" variant="light">
          View all poojas
        </ButtonLink>
      </div>
    </section>
  );
}
