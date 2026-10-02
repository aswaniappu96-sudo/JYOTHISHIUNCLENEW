import { PageHeading } from "@/components/home/SectionHeading";

export function PageIntro({
  eyebrow,
  title,
  copy,
  image,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden px-5 py-16">
      {image ? <img src={image} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" /> : null}
      <div className="relative mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
        <PageHeading as="h1" title={title} className="mt-4" />
        {copy ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">{copy}</p> : null}
      </div>
    </section>
  );
}
