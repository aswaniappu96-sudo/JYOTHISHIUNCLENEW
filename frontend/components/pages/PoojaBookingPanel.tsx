"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { PoojaOfferingFields } from "@/components/pages/PoojaOfferingFields";
import { telHref } from "@/lib/html";
import { savePoojaBookingAndWhatsApp } from "@/lib/pooja-booking";
import { whatsappUrl } from "@/lib/whatsapp";
import { abandonWhatsAppTab, prepareWhatsAppTab, redirectToWhatsApp } from "@/lib/whatsapp-return";
import type { Vendor } from "@/types/wordpress";

const fieldClass =
  "w-full rounded-xl bg-surface-container px-3 py-2.5 text-sm text-on-surface shadow-inner placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary focus:outline-none";

export function PoojaBookingPanel({
  slug,
  title,
  phone,
  whatsappNumber,
  whatsappMessage,
  bookingEnabled,
  vendors = [],
}: {
  slug: string;
  title: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  bookingEnabled: boolean;
  vendors?: Vendor[];
}) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const tab = prepareWhatsAppTab();
    try {
      const result = await savePoojaBookingAndWhatsApp({
        slug,
        title,
        form,
        vendors,
        whatsappNumber,
      });
      if (result.whatsappHref) {
        redirectToWhatsApp(result.whatsappHref, "pooja", tab);
        return;
      }
      abandonWhatsAppTab(tab);
      setDone(true);
    } catch (err) {
      abandonWhatsAppTab(tab);
      setError(err instanceof Error ? err.message : "Unable to send booking.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      id="book"
      className="scroll-mt-28 space-y-4 rounded-2xl bg-surface-high/90 p-6 shadow-2xl backdrop-blur-2xl md:p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] text-secondary uppercase">Sanctum reservation</p>
          <p className="text-lg font-semibold text-primary">Book this pooja</p>
        </div>
      </div>

      {done ? (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Your pooja booking is saved in our schedule. Dakshina is shared privately — there is no public price list.
          </p>
        </div>
      ) : bookingEnabled ? (
        <form onSubmit={onSubmit} className="space-y-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            Preferred date
            <input required type="date" name="preferred_date" className={`${fieldClass} mt-1`} />
          </label>
          <PoojaOfferingFields vendors={vendors} fieldClass={fieldClass} />
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            Full name
            <input required name="name" defaultValue={user?.name} placeholder="Your full name" className={`${fieldClass} mt-1`} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
              Phone
              <input required name="mobile" defaultValue={user?.mobile} className={`${fieldClass} mt-1`} />
            </label>
            <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
              Email
              <input required type="email" name="email" defaultValue={user?.email} className={`${fieldClass} mt-1`} />
            </label>
          </div>
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            Address / location
            <input required name="location" defaultValue={user?.location} className={`${fieldClass} mt-1`} />
          </label>
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            Sankalpa notes
            <textarea
              name="message"
              rows={3}
              placeholder="Gotra, nakshatra, or anything we should know for the sankalpa."
              className={`${fieldClass} mt-1 resize-none`}
            />
          </label>
          {error ? <p className="text-sm text-lotus">{error}</p> : null}
          <button
            disabled={busy}
            className="flex w-full items-center justify-center rounded-full bg-primary-container py-3.5 text-sm font-bold tracking-wide text-on-primary shadow-[0_0_25px_rgba(229,195,120,0.4)] transition hover:brightness-95 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Reserve sankalpa"}
          </button>
        </form>
      ) : (
        <p className="text-sm leading-relaxed text-on-surface-variant">
          Share a WhatsApp note and we will guide the next step. Dakshina is confirmed privately — nothing is billed on
          this page.
        </p>
      )}

      {phone ? (
        <a
          href={telHref(phone)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-surface-container py-2.5 text-sm text-on-surface transition hover:bg-surface-highest hover:text-primary"
        >
          Call {phone}
        </a>
      ) : null}
      {whatsappNumber ? (
        <a
          href={whatsappUrl(whatsappNumber, whatsappMessage)}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-surface-container py-2.5 text-sm text-secondary transition hover:bg-surface-highest hover:text-primary"
        >
          WhatsApp
        </a>
      ) : null}

      <div className="flex items-center justify-center gap-3 pt-1 text-xs text-on-surface-variant">
        <span>Confidential sankalpa</span>
        <span>•</span>
        <span>No public price list</span>
      </div>
    </div>
  );
}
