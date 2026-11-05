"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { HomeConsultationCalendar } from "@/components/home/HomeConsultationCalendar";
import { Field, ModalShell, fieldClass, goldBtn } from "@/components/portal/ModalShell";
import type { ConsultationPrefill } from "@/components/portal/PortalProvider";
import { submitConsultationBooking } from "@/lib/api/submit";
import { consultationVideoPath } from "@/lib/consultationRoom";
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
  const { t } = usePrefs();
  const usingFree = Boolean(claimFree && user);
  const astrologerName = prefill?.astrologerName?.trim() || CONSULTATION_ONLY_LABEL;
  const fromPageCalendar = Boolean(prefill?.date);
  const [date, setDate] = useState(prefill?.date || "");
  const [slots, setSlots] = useState(prefill?.slots || []);
  const [slot, setSlot] = useState(prefill?.slots?.[0]?.start || "");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [videoPath, setVideoPath] = useState("");
  const [error, setError] = useState("");
  const serviceOptions = useMemo(() => {
    const list = (prefill?.services || ["Kundli", "Prashna", "Matchmaking", "Family guidance", "Remedies"]).filter(Boolean);
    return list.some((item) => item.toLowerCase() === "other") ? list : [...list, "Other"];
  }, [prefill?.services]);
  const presetService = serviceOptions.includes(prefill?.purpose || "") ? prefill?.purpose || "" : "";
  const otherNote = presetService ? "" : prefill?.purpose || "";
  const [service, setService] = useState(() => presetService || (otherNote ? "Other" : ""));

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
    const chosen = String(form.get("service") || service || "");
    const note = String(form.get("message") || "");
    const message = chosen ? `Service: ${chosen}. ${note}`.trim() : note;

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
        window.dispatchEvent(new Event("ju-free-claimed"));
        await refresh();
      }
      window.dispatchEvent(new CustomEvent("ju-consultation-booked", { detail: { date } }));
      const bookedId = result.id && result.id > 0 ? result.id : 0;
      const nextVideoPath = bookedId ? consultationVideoPath(bookedId, result.room_key) : "";
      const videoLink = nextVideoPath ? new URL(nextVideoPath, window.location.origin).toString() : "";
      setVideoPath(nextVideoPath);
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
        videoLink,
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
          <p className="font-serif text-[28px] font-medium leading-[0.95] tracking-[-0.03em] text-on-surface">Your slot is booked.</p>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            This date is now locked on the calendar. A confirmation with this date is emailed to you and to the astrologer.
            The video room opens 10 minutes before your booked time.
          </p>
          {videoPath ? (
            <a href={videoPath} className={`${goldBtn} inline-flex items-center justify-center text-center`}>
              Open your video room
            </a>
          ) : null}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

          {user ? null : (
            <>
              <p className="gold-notice rounded-xl border border-[#E9C07A] bg-[#FFF4D8] px-3.5 py-2.5 text-[13px] font-semibold leading-relaxed text-[#6B4A12]">
                {t("video.free")}
              </p>
              <p className="rounded-xl border border-[#EAD9B0] bg-[#FFF8EB] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#6B4A12]">
                Login to keep this booking, your dates, and your activity saved in your account.
              </p>
            </>
          )}

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
            <p className="rounded-xl border border-[#E9C07A] bg-[#FFF4D8] px-3.5 py-2.5 text-[13px] font-semibold leading-relaxed text-[#6B4A12]">
              This booking includes your first 10-minute free consultation.
            </p>
          ) : user ? (
            <p className="rounded-xl bg-surface-container/70 px-3 py-2 text-xs leading-relaxed text-on-surface-variant">
              This booking continues without the 10-minute free slot.
            </p>
          ) : null}

          <p className="rounded-xl bg-surface-container/70 px-3 py-2 text-xs leading-relaxed text-on-surface-variant">
            After you submit, the booked date is emailed to you and to the astrologer. WhatsApp then opens so the astrologer's phone has the same date and your video link.
            {usingFree
              ? " The note includes your first 10-minute free consultation."
              : " The note asks for the payment details."}
          </p>

          <Field label="Name">
            <input required name="name" autoComplete="name" defaultValue={user?.name} className={fieldClass} />
          </Field>
          <Field label="Location">
            <input required name="location" autoComplete="street-address" defaultValue={user?.location} className={fieldClass} />
          </Field>
          <Field label="Phone number">
            <input required name="mobile" type="tel" autoComplete="tel" defaultValue={user?.mobile} className={fieldClass} />
          </Field>
          <Field label="Email (for confirmation)">
            <input required type="email" name="email" autoComplete="email" defaultValue={user?.email} className={fieldClass} />
          </Field>
          <Field label="Service">
            <select required name="service" value={service} onChange={(event) => setService(event.target.value)} className={fieldClass}>
              <option value="" disabled>
                Select a service
              </option>
              {serviceOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
          {service === "Other" ? (
            <Field label="What would you like help with?">
              <textarea
                required
                name="message"
                rows={4}
                defaultValue={otherNote}
                className={fieldClass}
                placeholder="Name the service or the question you want answered."
              />
            </Field>
          ) : null}

          {error ? <p className="text-sm text-lotus">{error}</p> : null}
          <button disabled={busy} className={goldBtn}>
            {busy ? "Sending…" : "Submit booking"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
