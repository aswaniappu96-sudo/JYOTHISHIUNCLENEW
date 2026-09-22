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
    <section className="relative overflow-hidden px-5 py-16 text-cream">
      {image ? <img src={image} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" /> : null}
      <div className="relative mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.28em] text-saffron">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl">{title}</h1>
        {copy ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/70 md:text-base">{copy}</p> : null}
      </div>
    </section>
  );
}
