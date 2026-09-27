"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { submitConsultationBooking } from "@/lib/api/submit";
import type { AstrologyService } from "@/types/wordpress";
import type { AvailabilityMonth } from "@/types/forms";

function monthString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function ConsultationCalendar({
  services,
}: {
  services: AstrologyService[];
  defaultMeeting?: string;
}) {
  const { user } = useAuth();
  const bookable = services.filter((service) => service.booking_enabled);
  const [service, setService] = useState(bookable[0]?.slug || "");
  const [month, setMonth] = useState(monthString(new Date()));
  const [data, setData] = useState<AvailabilityMonth | null>(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDate("");
    setSlot("");
    fetch(`/api/consultation/availability?service=${encodeURIComponent(service)}&month=${month}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [service, month]);

  const selectedDay = useMemo(
    () => data?.days.find((day) => day.date === date),
    [data, date],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !slot) {
      setError("Please choose a date and time.");
      return;
    }
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await submitConsultationBooking({
        service,
        date,
        start_time: slot,
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        mobile: String(form.get("mobile") || ""),
        location: String(form.get("location") || ""),
        message: String(form.get("message") || ""),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to book.");
    } finally {
      setBusy(false);
    }
  }

  const shiftMonth = (delta: number) => {
    const [y, m] = month.split("-").map(Number);
    const next = new Date(y, m - 1 + delta, 1);
    setMonth(monthString(next));
  };

  if (!bookable.length) return null;

  return (
    <section id="consultation" className="px-5 py-8">
      <div className="glass-card mx-auto max-w-6xl rounded-[2rem] p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-saffron">Consultation calendar</p>
        <h2 className="mt-2 font-serif text-4xl text-primary">Choose a time</h2>
        <p className="mt-3 max-w-2xl text-sm text-on-surface-variant">
          Times below follow your local clock. Already booked slots are hidden. After you submit, we confirm a video consulting session.
        </p>

        {done ? (
          <p className="mt-8 text-sm text-ink/75">Request received. We will confirm the meeting link after checking the slot.</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <label className="text-sm">
                Service
                <select
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-saffron/30 bg-cream px-4 py-3"
                >
                  {bookable.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.title} ({item.duration_minutes} min)
                    </option>
                  ))}
                </select>
              </label>
              <div className="mt-4 flex items-center justify-between">
                <button type="button" onClick={() => shiftMonth(-1)} className="text-sm">
                  Previous
                </button>
                <p className="font-serif text-xl">{month}</p>
                <button type="button" onClick={() => shiftMonth(1)} className="text-sm">
                  Next
                </button>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
                {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
                  <span key={`${label}-${index}`} className="text-ink/40">
                    {label}
                  </span>
                ))}
                {data?.days.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    disabled={!day.available}
                    onClick={() => {
                      setDate(day.date);
                      setSlot("");
                    }}
                    className={`rounded-xl py-2 ${
                      !day.available
                        ? "text-ink/25"
                        : date === day.date
                          ? "bg-midnight text-cream"
                          : "bg-cream hover:bg-saffron/30"
                    }`}
                  >
                    {day.date.slice(-2)}
                  </button>
                ))}
              </div>
              {selectedDay ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedDay.slots.map((item) => (
                    <button
                      key={item.start}
                      type="button"
                      onClick={() => setSlot(item.start)}
                      className={`rounded-full px-3 py-2 text-sm ${slot === item.start ? "bg-midnight text-cream" : "border border-saffron/30"}`}
                    >
                      {item.start}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-ink/50">Select an available date.</p>
              )}
            </div>
            <div className="grid gap-3">
              <label className="text-sm">
                Name
                <input required name="name" defaultValue={user?.name} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-cream px-4 py-3" />
              </label>
              <label className="text-sm">
                Email
                <input required type="email" name="email" defaultValue={user?.email} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-cream px-4 py-3" />
              </label>
              <label className="text-sm">
                Mobile
                <input required name="mobile" defaultValue={user?.mobile} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-cream px-4 py-3" />
              </label>
              <label className="text-sm">
                Location
                <input name="location" defaultValue={user?.location} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-cream px-4 py-3" />
              </label>
              <label className="text-sm">
                Message
                <textarea name="message" rows={3} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-cream px-4 py-3" />
              </label>
              {error ? <p className="text-sm text-lotus">{error}</p> : null}
              <button disabled={busy} className="rounded-full bg-midnight px-5 py-3 text-sm text-cream disabled:opacity-60">
                {busy ? "Sending…" : "Submit consultation request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
