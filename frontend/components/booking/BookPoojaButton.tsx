"use client";

import { usePortal } from "@/components/portal/PortalProvider";
import type { Pooja } from "@/types/wordpress";

export function BookPoojaButton({
  pooja,
  children = "Book now",
  className = "inline-flex items-center justify-center rounded-full border border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface-highest",
}: {
  pooja: Pick<Pooja, "slug" | "title">;
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
