"use client";

import { usePortal } from "@/components/portal/PortalProvider";
import type { Product } from "@/types/wordpress";

export function ProductEnquiryButton({
  product,
  children = "Buy",
}: {
  product: Pick<Product, "slug" | "title">;
  children?: React.ReactNode;
}) {
  const { openProduct } = usePortal();

  return (
    <button
      type="button"
      onClick={() => openProduct(product)}
      className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface-highest"
    >
      {children}
    </button>
  );
}
