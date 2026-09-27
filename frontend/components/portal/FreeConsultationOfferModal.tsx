"use client";

import { ModalShell, ghostBtn, goldBtn } from "@/components/portal/ModalShell";

export function FreeConsultationOfferModal({
  onAccept,
  onCancel,
}: {
  onAccept: () => void;
  onCancel: () => void;
}) {
  return (
    <ModalShell eyebrow="Free consultation" title="You get 10 min free consultation" onClose={onCancel}>
      <div className="grid gap-4">
        <p className="text-sm leading-relaxed text-on-surface-variant">
          After login, your first consultation booking includes a 10-minute free slot.
        </p>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          You can cancel this offer and continue without the free 10-minute slot. This applies only to consultation
          booking, not pooja, products, or temple yatra.
        </p>
        <button type="button" className={goldBtn} onClick={onAccept}>
          Continue with 10 min free
        </button>
        <button type="button" className={ghostBtn} onClick={onCancel}>
          Cancel — continue without free
        </button>
      </div>
    </ModalShell>
  );
}
