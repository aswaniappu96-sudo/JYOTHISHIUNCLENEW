"use client";

import { useMemo, useState } from "react";
import { ConsultationBookPanel } from "@/components/home/ConsultationBookPanel";
import type { SelectedConsultationDay } from "@/components/home/HomeConsultationCalendar";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePortal } from "@/components/portal/PortalProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { CONSULTATION_ONLY_LABEL } from "@/lib/consultation";
import { consultServicesFromWp, type SiteServiceLink } from "@/lib/siteServices";
import { useJuList } from "@/lib/useJuList";
import type { AstrologyService, SiteSettings } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";
const OTHER_ID = "other";

function ClockGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7v5.2l3 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" aria-hidden>
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#B87E3B]" fill="none" aria-hidden>
      <rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 13 5.2 3.5V7.5L16 11" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function FileGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#B87E3B]" fill="none" aria-hidden>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14 3v5h5M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function PenGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#B87E3B]" fill="none" aria-hidden>
      <path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15 13 6-6-3-3-6 6-1 4 4-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function serviceIcon(item: SiteServiceLink) {
  const key = `${item.id} ${item.label}`.toLowerCase();
  if (/kundli|birth/.test(key)) return "☉";
  if (/prashna/.test(key)) return "?";
  if (/match/.test(key)) return "♡";
  if (/family/.test(key)) return "☰";
  if (/remed/.test(key)) return "✦";
  return "ॐ";
}

