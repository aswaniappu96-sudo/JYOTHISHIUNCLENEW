"use client";

import { usePortal } from "@/components/portal/PortalProvider";

export function EnquireButton({
  children = "Enquire Now",
  subject = "",
  className,
}: {
  children?: React.ReactNode;
  subject?: string;
  className?: string;
}) {
  const { openEnquiry } = usePortal();

  return (
    <button
      type="button"
      onClick={() => openEnquiry(subject)}
      className={
        className ||
        "inline-flex items-center justify-center rounded-full border border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface-highest"
      }
    >
      {children}
    </button>
  );
}
