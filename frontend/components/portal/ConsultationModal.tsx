"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { HomeConsultationCalendar } from "@/components/home/HomeConsultationCalendar";
import { Field, ModalShell, fieldClass, goldBtn } from "@/components/portal/ModalShell";
import type { ConsultationPrefill } from "@/components/portal/PortalProvider";
import { submitConsultationBooking } from "@/lib/api/submit";
import { CONSULTATION_ONLY_LABEL } from "@/lib/consultation";
import { consultationWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import { abandonWhatsAppTab, prepareWhatsAppTab, redirectToWhatsApp } from "@/lib/whatsapp-return";
import type { AvailabilityMonth } from "@/types/forms";

function formatDate(value: string) {
  if (!value) return "";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toHm(value: string) {
  return value.slice(0, 5);
}

export function ConsultationModal({
  onClose,
  claimFree = false,
  prefill,
}: {
  onClose: () => void;
  claimFree?: boolean;
  prefill?: ConsultationPrefill | null;
}) {
  const { user, refresh } = useAuth();
  const usingFree = Boolean(claimFree && user);
  const astrologerName = prefill?.astrologerName?.trim() || CONSULTATION_ONLY_LABEL;
  const fromPageCalendar = Boolean(prefill?.date);
  const [date, setDate] = useState(prefill?.date || "");
  const [slots, setSlots] = useState(prefill?.slots || []);
  const [slot, setSlot] = useState(prefill?.slots?.[0]?.start || "");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date) return;
    if (prefill?.date === date && prefill.slots?.length) {
      setSlots(prefill.slots);
      setSlot((current) => current || prefill.slots?.[0]?.start || "");
      return;
    }
    const month = date.slice(0, 7);
    fetch(`/api/consultation/availability?month=${month}`)
      .then((res) => res.json())
      .then((data: AvailabilityMonth) => {
        const day = data.days?.find((item) => item.date === date);
        const nextSlots = day?.slots || [];
        setSlots(nextSlots);
        setSlot((current) => (nextSlots.some((item) => item.start === current) ? current : nextSlots[0]?.start || ""));
      })
      .catch(() => setSlots([]));
  }, [date, prefill]);

  const selectedLabel = useMemo(() => formatDate(date), [date]);
  const whatsapp = prefill?.whatsapp || "";
  const selectedSlot = slots.find((item) => item.start === slot);
  const timeLabel = selectedSlot ? `${toHm(selectedSlot.start)}–${toHm(selectedSlot.end)}` : toHm(slot);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date) {
      setError("Please choose a date on the calendar.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const start = toHm(slot || String(form.get("start_time") || ""));
    if (!start) {
      setError("Please choose a preferred time.");
      return;
    }
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const mobile = String(form.get("mobile") || "");
    const location = String(form.get("location") || form.get("address") || "");
    const message = String(form.get("message") || "");

    setBusy(true);
    setError("");
    const tab = prepareWhatsAppTab();
    try {
      const result = await submitConsultationBooking({
        date,
        start_time: start,
        consultation_type: "other",
        name,
        email,
        mobile,
        location,
        message,
        astrologer_name: astrologerName,
        website: String(form.get("website") || ""),
        claim_free_slot: usingFree,
      });
      const freeSlot = result.free_slot === true;
      if (freeSlot) {
        void refresh();
      }
      window.dispatchEvent(new CustomEvent("ju-consultation-booked", { detail: { date } }));
      const waMessage = consultationWhatsAppMessage({
        name,
        address: location,
        phone: mobile,
        email,
        dateLabel: selectedLabel || date,
        timeLabel,
        reason: message,
        astrologer: astrologerName,
        freeSlot,
      });
      const waLink = whatsapp ? whatsappUrl(whatsapp, waMessage) : "";
      if (waLink) {
        onClose();
        redirectToWhatsApp(waLink, "consultation", tab, { freeSlot });
        return;
      }
      abandonWhatsAppTab(tab);
      setDone(true);
    } catch (err) {
      abandonWhatsAppTab(tab);
      setError(err instanceof Error ? err.message : "Unable to book.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell
      eyebrow="Consultation booking"
      title="Your booking details"
      onClose={onClose}
      wide={!fromPageCalendar}
    >
      {done ? (
        <div className="grid gap-3">
          <p className="font-serif text-2xl text-primary">Your slot is booked.</p>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            This date is now locked on the calendar. Your details are saved in the consultation schedule.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

          <Field label="Astrologer">
            <input readOnly name="astrologer_name" value={astrologerName} className={`${fieldClass} opacity-90`} />
          </Field>

          {fromPageCalendar ? (
            <Field label="Selected date">
              <input readOnly value={selectedLabel} className={`${fieldClass} opacity-90`} />
            </Field>
          ) : (
            <HomeConsultationCalendar
              compact
              selectedDate={date}
              onSelect={(day) => {
                setDate(day.date);
                setSlots(day.slots || []);
                setSlot(day.slots?.[0]?.start || "");
                setError("");
              }}
            />
          )}

          {slots.length ? (
            <Field label="Preferred time slot">
              <select required name="start_time" value={slot} onChange={(event) => setSlot(event.target.value)} className={fieldClass}>
                {slots.map((item) => (
                  <option key={item.start} value={item.start}>
                    {item.start} – {item.end}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <Field label="Preferred time">
              <input
                required
                type="time"
                name="start_time"
                value={slot}
                onChange={(event) => setSlot(event.target.value)}
                className={fieldClass}
              />
            </Field>
          )}

          {usingFree ? (
            <p className="rounded-xl bg-surface-container/70 px-3 py-2 text-xs leading-relaxed text-on-surface-variant">
              This booking includes your first 10-minute free consultation.
            </p>
          ) : (
            <p className="rounded-xl bg-surface-container/70 px-3 py-2 text-xs leading-relaxed text-on-surface-variant">
              This booking continues without the 10-minute free slot.
            </p>
          )}

          <p className="rounded-xl bg-surface-container/70 px-3 py-2 text-xs leading-relaxed text-on-surface-variant">
            If this time does not work, or there is any issue with the slot, contact us directly
            {whatsapp ? (
              <>
                {" "}
                on{" "}
                <a
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                  href={whatsappUrl(whatsapp, `Hello, I would like to book a consultation${date ? ` on ${date}` : ""}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </>
            ) : (
              " on WhatsApp"
            )}
            . After you submit, you will be redirected to WhatsApp with your details
            {usingFree
              ? " and a note that this is your first 10-minute free consultation."
              : " and a note that you need to know about payment."}
          </p>

          <Field label="Name">
            <input required name="name" autoComplete="name" defaultValue={user?.name} className={fieldClass} />
          </Field>
          <Field label="Address">
            <input required name="location" autoComplete="street-address" defaultValue={user?.location} className={fieldClass} />
          </Field>
          <Field label="Phone number">
            <input required name="mobile" type="tel" autoComplete="tel" defaultValue={user?.mobile} className={fieldClass} />
          </Field>
          <Field label="Email (for confirmation)">
            <input required type="email" name="email" autoComplete="email" defaultValue={user?.email} className={fieldClass} />
          </Field>
          <Field label="Purpose of Booking">
            <textarea
              required
              name="message"
              rows={4}
              className={fieldClass}
              placeholder="Share why you are booking — for example marriage matching, jathakam, family guidance, or a question you want clarity on."
            />
          </Field>

          {error ? <p className="text-sm text-lotus">{error}</p> : null}
          <button disabled={busy} className={goldBtn}>
            {busy ? "Sending…" : "Submit booking"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
