"use client";

import { useMemo } from "react";
import { ModalShell, goldBtn } from "@/components/portal/ModalShell";
import { readWhatsAppReturn } from "@/lib/whatsapp-return";

export function BookingReturnModal({ onClose }: { onClose: () => void }) {
  const pending = useMemo(() => readWhatsAppReturn(), []);
  const isFreeConsult = pending?.kind === "consultation" && pending.freeSlot === true;

  if (isFreeConsult) {
    return (
      <ModalShell eyebrow="Booking Saved" title="Your Free First Consultation Booked 10 Min" onClose={onClose}>
        <div className="grid gap-4">
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Your first 10-minute free consultation has been successfully booked and saved with us.
          </p>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            This free slot is for logged-in members only and is granted on the first successful booking.
          </p>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            If we need any further information, we will contact you.
          </p>
          <button type="button" className={goldBtn} onClick={onClose}>
            Continue
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell eyebrow="Booking Saved" title="Your Details Have Been Saved" onClose={onClose}>
      <div className="grid gap-4">
        <p className="text-sm leading-relaxed text-on-surface-variant">
          Your booking details have been successfully saved with us.
        </p>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          If you have not completed the payment through WhatsApp, please complete it when convenient. Your booking will
          remain saved even if the payment is pending.
        </p>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          If we need any further information, we will contact you.
        </p>
        <button type="button" className={goldBtn} onClick={onClose}>
          Continue
        </button>
      </div>
    </ModalShell>
  );
}
