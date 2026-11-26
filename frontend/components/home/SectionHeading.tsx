import type { ReactNode } from "react";
import { BrandMark, BrandText } from "@/components/brand/BrandText";
import { isBrandName } from "@/lib/brand";
import { LEAD, PAGE_ACCENT, PAGE_TITLE_GOLD, PAGE_TITLE_SHAPE, splitHeading } from "@/lib/layout";

export function HeadingHighlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`${PAGE_ACCENT} ${className}`.trim()}>{children}</span>;
}

export function SectionEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2.5 ${className}`.trim()}>
      <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-[#C4A227]" fill="currentColor" aria-hidden>
        <path d="M12 1.6 13.7 9 21 12l-7.3 3L12 22.4 10.3 15 3 12l7.3-3L12 1.6Z" />
      </svg>
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A6F3A]">{children}</span>
    </p>
  );
}

export function PageHeading({
  as: Tag = "h2",
  title = "",
  lead,
  accent,
  rest,
  className = "",
  tone = "gold",
}: {
  as?: "h1" | "h2";
  title?: string;
  lead?: string;
  accent?: string;
  rest?: string;
  className?: string;
  tone?: "gold" | "ink";
}) {
  const parts = splitHeading(title, lead, accent);
  const brandLead = isBrandName(parts.lead);
  const brandAccent = isBrandName(parts.accent);
  const titleColor = tone === "ink" ? "text-on-surface" : PAGE_TITLE_GOLD;
  const brandInTitle = "brand-mark--in-title";
  return (
    <Tag className={`${PAGE_TITLE_SHAPE} ${titleColor} ${className}`.trim()}>
      {brandLead ? <BrandMark className={brandInTitle} /> : <BrandText>{parts.lead}</BrandText>}
      {parts.accent ? (
        <>
          {parts.lead ? " " : null}
          <span className={PAGE_ACCENT}>
            {brandAccent ? <BrandMark className={brandInTitle} /> : <BrandText>{parts.accent}</BrandText>}
          </span>
        </>
      ) : null}
      {rest ? (
        <>
          {" "}
          <BrandText>{rest}</BrandText>
        </>
      ) : null}
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
      <SectionEyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</SectionEyebrow>
      <TwoToneHeading title={title} lead={lead} accent={accent} className="mt-1" />
      {copy ? <p className={`${LEAD} mx-auto mt-3 ${align === "center" ? "" : "mx-0"}`}>{copy}</p> : null}
    </div>
  );
}
