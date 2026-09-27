export function SectionChip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-primary-container px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-on-primary shadow-[0_8px_22px_rgba(201,162,39,0.35)]">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  badge,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  badge?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-[30px] leading-[38px] text-primary md:text-[40px] md:leading-[48px]">{title}</h2>
      {badge ? (
        <div className={align === "center" ? "mt-4 flex justify-center" : "mt-4"}>
          <SectionChip>{badge}</SectionChip>
        </div>
      ) : null}
      {copy ? <p className="mt-3 text-base leading-relaxed text-on-surface-variant">{copy}</p> : null}
    </div>
  );
}
