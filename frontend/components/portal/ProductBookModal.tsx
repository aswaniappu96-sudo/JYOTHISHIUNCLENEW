"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, ModalShell, fieldClass, goldBtn } from "@/components/portal/ModalShell";
import { saveProductBookingAndWhatsApp } from "@/lib/product-booking";
import { abandonWhatsAppTab, prepareWhatsAppTab, redirectToWhatsApp } from "@/lib/whatsapp-return";

export function ProductBookModal({
  product,
  whatsappNumber = "",
  onClose,
}: {
  product: { slug: string; title: string };
  whatsappNumber?: string;
  onClose: () => void;
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
      const result = await saveProductBookingAndWhatsApp({
        slug: product.slug,
        title: product.title,
        form,
        whatsappNumber,
      });
      if (result.whatsappHref) {
        onClose();
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

  return (
    <ModalShell eyebrow="Product booking" title={product.title} onClose={onClose}>
      {done ? (
        <div className="grid gap-3">
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Your product booking is saved.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <Field label="Selected Product">
            <input readOnly value={product.title} className={`${fieldClass} opacity-80`} />
          </Field>
          <Field label="Name">
            <input required name="name" defaultValue={user?.name} className={fieldClass} />
          </Field>
          <Field label="Address">
            <input required name="location" defaultValue={user?.location} className={fieldClass} />
          </Field>
          <Field label="Phone">
            <input required name="mobile" defaultValue={user?.mobile} className={fieldClass} />
          </Field>
          <Field label="Email">
            <input required type="email" name="email" defaultValue={user?.email} className={fieldClass} />
          </Field>
          <Field label="Quantity">
            <input required type="number" min={1} defaultValue={1} name="quantity" className={fieldClass} />
          </Field>
          <Field label="Message">
            <textarea name="message" rows={3} className={fieldClass} />
          </Field>
          {error ? <p className="text-sm text-lotus">{error}</p> : null}
          <button disabled={busy} className={goldBtn}>
            {busy ? "Sending…" : "Submit product booking"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
