"use client";

import { usePortal } from "@/components/portal/PortalProvider";
import type { Pooja } from "@/types/wordpress";

export function BookPoojaButton({
  pooja,
  children = "Book now",
  className = "inline-flex items-center justify-center rounded-full bg-[#E9C07A] px-5 py-2.5 text-sm font-semibold text-[#1E160E] transition hover:bg-[#E0B46D]",
}: {
  pooja: Pick<Pooja, "slug" | "title"> & { vendor?: string };
  children?: React.ReactNode;
  className?: string;
}) {
  const { openPooja } = usePortal();

  return (
    <button
      type="button"
      onClick={() => openPooja(pooja)}
      className={className}
    >
      {children}
    </button>
  );
}
