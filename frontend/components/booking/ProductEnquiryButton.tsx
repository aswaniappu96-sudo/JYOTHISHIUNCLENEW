"use client";

import { usePortal } from "@/components/portal/PortalProvider";
import type { Product } from "@/types/wordpress";

export function ProductEnquiryButton({
  product,
  children = "Buy",
  className = "inline-flex items-center justify-center rounded-full bg-[#E9C07A] px-5 py-2.5 text-sm font-semibold text-[#1E160E] transition hover:bg-[#E0B46D]",
}: {
  product: Pick<Product, "slug" | "title">;
  children?: React.ReactNode;
  className?: string;
}) {
  const { openProduct } = usePortal();

  return (
    <button type="button" onClick={() => openProduct(product)} className={className}>
      {children}
    </button>
  );
}
