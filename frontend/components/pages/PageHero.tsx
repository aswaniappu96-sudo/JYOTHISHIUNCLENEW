import { ConchIcon } from "@/components/icons/ConchIcon";
import { PageHeading } from "@/components/home/SectionHeading";

export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-surface-high/70 px-4 py-1.5 shadow-[0_0_25px_rgba(72,41,179,0.3)] backdrop-blur-md ${className}`}
    >
      <span className="text-primary">
        <ConchIcon className="h-3 w-3" />
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">{children}</span>
      <span className="text-xs text-secondary">☉</span>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  titleAccent,
  copy,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleAccent?: string;
  copy: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-4 pt-10 pb-16 text-center md:px-12">
      <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-secondary-container/20 blur-[140px]" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center">
        <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
        {typeof title === "string" ? (
          <PageHeading as="h1" title={title} lead={titleAccent ? title : undefined} accent={titleAccent} className="max-w-4xl" />
        ) : (
          <h1 className="max-w-4xl font-serif text-[40px] font-medium leading-[0.95] tracking-[-0.03em] text-[#1A1106] sm:text-[52px]">
            {title}
          </h1>
        )}
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant">{copy}</p>
        {children}
      </div>
    </section>
  );
}
