import Link from "next/link";
import type { ReactNode } from "react";
import { TwoToneHeading } from "@/components/home/SectionHeading";
import { HScroll } from "@/components/ui/HScroll";
import { KICKER, LEAD, SECTION_INNER } from "@/lib/layout";

export function CollectionRail({
  id,
  kicker,
  title,
  lead,
  accent,
  copy,
  href,
  hrefLabel = "View all",
  layout = "grid",
  children,
}: {
  id?: string;
  kicker?: string;
  title: string;
  lead?: string;
  accent?: string;
  copy?: string;
  href: string;
  hrefLabel?: string;
  layout?: "grid" | "scroll";
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative w-full py-6 md:py-8">
      <div className={SECTION_INNER}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-4xl">
            {kicker ? <p className={KICKER}>{kicker}</p> : null}
            <TwoToneHeading title={title} lead={lead} accent={accent} className="mt-1" />
            {copy ? <p className={`${LEAD} mt-3`}>{copy}</p> : null}
          </div>
          <Link href={href} className="shrink-0 text-[13px] font-semibold text-primary hover:underline">
            {hrefLabel}
          </Link>
        </div>
        {layout === "scroll" ? (
          <HScroll>{children}</HScroll>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
