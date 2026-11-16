"use client";

import { BrandText } from "@/components/brand/BrandText";
import { FreeConsultActions } from "@/components/home/FreeConsultActions";
import { TarotFace } from "@/components/home/TarotPiles";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { FreeReading } from "@/lib/freeReadings";

export function FreeReadingPanel({
  title,
  facts,
  reading,
  busy,
  empty,
  phone,
  whatsapp,
  purpose,
  callTeam,
  tarot,
  tarotSlots = [],
}: {
  title: string;
  facts: { label: string; value: string }[];
  reading: FreeReading | null;
  busy?: boolean;
  empty: string;
  phone?: string;
  whatsapp?: string;
  purpose?: string;
  callTeam?: boolean;
  tarot?: boolean;
  tarotSlots?: { role: string; title: string; value: string }[];
}) {
  const { t } = usePrefs();
  const sections = reading
    ? tarot
      ? [
          { label: t("daily.overview"), text: reading.overview },
          reading.past ? { label: t("daily.tarotPast"), text: reading.past } : null,
          reading.present ? { label: t("daily.tarotPresent"), text: reading.present } : null,
          reading.future ? { label: t("daily.tarotFuture"), text: reading.future } : null,
          reading.guidance ? { label: t("daily.tarotGuidance"), text: reading.guidance } : null,
          reading.caution ? { label: t("daily.tarotCaution"), text: reading.caution } : null,
        ]
      : [
          { label: t("daily.overview"), text: reading.overview },
          reading.personality ? { label: t("daily.personality"), text: reading.personality } : null,
          reading.strengths ? { label: t("daily.strengths"), text: reading.strengths } : null,
          reading.career ? { label: t("daily.career"), text: reading.career } : null,
          reading.relationships ? { label: t("daily.relationships"), text: reading.relationships } : null,
        ]
    : [];

  if (tarot) {
    const typeFact = facts.find((row) => row.value) || facts[0];
    return (
      <div className="flex h-full flex-col rounded-[22px] border border-[#E7DCCB] bg-[#FBF7F1] p-5 sm:p-7">
        <p className="font-serif text-[32px] leading-none text-[#9A6F3A] sm:text-[38px]">{title}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] text-[#1A1106]">{typeFact?.label}</p>
          {typeFact?.value ? (
            <span className="rounded-full bg-[#e5c378] px-4 py-1.5 text-[13px] font-semibold text-[#1A1106]">{typeFact.value}</span>
          ) : null}
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-[#1A1106]/75">{empty}</p>
        <div className="mt-6 flex items-end justify-center gap-3">
          {tarotSlots.map((slot, index) => (
            <div
              key={slot.role}
              className="h-[108px] w-[74px] sm:h-[124px] sm:w-[84px]"
              style={{ transform: `rotate(${[-8, 0, 8][index] || 0}deg)` }}
            >
              {slot.value ? <TarotFace name={slot.value} size="panel" /> : (
                <span className="flex h-full w-full items-center justify-center rounded-[12px] bg-[#1A1106] font-serif text-[32px] text-[#e5c378] shadow-[0_10px_18px_-12px_rgba(8,4,0,0.6)]">
                  ॐ
                </span>
              )}
            </div>
          ))}
        </div>
        {reading ? (
          <div className="mt-6 space-y-4">
            {sections.filter(Boolean).map((section) =>
              section ? (
                <section key={section.label}>
                  <h3 className="font-serif text-[16px] text-[#9A6F3A]">{section.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#1A1106]">{section.text}</p>
                </section>
              ) : null,
            )}
            <p className="text-xs leading-relaxed text-[#1A1106]/60">
              <BrandText>{reading.note || t("daily.generalNote")}</BrandText>
            </p>
            {busy ? <p className="text-xs font-semibold text-[#9A6F3A]">{t("daily.generating")}</p> : null}
            <FreeConsultActions phone={phone} whatsapp={whatsapp} purpose={purpose} callTeam={callTeam} />
          </div>
        ) : (
          <div className="mt-6 text-center">
            <p className="font-serif text-[22px] text-[#1A1106] sm:text-[24px]">{t("daily.tarotAppear")}</p>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#1A1106]/70">{t("daily.tarotReveal")}</p>
            {busy ? <p className="mt-3 text-xs font-semibold text-[#9A6F3A]">{t("daily.generating")}</p> : null}
          </div>
        )}
        {reading ? null : (
          <div className="mt-5 space-y-3">
            {tarotSlots.map((slot) => (
              <div key={slot.role} className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3 rounded-xl border border-dashed border-[#D9CBB6] px-3 py-2.5">
                <span className="text-[11px] font-bold tracking-[0.16em] text-[#1A1106]/70 uppercase">{slot.role}</span>
                <span className="text-[14px] text-[#1A1106]/80">{slot.value || t("daily.tarotWait", { card: slot.title })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-[28px] border border-[#e5c378]/80 bg-white p-5 sm:p-6">
      <p className="font-serif text-xl text-primary sm:text-2xl">{title}</p>
      {facts.length ? (
        <dl className="mt-4 space-y-2 border-b border-[#e5c378]/35 pb-4 text-sm">
          {facts.map((row) =>
            row.value ? (
              <div key={row.label} className="flex justify-between gap-4">
                <dt className="text-on-surface-variant">{row.label}</dt>
                <dd className="text-right font-semibold text-primary">{row.value}</dd>
              </div>
            ) : null,
          )}
        </dl>
      ) : null}

      {reading ? (
        <div className="mt-4 space-y-4">
          {tarot && (reading.cards?.length || reading.card) ? (
            <div className="flex justify-center gap-2">
              {(reading.cards?.length ? reading.cards : [reading.card || ""]).map((name, index) => (
                <div key={`${name}-${index}`} className="h-[128px] w-[86px] sm:h-[148px] sm:w-[100px]">
                  <TarotFace
                    name={name}
                    size="panel"
                    caption={[t("daily.tarotPast"), t("daily.tarotPresent"), t("daily.tarotFuture")][index]}
                  />
                </div>
              ))}
            </div>
          ) : null}
          {sections.filter(Boolean).map((section) =>
            section ? (
              <section key={section.label}>
                <h3 className="text-[11px] font-bold tracking-[0.16em] text-[#9A6F3A] uppercase">{section.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-primary">{section.text}</p>
              </section>
            ) : null,
          )}
          <p className="text-xs leading-relaxed text-on-surface-variant"><BrandText>{reading.note || t("daily.generalNote")}</BrandText></p>
          {busy ? <p className="text-xs font-semibold text-[#9A6F3A]">{t("daily.generating")}</p> : null}
          <FreeConsultActions phone={phone} whatsapp={whatsapp} purpose={purpose} callTeam={callTeam} />
        </div>
      ) : (
        <div className="mt-4 flex flex-1 flex-col">
          <p className="text-sm leading-relaxed text-on-surface-variant">{empty}</p>
          {busy ? <p className="mt-3 text-xs font-semibold text-[#9A6F3A]">{t("daily.generating")}</p> : null}
        </div>
      )}
    </div>
  );
}
