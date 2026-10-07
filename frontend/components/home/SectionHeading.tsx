import { KICKER, LEAD, PAGE_ACCENT, PAGE_TITLE, splitHeading } from "@/lib/layout";

export function SectionChip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-primary-container px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-on-primary shadow-[0_8px_22px_rgba(201,162,39,0.35)]">
      {children}
    </span>
  );
}

export function PageHeading({
  as: Tag = "h2",
  title = "",
  lead,
  accent,
  rest,
  className = "",
}: {
  as?: "h1" | "h2";
  title?: string;
  lead?: string;
  accent?: string;
  rest?: string;
  className?: string;
}) {
  const parts = splitHeading(title, lead, accent);
  return (
    <Tag className={`${PAGE_TITLE} ${className}`.trim()}>
      {parts.lead}
      {parts.accent ? (
        <>
          {parts.lead ? " " : null}
          <span className={`${PAGE_ACCENT} relative inline-block`}>
            <span className="relative z-10">{parts.accent}</span>
            <span className="ju-heading-mark absolute right-0 bottom-[0.18em] left-0 -z-0 h-[0.36em]" />
          </span>
        </>
      ) : null}
      {rest ? <> {rest}</> : null}
    </Tag>
  );
}

export function TwoToneHeading({
  title = "",
  lead,
  accent,
  className = "",
}: {
  title?: string;
  lead?: string;
  accent?: string;
  className?: string;
}) {
  return <PageHeading title={title} lead={lead} accent={accent} className={className} />;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  accent,
  copy,
  badge,
  align = "center",
}: {
  eyebrow: string;
  title?: string;
  lead?: string;
  accent?: string;
  copy?: string;
  badge?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      <p className={KICKER}>{eyebrow}</p>
      <TwoToneHeading title={title} lead={lead} accent={accent} className="mt-1" />
      {badge ? (
        <div className={align === "center" ? "mt-4 flex justify-center" : "mt-4"}>
          <SectionChip>{badge}</SectionChip>
        </div>
      ) : null}
      {copy ? <p className={`${LEAD} mx-auto mt-3 ${align === "center" ? "" : "mx-0"}`}>{copy}</p> : null}
    </div>
  );
}
