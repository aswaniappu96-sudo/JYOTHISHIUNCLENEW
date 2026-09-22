"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, ModalShell, fieldClass, goldBtn } from "@/components/portal/ModalShell";
import { submitProductEnquiry } from "@/lib/api/submit";

export function ProductBookModal({
  product,
  onClose,
}: {
  product: { slug: string; title: string };
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
    const data = new FormData(event.currentTarget);
    try {
      await submitProductEnquiry({
        product: product.slug,
        product_title: product.title,
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        mobile: String(data.get("mobile") || ""),
        location: String(data.get("location") || ""),
        quantity: Number(data.get("quantity") || 1),
        message: String(data.get("message") || ""),
        website: String(data.get("website") || ""),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell eyebrow="Product enquiry" title={product.title} onClose={onClose}>
      {done ? (
        <p className="text-sm leading-relaxed text-on-surface-variant">
          Enquiry received. We will confirm availability with you.
        </p>
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
            {busy ? "Sending…" : "Submit product enquiry"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
