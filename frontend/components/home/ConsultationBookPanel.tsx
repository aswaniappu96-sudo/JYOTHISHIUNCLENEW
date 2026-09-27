"use client";

import { useEffect, useState } from "react";
import { HomeConsultationCalendar, type SelectedConsultationDay } from "@/components/home/HomeConsultationCalendar";
import { usePortal } from "@/components/portal/PortalProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CONSULTATION_ONLY_LABEL } from "@/lib/consultation";
import { whatsappUrl } from "@/lib/whatsapp";

export function ConsultationBookPanel({ whatsappNumber }: { whatsappNumber: string }) {
  const { openConsultation } = usePortal();
  const [selected, setSelected] = useState<SelectedConsultationDay | null>(null);
  const [needDate, setNeedDate] = useState(false);

  useEffect(() => {
    const onBooked = (event: Event) => {
      const bookedDate = (event as CustomEvent<{ date?: string }>).detail?.date || "";
      if (!bookedDate || selected?.date === bookedDate) {
        setSelected(null);
      }
    };
    window.addEventListener("ju-consultation-booked", onBooked);
    return () => window.removeEventListener("ju-consultation-booked", onBooked);
  }, [selected?.date]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-surface-lowest/70 p-4 lg:col-span-6">
      <HomeConsultationCalendar
        selectedDate={selected?.date || ""}
        onSelect={(day) => {
          setSelected(day.date ? day : null);
          setNeedDate(false);
        }}
      />
      <div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-[0_0_25px_rgba(229,195,120,0.45)] sm:w-auto"
          onClick={() => {
            if (!selected?.date) {
              setNeedDate(true);
              return;
            }
            openConsultation({
              date: selected.date,
              slots: selected.slots,
              whatsapp: whatsappNumber,
              astrologerName: CONSULTATION_ONLY_LABEL,
            });
          }}
        >
          Book Consultation
        </button>
        {needDate ? (
          <p className="mt-2 text-sm text-primary">Please choose a date on the calendar first.</p>
        ) : selected?.date ? (
          <p className="mt-2 text-xs text-on-surface-variant">
            Selected:{" "}
            {new Date(`${selected.date}T12:00:00`).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            . Tap Book Consultation to enter your details.
          </p>
        ) : null}
        <div className="mt-3">
          <ButtonLink
            href={whatsappUrl(whatsappNumber, "Hello, I would like to book an astrology consultation.")}
            variant="ghost"
            external
          >
            WhatsApp
          </ButtonLink>
        </div>
        <p className="mt-3 text-center text-xs text-outline">Confidential video consulting · confirmed to your local clock</p>
        <p className="mt-2 text-center text-xs leading-relaxed text-on-surface-variant">
          Book consultation to login and get a 10-minute free first slot. You can cancel that offer and continue without
          free.
        </p>
      </div>
    </div>
  );
}
