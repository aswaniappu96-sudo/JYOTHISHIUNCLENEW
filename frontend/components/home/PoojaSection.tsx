"use client";

import { PoojaCard } from "@/components/cards/PoojaCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/home/SectionHeading";
import { useJuList } from "@/lib/useJuList";
import { POOJAS_PATH } from "@/lib/siteRoutes";
import type { Pooja } from "@/types/wordpress";

export function PoojaSection({ poojas }: { poojas: Pooja[]; whatsappNumber?: string }) {
  const list = useJuList<Pooja>("/poojas?homepage=1", poojas);
  const featured = list.slice(0, 3);
  const hero = featured[0];
  const side = featured.slice(1);

  return (
    <section id="services" className="relative my-8 w-full scroll-mt-28 px-4 py-12 md:px-12">
      <SectionHeading
        eyebrow="Vedic Rituals & Parihara"
        title="Sacred Spiritual Services & Homams"
        badge="Services"
      />
      <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-2 lg:grid-rows-2 lg:h-[560px]">
        {hero ? (
          <Reveal className="h-full min-h-0 lg:row-span-2">
            <PoojaCard pooja={hero} variant="featured" />
          </Reveal>
        ) : null}
        {side.map((pooja, index) => (
          <Reveal key={pooja.id} className="h-full min-h-0" delay={(index + 1) * 0.08}>
            <PoojaCard pooja={pooja} variant="compact" />
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <ButtonLink href={POOJAS_PATH} variant="light">
          View all poojas
        </ButtonLink>
      </div>
    </section>
  );
}
