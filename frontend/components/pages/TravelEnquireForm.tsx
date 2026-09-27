"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { saveTravelEnquiryAndWhatsApp } from "@/lib/travel-enquiry";
import { abandonWhatsAppTab, prepareWhatsAppTab, redirectToWhatsApp } from "@/lib/whatsapp-return";

const fieldClass =
  "mt-1 w-full rounded-xl bg-surface-container px-4 py-2.5 text-sm text-on-surface shadow-inner placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary focus:outline-none";

export function TravelEnquireForm({
  slug,
  title,
  whatsappNumber,
}: {
  slug: string;
  title: string;
  whatsappNumber: string;
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
      const result = await saveTravelEnquiryAndWhatsApp({ slug, title, form, whatsappNumber });
      if (result.whatsappHref) {
        redirectToWhatsApp(result.whatsappHref, "travel", tab);
        return;
      }
      abandonWhatsAppTab(tab);
      setDone(true);
    } catch (err) {
      abandonWhatsAppTab(tab);
      setError(err instanceof Error ? err.message : "Unable to send enquiry.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-3 rounded-2xl bg-surface-low p-6 text-center">
        <p className="font-serif text-xl text-primary">Yatra enquiry received</p>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          Your details are saved in our yatra bookings sheet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container text-[11px] font-bold text-on-primary">
            1
          </span>
          <h3 className="font-semibold text-on-surface">Your details</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            Full name
            <input required name="name" defaultValue={user?.name} className={fieldClass} />
          </label>
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            Phone / WhatsApp
            <input required name="mobile" defaultValue={user?.mobile} className={fieldClass} />
          </label>
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            Email
            <input required type="email" name="email" defaultValue={user?.email} className={fieldClass} />
          </label>
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            Address / location
            <input required name="location" defaultValue={user?.location} className={fieldClass} />
          </label>
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container text-[11px] font-bold text-on-primary">
            2
          </span>
          <h3 className="font-semibold text-on-surface">Yatra notes</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            Preferred dates
            <input name="preferred_dates" placeholder="Month or festival, if known" className={fieldClass} />
          </label>
          <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase md:col-span-2">
            Message / sankalpa notes
            <textarea name="message" rows={3} className={fieldClass} placeholder="Family size, gotra, or anything we should know." />
          </label>
        </div>
      </div>
      {error ? <p className="text-sm text-lotus">{error}</p> : null}
      <div className="flex flex-col gap-3 border-t border-outline-variant/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-on-surface-variant">Dates and dakshina are confirmed privately. Nothing is billed on this page.</p>
        <button
          disabled={busy}
          className="rounded-full bg-primary-container px-8 py-3 text-sm font-semibold text-on-primary shadow-[0_8px_24px_rgba(201,162,39,0.35)] transition hover:brightness-95 disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send yatra enquiry"}
        </button>
      </div>
    </form>
  );
}
