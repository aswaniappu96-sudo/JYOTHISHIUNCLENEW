"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, ModalShell, fieldClass, goldBtn } from "@/components/portal/ModalShell";
import { submitPoojaBooking } from "@/lib/api/submit";

export function PoojaBookModal({
  pooja,
  onClose,
}: {
  pooja: { slug: string; title: string };
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
      await submitPoojaBooking({
        pooja: pooja.slug,
        pooja_title: pooja.title,
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        mobile: String(data.get("mobile") || ""),
        location: String(data.get("location") || ""),
        preferred_date: String(data.get("preferred_date") || ""),
        message: String(data.get("message") || ""),
        website: String(data.get("website") || ""),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send booking.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell eyebrow="Pooja booking" title={pooja.title} onClose={onClose}>
      {done ? (
        <p className="text-sm leading-relaxed text-on-surface-variant">
          Booking received. We will confirm the ritual details with you shortly.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <Field label="Selected Pooja">
            <input readOnly value={pooja.title} className={`${fieldClass} opacity-80`} />
          </Field>
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
