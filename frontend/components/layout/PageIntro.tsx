import { BrandText } from "@/components/brand/BrandText";
import { PageHeading } from "@/components/home/SectionHeading";
import { KICKER, LEAD } from "@/lib/layout";

export function PageIntro({
  eyebrow,
  title,
  copy,
  image,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  image?: string;
  wide?: boolean;
}) {
  return (
    <section className="relative overflow-hidden py-16">
      {image ? <img src={image} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" /> : null}
      <div className={`relative mx-auto w-full ${wide ? "max-w-[1400px] px-5 sm:px-8 lg:px-[56px]" : "max-w-4xl px-5"}`}>
        <p className={KICKER}>{eyebrow}</p>
        <PageHeading as="h1" title={title} className="mt-3" />
        {copy ? (
          <p className={`${LEAD} mt-4`}>
            <BrandText>{copy}</BrandText>
          </p>
        ) : null}
      </div>
    </section>
  );
}
