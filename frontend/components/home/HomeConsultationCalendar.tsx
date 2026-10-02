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
  variant = "default",
}: {
  selectedDate?: string;
  onSelect?: (day: SelectedConsultationDay) => void;
  compact?: boolean;
  variant?: "default" | "cream";
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
  const trailing = Math.max(0, 42 - pad - (data?.days.length || 0));

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

  if (variant === "cream") {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EAD9B0]/70 bg-[#FFF8EB] text-[#B87E3B]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
                <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#2B2116]">{monthLabel(month)}</h3>
            <span className="ml-1 hidden items-center gap-1.5 rounded-full bg-[#F5FFE9] px-2.5 py-1 text-[10px] font-medium text-[#2A7A2A] ring-1 ring-[#B9E6A8] md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
              Live slots open
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => shiftMonth(-1)}
              className="grid h-8 w-8 place-items-center rounded-full border border-[#EAD9B0] bg-white text-[#8A6A3A] transition hover:bg-[#FFF8EB]"
              aria-label="Previous month"
            >
              ‹
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => shiftMonth(1)}
              className="grid h-8 w-8 place-items-center rounded-full border border-[#EAD9B0] bg-white text-[#8A6A3A] transition hover:bg-[#FFF8EB]"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>
        <div className="mt-3 grid shrink-0 grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, index) => (
            <div key={`${label}-${index}`} className="py-1 text-center text-[10px] font-semibold tracking-[0.08em] text-[#A79A86]">
              {label}
            </div>
          ))}
        </div>
        <div className="mt-1 grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-1.5">
          {Array.from({ length: pad }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-0 rounded-md bg-[#FAF6ED]/50" />
          ))}
          {data?.days.map((day) => {
            const selected = activeDate === day.date;
            const closed = !day.available;
            const hasSlots = Boolean(day.available && day.slots?.length);
            return (
              <button
                key={day.date}
                type="button"
                suppressHydrationWarning
                disabled={closed}
                onClick={() => pick(day)}
                className={[
                  "group relative flex min-h-0 w-full flex-col items-center justify-center gap-0.5 rounded-[10px] text-[13px] font-medium transition-all",
                  closed
                    ? "cursor-not-allowed bg-[#FAF6ED] text-[#C9BFAE] line-through decoration-[#D8CFBE]"
                    : "bg-white text-[#3E3226] hover:bg-[#FFF8EB] hover:text-[#2B2116]",
                  selected ? "!bg-[#E9C07A] !text-[#2B2116] shadow-[0_3px_10px_-4px_rgba(180,130,40,0.5)] ring-1 ring-[#D6A95A]" : "",
                ].join(" ")}
              >
                <span>{Number(day.date.slice(-2))}</span>
                {hasSlots && !selected ? <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" /> : null}
                {selected ? <span className="h-1.5 w-1.5 rounded-full bg-[#2B2116]/60" /> : null}
              </button>
            );
          })}
          {Array.from({ length: trailing }).map((_, index) => (
            <div key={`trail-${index}`} className="min-h-0 rounded-md bg-[#FAF6ED]/50" />
          ))}
        </div>
        <div className="mt-3 flex shrink-0 flex-wrap items-center gap-3 border-t border-[#F5EEDD] pt-3 text-[10px] text-[#9A8C7A]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#E9C07A] ring-1 ring-[#D6A95A]" /> Selected
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" /> Available
          </span>
          <span className="inline-flex items-center gap-1.5 opacity-60">
            <span className="h-2 w-2 rounded-[4px] bg-[#FAF6ED] ring-1 ring-[#EAD9B0]" /> Unavailable
          </span>
          <span className="ml-auto hidden items-center gap-1 text-[11px] md:inline-flex">Your local clock</span>
        </div>
      </div>
    );
  }

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
