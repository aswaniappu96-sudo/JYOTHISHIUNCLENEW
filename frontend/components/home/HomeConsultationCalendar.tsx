"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AvailabilityDay, AvailabilityMonth } from "@/types/forms";

export type SelectedConsultationDay = {
  date: string;
  slots: AvailabilityDay["slots"];
};

const monthCache = new Map<string, AvailabilityMonth>();
const monthInflight = new Map<string, Promise<AvailabilityMonth | null>>();
const bookedDates = new Set<string>();

function applyLocks(data: AvailabilityMonth | null) {
  if (!data || !bookedDates.size) return data;
  return {
    ...data,
    days: data.days.map((day) =>
      bookedDates.has(day.date) ? { ...day, available: false, booked: true, slots: [] } : day,
    ),
  };
}

function loadMonth(month: string) {
  const cached = monthCache.get(month);
  if (cached) return Promise.resolve(cached);
  const pending = monthInflight.get(month);
  if (pending) return pending;
  const request = fetch(`/api/consultation/availability?month=${month}`)
    .then((res) => res.json())
    .then((data: AvailabilityMonth) => {
      const next = applyLocks(data) || data;
      monthCache.set(month, next);
      monthInflight.delete(month);
      return next;
    })
    .catch(() => {
      monthInflight.delete(month);
      return null;
    });
  monthInflight.set(month, request);
  return request;
}

function monthString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-GB", { month: "long", year: "numeric" });
}

export function HomeConsultationCalendar({
  selectedDate = "",
  onSelect,
  compact = false,
}: {
  selectedDate?: string;
  onSelect?: (day: SelectedConsultationDay) => void;
  compact?: boolean;
}) {
  const [month, setMonth] = useState(monthString(new Date()));
  const [data, setData] = useState<AvailabilityMonth | null>(() => monthCache.get(monthString(new Date())) || null);
  const [localDate, setLocalDate] = useState(selectedDate);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    setLocalDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    loadMonth(month).then(setData);
    const onBooked = (event: Event) => {
      const bookedDate = (event as CustomEvent<{ date?: string }>).detail?.date || "";
      if (bookedDate) {
        bookedDates.add(bookedDate);
        setData((prev) => applyLocks(prev));
        setLocalDate((current) => (current === bookedDate ? "" : current));
        onSelectRef.current?.({ date: "", slots: [] });
      }
      monthCache.delete(month);
      monthInflight.delete(month);
      loadMonth(month).then((fresh) => setData(applyLocks(fresh)));
    };
    window.addEventListener("ju-consultation-booked", onBooked);
    return () => window.removeEventListener("ju-consultation-booked", onBooked);
  }, [month]);

  const activeDate = selectedDate || localDate;

  const pad = useMemo(() => {
    if (!data?.days[0]) return 0;
    return new Date(`${data.days[0].date}T12:00:00`).getDay();
  }, [data]);

  const shiftMonth = (delta: number) => {
    const [y, m] = month.split("-").map(Number);
    setMonth(monthString(new Date(y, m - 1 + delta, 1)));
    setLocalDate("");
    onSelect?.({ date: "", slots: [] });
  };

  const pick = (day: AvailabilityDay) => {
    setLocalDate(day.date);
    onSelect?.({ date: day.date, slots: day.slots || [] });
  };

  return (
    <div className={`rounded-2xl bg-surface-container/60 ${compact ? "p-2 md:p-3" : "p-4 md:p-5"}`}>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" suppressHydrationWarning onClick={() => shiftMonth(-1)} className="text-sm text-primary">
          ‹
        </button>
        <p className="font-serif text-lg text-on-surface">{monthLabel(month)}</p>
        <button type="button" suppressHydrationWarning onClick={() => shiftMonth(1)} className="text-sm text-primary">
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
          <span key={`${label}-${index}`} className="py-1 text-on-surface-variant/50">
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
            suppressHydrationWarning
            disabled={!day.available}
            onClick={() => pick(day)}
            className={`rounded-xl py-2 ${
              !day.available
                ? "cursor-not-allowed text-on-surface-variant/25 line-through"
                : activeDate === day.date
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-highest/70 text-on-surface hover:bg-primary/20"
            }`}
          >
            {day.date.slice(-2)}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-outline">
        {compact
          ? "Choose a free date, then complete the form below."
          : "Booked dates stay locked until the meeting is finished or the booking is deleted. Choose a free date, then tap Book Consultation."}
      </p>
    </div>
  );
}
