"use client";

import { usePortal } from "@/components/portal/PortalProvider";

export function BookConsultationButton({
  children = "Book Consultation",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { openConsultation } = usePortal();

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={() => openConsultation()}
      className={
        className ||
        "inline-flex items-center justify-center rounded-full bg-primary-container px-4 py-1.5 text-sm font-semibold tracking-wide text-on-primary shadow-[0_0_20px_-3px_rgba(229,195,120,0.5)] transition hover:bg-primary"
      }
    >
      {children}
    </button>
  );
}
