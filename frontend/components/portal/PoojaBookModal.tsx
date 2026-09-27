"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, ModalShell, fieldClass, goldBtn } from "@/components/portal/ModalShell";
import { PoojaOfferingFields } from "@/components/pages/PoojaOfferingFields";
import { savePoojaBookingAndWhatsApp } from "@/lib/pooja-booking";
import { abandonWhatsAppTab, prepareWhatsAppTab, redirectToWhatsApp } from "@/lib/whatsapp-return";
import type { Vendor } from "@/types/wordpress";

export function PoojaBookModal({
  pooja,
  whatsappNumber = "",
  onClose,
}: {
  pooja: { slug: string; title: string };
  whatsappNumber?: string;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => setVendors(Array.isArray(data) ? data : []))
      .catch(() => setVendors([]));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const tab = prepareWhatsAppTab();
    try {
      const result = await savePoojaBookingAndWhatsApp({
        slug: pooja.slug,
        title: pooja.title,
        form,
        vendors,
        whatsappNumber,
      });
      if (result.whatsappHref) {
        onClose();
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
    <ModalShell eyebrow="Pooja booking" title={pooja.title} onClose={onClose}>
      {done ? (
        <div className="grid gap-3">
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Your pooja booking is saved in our schedule.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <Field label="Selected Pooja">
            <input readOnly value={pooja.title} className={`${fieldClass} opacity-80`} />
          </Field>
          <PoojaOfferingFields vendors={vendors} fieldClass={fieldClass} />
          <Field label="Name">
            <input required name="name" defaultValue={user?.name} className={fieldClass} />
          </Field>
          <Field label="Address / Location">
            <input required name="location" defaultValue={user?.location} className={fieldClass} />
          </Field>
          <Field label="Phone">
            <input required name="mobile" defaultValue={user?.mobile} className={fieldClass} />
          </Field>
          <Field label="Email">
            <input required type="email" name="email" defaultValue={user?.email} className={fieldClass} />
          </Field>
          <Field label="Preferred Date">
            <input required type="date" name="preferred_date" className={fieldClass} />
          </Field>
          <Field label="Message / Additional Requirements">
            <textarea name="message" rows={3} className={fieldClass} />
          </Field>
          {error ? <p className="text-sm text-lotus">{error}</p> : null}
          <button disabled={busy} className={goldBtn}>
            {busy ? "Sending…" : "Submit pooja booking"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
