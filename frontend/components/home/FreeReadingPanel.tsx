"use client";

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
          <p className="text-xs leading-relaxed text-on-surface-variant">{reading.note || t("daily.generalNote")}</p>
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
