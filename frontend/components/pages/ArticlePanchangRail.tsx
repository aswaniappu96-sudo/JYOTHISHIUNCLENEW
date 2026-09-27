"use client";

import { useEffect, useState } from "react";
import { DEFAULT_TIMEZONE, getPanchang, visitorTimeZone, type PanchangSnapshot } from "@/lib/panchang";

export function ArticlePanchangRail() {
  const [panchang, setPanchang] = useState<PanchangSnapshot>(() => getPanchang(DEFAULT_TIMEZONE));

  useEffect(() => {
    setPanchang(getPanchang(visitorTimeZone()));
  }, []);

  const rows = [
    ["Tithi", panchang.tithiLabel, "text-on-surface"],
    ["Nakshatra", panchang.nakshatraLabel, "text-secondary"],
    ["Zone", panchang.zoneLabel, "text-on-surface"],
  ] as const;

  return (
    <div className="rounded-2xl bg-surface-low/90 p-4 shadow-lg backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-widest text-primary uppercase">Panchangam snapshot</span>
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
      </div>
      <div className="space-y-3">
        {rows.map(([label, value, tone]) => (
          <div key={label} className="flex items-center justify-between rounded-lg bg-surface-container px-3 py-1.5">
            <span className="text-xs text-on-surface-variant">{label}</span>
            <span className={`text-sm font-medium ${tone}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