export function ConsultationSection({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: AstrologyService[];
}) {
  const { t } = usePrefs();
  const { openConsultation } = usePortal();
  const wpServices = useJuList<AstrologyService>("/services", services);
  const consult = useMemo(() => consultServicesFromWp(wpServices), [wpServices]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [day, setDay] = useState<SelectedConsultationDay | null>(null);
  const activeId = selectedId ?? consult[0]?.id ?? OTHER_ID;
  const selected = consult.find((item) => item.id === activeId);
  const purpose = activeId === OTHER_ID ? "" : selected?.label || "";

  const openForService = (id: string, label: string) => {
    setSelectedId(id);
    openConsultation({
      date: day?.date,
      slots: day?.slots,
      whatsapp: settings.whatsapp_number,
      astrologerName: CONSULTATION_ONLY_LABEL,
      purpose: id === OTHER_ID ? "" : label,
    });
  };

  return (
    <section id="consultation" className="relative w-full overflow-hidden scroll-mt-36 py-12 md:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-[0.045]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="ju-consult-mandala" width="280" height="280" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
              <g stroke="#B87E3B" strokeWidth="0.6" fill="none">
                <circle cx="140" cy="140" r="36" />
                <circle cx="140" cy="140" r="84" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ju-consult-mandala)" />
        </svg>
      </div>

      <div className={INNER}>
        <div className="max-w-[760px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-white px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-[#8A6A3A] shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#25D366]" />
            {t("video.kicker")}
          </div>
          <PageHeading className="mt-6" lead={t("video.lead")} accent={t("video.accent")} />
          <p className="mt-4 max-w-[520px] text-[15px] leading-[1.6] text-[#7A6B59]">{t("video.copy")}</p>
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex w-full min-h-0 flex-col self-stretch lg:w-[58%]">
            <ConsultationBookPanel
              whatsappNumber={settings.whatsapp_number}
              purpose={purpose}
              selected={day}
              onSelected={setDay}
            />
          </div>

          <div className="flex w-full min-h-0 flex-col self-stretch rounded-[20px] border border-[#EAD9B0] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(120,90,30,0.12)] lg:w-[42%] md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-semibold tracking-[0.14em] text-[#B87E3B]">{t("video.choose")}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8EB] px-2.5 py-1 text-[10px] font-medium text-[#8A6A3A] ring-1 ring-[#EAD9B0]">
                {t("video.live")}
              </span>
            </div>

            <div className="mt-5 flex-1 space-y-3">
              {consult.map((item, index) => {
                const active = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openForService(item.id, item.label)}
                    className={[
                      "group relative flex w-full items-start gap-3.5 rounded-[16px] border px-3.5 py-3.5 text-left transition-all",
                      active
                        ? "border-[#D6A95A] bg-[#FFF8EB] shadow-[0_4px_14px_-6px_rgba(180,130,40,0.35)]"
                        : "border-[#F1E6C8] bg-[#FFFDF8] hover:border-[#EAD9B0] hover:bg-white",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border text-[15px] text-[#8A6A3A]",
                        active ? "border-[#EAD9B0] bg-white" : "border-[#F1E6C8] bg-[#FFFBF0]",
                      ].join(" ")}
                    >
                      {serviceIcon(item)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[#2B2116]">{item.label}</p>
                        {index === 0 ? (
                          <span className="inline-flex items-center rounded-full bg-[#2B2116] px-2 py-0.5 text-[9px] font-semibold tracking-[0.08em] text-[#FFE9B5]">
                            {t("video.most")}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#8A6A3A] ring-1 ring-[#EAD9B0]">
                          <ClockGlyph /> {item.durationMinutes || 30} min
                        </span>
                        <span className="truncate text-[12px] text-[#7A6B59]">{item.hint}</span>
                      </div>
                    </div>
                    <div
                      className={[
                        "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition",
                        active ? "border-[#B87E3B] bg-[#B87E3B]" : "border-[#EAD9B0] bg-white",
                      ].join(" ")}
                    >
                      {active ? <CheckGlyph /> : null}
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => openForService(OTHER_ID, "")}
                className={[
                  "group relative flex w-full items-start gap-3.5 rounded-[16px] border px-3.5 py-3.5 text-left transition-all",
                  activeId === OTHER_ID
                    ? "border-[#D6A95A] bg-[#FFF8EB] shadow-[0_4px_14px_-6px_rgba(180,130,40,0.35)]"
                    : "border-[#F1E6C8] bg-[#FFFDF8] hover:border-[#EAD9B0] hover:bg-white",
                ].join(" ")}
              >
                <div
                  className={[
                    "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border text-[15px] text-[#8A6A3A]",
                    activeId === OTHER_ID ? "border-[#EAD9B0] bg-white" : "border-[#F1E6C8] bg-[#FFFBF0]",
                  ].join(" ")}
                >
                  …
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[#2B2116]">{t("video.other")}</p>
                  <p className="mt-1 text-[12px] text-[#7A6B59]">{t("video.otherHint")}</p>
                </div>
                <div
                  className={[
                    "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition",
                    activeId === OTHER_ID ? "border-[#B87E3B] bg-[#B87E3B]" : "border-[#EAD9B0] bg-white",
                  ].join(" ")}
                >
                  {activeId === OTHER_ID ? <CheckGlyph /> : null}
                </div>
              </button>
            </div>

            <div className="mt-6 rounded-[14px] bg-[#FFFBF0] p-3.5 ring-1 ring-[#F1E6C8]">
              <p className="text-[11px] font-semibold tracking-[0.08em] text-[#8A6A3A]">{t("video.get")}</p>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1.5 rounded-[10px] bg-white px-2 py-2.5 ring-1 ring-[#F1E6C8]">
                  <VideoGlyph />
                  <span className="text-center text-[10px] font-medium leading-[1.2] text-[#5A4D3E]">{t("video.liveVideo")}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-[10px] bg-white px-2 py-2.5 ring-1 ring-[#F1E6C8]">
                  <FileGlyph />
                  <span className="text-center text-[10px] font-medium leading-[1.2] text-[#5A4D3E]">{t("video.recording")}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-[10px] bg-white px-2 py-2.5 ring-1 ring-[#F1E6C8]">
                  <PenGlyph />
                  <span className="text-center text-[10px] font-medium leading-[1.2] text-[#5A4D3E]">{t("video.notes")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-[640px] text-center text-[11px] leading-[1.5] text-[#B9AA92]">{t("video.foot")}</p>
      </div>
    </section>
  );
}
