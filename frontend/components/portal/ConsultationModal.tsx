"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, ModalShell, fieldClass, goldBtn } from "@/components/portal/ModalShell";
import { submitConsultationBooking } from "@/lib/api/submit";
import { CONSULTATION_TYPES, type AvailabilityMonth } from "@/types/forms";

function monthString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function ConsultationModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [month, setMonth] = useState(monthString(new Date()));
  const [data, setData] = useState<AvailabilityMonth | null>(null);
  const [date, setDate] = useState("");
  const [step, setStep] = useState<"calendar" | "form">("calendar");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDate("");
    fetch(`/api/consultation/availability?month=${month}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [month]);

  const pad = useMemo(() => {
    if (!data?.days[0]) return 0;
    return new Date(`${data.days[0].date}T12:00:00`).getDay();
  }, [data]);

  const shiftMonth = (delta: number) => {
    const [y, m] = month.split("-").map(Number);
    setMonth(monthString(new Date(y, m - 1 + delta, 1)));
    setStep("calendar");
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date) {
      setError("Please choose a date.");
      return;
    }
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await submitConsultationBooking({
        date,
        consultation_type: String(form.get("consultation_type") || ""),
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        mobile: String(form.get("mobile") || ""),
        location: String(form.get("location") || ""),
        message: String(form.get("message") || ""),
        website: String(form.get("website") || ""),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to book.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell eyebrow="Consultation" title="Book a date" onClose={onClose} wide>
      {done ? (
        <p className="text-sm leading-relaxed text-on-surface-variant">
          Booking received. We will confirm the meeting after reviewing the date.
        </p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => shiftMonth(-1)} className="text-sm text-primary">
                Previous
              </button>
              <p className="font-serif text-xl text-on-surface">{month}</p>
              <button type="button" onClick={() => shiftMonth(1)} className="text-sm text-primary">
                Next
              </button>
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">
              Oman time. Past and already booked dates are disabled. Admin can also block dates in WordPress.
            </p>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
                <span key={`${label}-${index}`} className="text-on-surface-variant/50">
                  {label}
                </span>
              ))}
              {Array.from({ length: pad }).map((_, index) => (
                <span key={`pad-${index}`} />
              ))}
              {data?.days.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  disabled={!day.available}
                  onClick={() => {
                    setDate(day.date);
                    setStep("form");
                  }}
                  className={`rounded-xl py-2 ${
                    !day.available
                      ? "cursor-not-allowed text-on-surface-variant/25 line-through"
                      : date === day.date
                        ? "bg-primary-container text-on-primary"
                        : "bg-surface-highest/70 text-on-surface hover:bg-primary/20"
                  }`}
                >
                  {day.date.slice(-2)}
                </button>
              ))}
            </div>
          </div>

          {step === "form" && date ? (
            <form onSubmit={onSubmit} className="grid gap-3">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
              <Field label="Selected Date">
                <input readOnly value={date} className={`${fieldClass} opacity-80`} />
              </Field>
              <Field label="Name">
                <input required name="name" defaultValue={user?.name} className={fieldClass} />
              </Field>
              <Field label="Phone Number">
                <input required name="mobile" defaultValue={user?.mobile} className={fieldClass} />
              </Field>
              <Field label="Email">
                <input required type="email" name="email" defaultValue={user?.email} className={fieldClass} />
              </Field>
              <Field label="Address">
                <input required name="location" defaultValue={user?.location} className={fieldClass} />
              </Field>
              <Field label="Consultation Type">
                <select required name="consultation_type" className={fieldClass}>
                  <option value="">Select</option>
                  {CONSULTATION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Message / Query">
                <textarea name="message" rows={3} className={fieldClass} />
              </Field>
              {error ? <p className="text-sm text-lotus">{error}</p> : null}
              <button disabled={busy} className={goldBtn}>
                {busy ? "Sending…" : "Submit consultation booking"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-on-surface-variant">Select an available date to continue.</p>
          )}
        </div>
      )}
    </ModalShell>
  );
}
