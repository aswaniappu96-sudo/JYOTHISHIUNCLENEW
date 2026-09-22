"use client";

import { useEffect, useMemo, useState } from "react";
import { usePortal } from "@/components/portal/PortalProvider";
import type { AvailabilityMonth } from "@/types/forms";

function monthString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-GB", { month: "long", year: "numeric" });
}

export function HomeConsultationCalendar() {
  const { openConsultation } = usePortal();
  const [month, setMonth] = useState(monthString(new Date()));
  const [data, setData] = useState<AvailabilityMonth | null>(null);
  const [date, setDate] = useState("");

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
  };

  return (
    <div className="rounded-2xl bg-surface-container/60 p-4 md:p-5">
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
            onClick={() => {
              setDate(day.date);
              openConsultation();
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
      <p className="mt-3 text-center text-xs text-outline">
        Past and booked dates are disabled. Choose a date to book.
      </p>
    </div>
  );
}
