"use client";

import { useEffect, useState } from "react";
import { HomeConsultationCalendar, type SelectedConsultationDay } from "@/components/home/HomeConsultationCalendar";
import { usePortal } from "@/components/portal/PortalProvider";
import { CONSULTATION_ONLY_LABEL } from "@/lib/consultation";
import { whatsappUrl } from "@/lib/whatsapp";

export function ConsultationBookPanel({
  whatsappNumber,
  purpose = "",
  selected,
  onSelected,
}: {
  whatsappNumber: string;
  purpose?: string;
  selected: SelectedConsultationDay | null;
  onSelected: (day: SelectedConsultationDay | null) => void;
}) {
  const { openConsultation } = usePortal();
  const [needDate, setNeedDate] = useState(false);

  useEffect(() => {
    const onBooked = (event: Event) => {
      const bookedDate = (event as CustomEvent<{ date?: string }>).detail?.date || "";
      if (!bookedDate || selected?.date === bookedDate) {
        onSelected(null);
      }
    };
    window.addEventListener("ju-consultation-booked", onBooked);
    return () => window.removeEventListener("ju-consultation-booked", onBooked);
  }, [onSelected, selected?.date]);

  const openForm = (requireDate: boolean) => {
    if (requireDate && !selected?.date) {
      setNeedDate(true);
      return;
    }
    openConsultation({
      date: selected?.date,
      slots: selected?.slots,
      whatsapp: whatsappNumber,
      astrologerName: CONSULTATION_ONLY_LABEL,
      purpose,
    });
  };

  const waMessage = selected?.date
    ? `Hello, I would like to book an astrology consultation on ${selected.date}${purpose ? ` for ${purpose}` : ""}.`
    : `Hello, I would like to book an astrology consultation${purpose ? ` for ${purpose}` : ""}.`;

  return (
    <div className="flex min-h-0 flex-1 flex-col self-stretch rounded-[20px] border border-[#EAD9B0] bg-white p-4 shadow-[0_8px_30px_-12px_rgba(120,90,30,0.12),0_1px_0_0_rgba(255,255,255,1)_inset] md:p-5">
      <div className="flex min-h-0 flex-1 flex-col">
        <HomeConsultationCalendar
          variant="cream"
          selectedDate={selected?.date || ""}
          onSelect={(day) => {
            onSelected(day.date ? day : null);
            setNeedDate(false);
          }}
        />
      </div>

      <div className="shrink-0 pt-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => openForm(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E9C07A] px-6 py-[13px] text-[14px] font-semibold text-[#2B2116] shadow-[0_6px_18px_-6px_rgba(180,130,40,0.5)] transition hover:brightness-[0.98] active:scale-[0.99] sm:w-[60%]"
        >
          Book Consultation
        </button>
        <a
          href={whatsappUrl(whatsappNumber, waMessage)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-white px-5 py-[13px] text-[14px] font-semibold text-[#1A6B2E] transition hover:bg-[#F2FFF5] active:scale-[0.99] sm:w-[40%]"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-[#25D366]" aria-hidden>
            <path d="M19.05 4.94A9.91 9.91 0 0 0 12.04 2C6.52 2 2.04 6.48 2.04 12c0 1.76.46 3.48 1.34 5L2 22l5.16-1.35A9.93 9.93 0 0 0 12.04 22c5.52 0 10-4.48 10-10a9.9 9.9 0 0 0-2.99-7.06ZM12.04 20a7.93 7.93 0 0 1-4.04-1.1l-.29-.17-3.06.8.82-2.98-.19-.31A7.92 7.92 0 0 1 4.06 12c0-4.41 3.59-8 8-8 2.14 0 4.15.83 5.66 2.34A7.95 7.95 0 0 1 20.06 12c0 4.41-3.59 8-8.02 8Zm4.36-5.95c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.1-.1.24-.26.36-.39.12-.13.16-.22.24-.36.08-.14.04-.26-.02-.38-.06-.12-.54-1.3-.74-1.78-.2-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.26-.22.2-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
          </svg>
          WhatsApp
        </a>
      </div>

      {needDate ? (
        <p className="mt-3 text-center text-sm text-[#B87E3B]">Please choose a date on the calendar first.</p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11.5px] text-[#9A8C7A] sm:justify-start">
        <span className="inline-flex items-center gap-1">
          <span className="text-[#25A244]">✓</span> Instant confirmation
        </span>
        <span className="hidden h-3 w-px bg-[#EAD9B0] sm:block" />
        <span className="inline-flex items-center gap-1">
          <span className="text-[#25A244]">✓</span> Link on WhatsApp
        </span>
        <span className="hidden h-3 w-px bg-[#EAD9B0] sm:block" />
        <span className="inline-flex items-center gap-1">
          <span className="text-[#25A244]">✓</span> Reschedule free
        </span>
      </div>
      </div>
    </div>
  );
}
