export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-[30px] leading-[38px] text-primary md:text-[40px] md:leading-[48px]">{title}</h2>
      {copy ? <p className="mt-3 text-base leading-relaxed text-on-surface-variant">{copy}</p> : null}
    </div>
  );
}
