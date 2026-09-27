"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { saveProductBookingAndWhatsApp } from "@/lib/product-booking";
import { abandonWhatsAppTab, prepareWhatsAppTab, redirectToWhatsApp } from "@/lib/whatsapp-return";

const fieldClass =
  "mt-1 w-full rounded-xl bg-surface-lowest px-4 py-2.5 text-sm text-on-surface shadow-inner placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary focus:outline-none";

export function ProductEnquireForm({
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
      const result = await saveProductBookingAndWhatsApp({ slug, title, form, whatsappNumber });
      if (result.whatsappHref) {
        redirectToWhatsApp(result.whatsappHref, "product", tab);
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

  if (done) {
    return (
      <div className="space-y-3 rounded-2xl bg-surface-low p-6 text-center">
        <p className="font-serif text-xl text-primary">Product booking received</p>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          Your details are saved.
        </p>
      </div>
    );
  }

  return (
    <form id="product-form" onSubmit={onSubmit} className="space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-serif text-primary">ॐ</span>
        <div>
          <h3 className="font-serif text-xl text-primary">Reserve this product</h3>
          <p className="text-xs text-on-surface-variant">Share your details. Dakshina is confirmed privately — this page never shows a price.</p>
        </div>
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
        <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
          Quantity
          <input required type="number" min={1} defaultValue={1} name="quantity" className={fieldClass} />
        </label>
        <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase md:col-span-2">
          Message / sankalpa notes
          <textarea name="message" rows={3} className={fieldClass} placeholder="Size, packing, or anything we should know." />
        </label>
      </div>
      {error ? <p className="text-sm text-lotus">{error}</p> : null}
      <button
        disabled={busy}
        className="inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-primary-container via-primary to-primary-container px-6 py-4 text-sm font-bold tracking-wide text-on-primary shadow-[0_0_35px_rgba(201,162,39,0.35)] transition hover:brightness-95 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Buy this product"}
      </button>
      <p className="text-center text-xs text-on-surface-variant">The selected product is available. Dates and dakshina are confirmed on WhatsApp.</p>
    </form>
  );
}
