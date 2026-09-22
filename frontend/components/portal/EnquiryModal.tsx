"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, ModalShell, fieldClass, goldBtn } from "@/components/portal/ModalShell";
import { submitCustomerEnquiry } from "@/lib/api/submit";

export function EnquiryModal({
  subject,
  onClose,
}: {
  subject?: string;
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
      await submitCustomerEnquiry({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        mobile: String(data.get("mobile") || ""),
        subject: String(data.get("subject") || ""),
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
    <ModalShell eyebrow="General enquiry" title="Enquire now" onClose={onClose}>
      {done ? (
        <p className="text-sm leading-relaxed text-on-surface-variant">Received. We will contact you shortly.</p>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <Field label="Name">
            <input required name="name" defaultValue={user?.name} className={fieldClass} />
          </Field>
          <Field label="Phone">
            <input required name="mobile" defaultValue={user?.mobile} className={fieldClass} />
          </Field>
          <Field label="Email">
            <input required type="email" name="email" defaultValue={user?.email} className={fieldClass} />
          </Field>
          <Field label="Subject">
            <input required name="subject" defaultValue={subject} className={fieldClass} />
          </Field>
          <Field label="Message">
            <textarea required name="message" rows={4} className={fieldClass} />
          </Field>
          {error ? <p className="text-sm text-lotus">{error}</p> : null}
          <button disabled={busy} className={goldBtn}>
            {busy ? "Sending…" : "Send enquiry"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
