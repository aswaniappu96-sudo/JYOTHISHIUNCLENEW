"use client";

import { FormEvent, useState } from "react";
import { HEAR_ABOUT_OPTIONS } from "@/types/forms";
import { submitCustomerEnquiry } from "@/lib/api/submit";
import { useAuth } from "@/components/auth/AuthProvider";

const CONTACT_SUBJECTS = [
  "General Astrological Question",
  "Temple Pilgrimage Inquiry (Yatra)",
  "Media & Speaking Invocations",
  "Other Shastric Inquiries",
];

export function EnquiryForm({
  whatsappNumber: _whatsappNumber,
  variant = "home",
}: {
  whatsappNumber: string;
  variant?: "home" | "contact";
}) {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isContact = variant === "contact";

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
        location: String(data.get("location") || ""),
        source: String(data.get("source") || ""),
        subject: String(data.get("subject") || ""),
        message: String(data.get("message") || ""),
        website: String(data.get("website") || ""),
      });
      setSent(true);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="enquiry" className="relative my-8 w-full px-4 py-12 md:px-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-surface-low/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
        <div className={`${isContact ? "border-b border-surface-highest/40 pb-6 mb-6 text-left" : "mb-8 text-center"}`}>
          <span className="mb-2 inline-flex items-center rounded-full bg-surface-high px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            {isContact ? "Divine Communication Portal" : "Sanctuary Inquiries"}
          </span>
          <h2 className={`font-serif text-primary ${isContact ? "text-[32px]" : "text-[32px]"}`}>
            {isContact ? "General Shastric Enquiry" : "Send a Sacred Enquiry"}
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            {isContact
              ? "For temple yatras, spiritual speaking, and personalized astrological queries."
              : "Pooja, consultation, product, or travel — a short note is enough. We store this in WordPress and will get back to you."}
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              {isContact ? "Devotee Name" : "Your Name"}
              <input required name="name" defaultValue={user?.name} className="glass-input mt-1 w-full rounded-xl px-4 py-2.5" />
            </label>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              {isContact ? "Phone Number" : "Mobile / WhatsApp Number"}
              <input required name="mobile" defaultValue={user?.mobile} className="glass-input mt-1 w-full rounded-xl px-4 py-2.5" />
            </label>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Email Address
              <input required type="email" name="email" defaultValue={user?.email} className="glass-input mt-1 w-full rounded-xl px-4 py-2.5" />
            </label>
            {isContact ? (
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Inquiry Nature / Subject
                <select name="subject" defaultValue="General Astrological Question" className="glass-input mt-1 w-full rounded-xl px-4 py-2.5">
                  {CONTACT_SUBJECTS.map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Location / Country
                <input name="location" defaultValue={user?.location} className="glass-input mt-1 w-full rounded-xl px-4 py-2.5" />
              </label>
            )}
          </div>
          {isContact ? (
            <input type="hidden" name="location" defaultValue={user?.location} />
          ) : (
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Subject
              <input required name="subject" defaultValue="General enquiry" className="glass-input mt-1 w-full rounded-xl px-4 py-2.5" />
            </label>
          )}
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            How did you hear about JyothishiUncle?
            <select name="source" defaultValue={user?.source} className="glass-input mt-1 w-full rounded-xl px-4 py-2.5">
              {HEAR_ABOUT_OPTIONS.map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>
          </label>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            {isContact ? "Message / Divine Query" : "Your Query / Spiritual Message"}
            <textarea
              required
              name="message"
              rows={4}
              placeholder={
                isContact
                  ? "Elaborate on your requirement or spiritual concern with complete peace of mind..."
                  : "Briefly describe what clarity or guidance you are seeking..."
              }
              className="glass-input mt-1 w-full resize-none rounded-xl px-4 py-2.5"
            />
          </label>
          <div className={`flex ${isContact ? "flex-col items-center justify-between gap-4 sm:flex-row" : "flex-col"}`}>
            {isContact ? (
              <p className="text-xs text-primary">Guaranteed Astrological Review Within 24 Hours</p>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className={`${isContact ? "w-full sm:w-auto px-8 py-3.5 rounded-xl" : "w-full rounded-full py-2.5"} bg-primary text-lg font-bold text-on-primary shadow-[0_0_20px_rgba(229,195,120,0.4)] transition hover:bg-primary-container disabled:opacity-60`}
            >
              {busy ? "Sending…" : isContact ? "Transmit General Enquiry" : "Send Sacred Enquiry"}
            </button>
          </div>
          {sent ? (
            <p className="text-center text-sm text-on-surface-variant">
              {isContact
                ? "Your inquiry has reached our Pundit Secretariat. You will receive an oracle response within 24 hours."
                : "Received. We will contact you shortly."}
            </p>
          ) : null}
          {error ? <p className="text-center text-sm text-lotus">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}
