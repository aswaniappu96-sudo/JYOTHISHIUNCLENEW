import { AstrologerCard, PORTRAITS } from "@/components/pages/AstrologerCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/home/SectionHeading";
import type { Astrologer } from "@/types/wordpress";

export function AstrologersSection({
  astrologers,
  phone,
  whatsapp,
}: {
  astrologers: Astrologer[];
  phone?: string;
  whatsapp?: string;
}) {
  const featured = astrologers.filter((person) => Boolean(person.show_on_homepage));
  if (!featured.length) {
    return null;
  }

  return (
    <section id="astrologers" className="relative my-8 w-full px-4 py-12 md:px-12">
      <SectionHeading
        eyebrow="Our astrologers"
        title="Speak with a jyothisha guide"
        badge="Services"
        copy="Traditional Vedic jyothisha for birth-chart reading, predictions, matching, and family guidance. Call, chat, or book a session — the first call and chat with each astrologer is free."
      />
      <div className="mx-auto mt-12 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((person, index) => (
          <Reveal key={person.id || person.slug} delay={index * 0.08}>
            <AstrologerCard
              person={person}
              meta={PORTRAITS[index % PORTRAITS.length]}
              phone={phone}
              whatsapp={whatsapp}
            />
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <ButtonLink href="/astrologers" variant="light">
          View all astrologers
        </ButtonLink>
      </div>
    </section>
  );
}
