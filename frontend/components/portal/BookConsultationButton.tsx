"use client";

import { usePortal, type ConsultationPrefill } from "@/components/portal/PortalProvider";

export function BookConsultationButton({
  children = "Book Consultation",
  className,
  prefill,
}: {
  children?: React.ReactNode;
  className?: string;
  prefill?: ConsultationPrefill;
}) {
  const { openConsultation } = usePortal();

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={() => openConsultation(prefill)}
      className={
        className ||
        "inline-flex items-center justify-center rounded-full bg-primary-container px-4 py-1.5 text-sm font-semibold tracking-wide text-on-primary shadow-[0_8px_20px_-4px_rgba(201,162,39,0.45)] transition hover:brightness-95"
      }
    >
      {children}
    </button>
  );
}
