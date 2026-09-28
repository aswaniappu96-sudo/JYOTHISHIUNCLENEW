import Link from "next/link";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { devanagari } from "@/lib/devanagari-font";

function MantraRays() {
  return (
    <svg
      aria-hidden
      className="h-36 w-full max-w-xl overflow-visible md:h-44"
      fill="none"
      viewBox="0 0 640 180"
    >
      <defs>
        <linearGradient id="mantraRayGold" x1="50%" x2="50%" y1="100%" y2="0%">
          <stop offset="0%" stopColor="#e5c378" stopOpacity="0.15" />
          <stop offset="45%" stopColor="#c9a227" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8b6414" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="mantraRaySoft" x1="50%" x2="50%" y1="100%" y2="0%">
          <stop offset="0%" stopColor="#e5c378" stopOpacity="0.08" />
          <stop offset="55%" stopColor="#4a2db3" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4a2db3" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="mantraGlow" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="#ffe09d" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#e5c378" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fff8ec" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="320" cy="168" fill="url(#mantraGlow)" rx="220" ry="48" />
      {(
        [
          ["M320 170 C250 120, 150 70, 70 28", "gold", 1.6],
          ["M320 170 C270 115, 200 75, 140 22", "gold", 1.8],
          ["M320 170 C290 100, 250 55, 210 12", "gold", 2],
          ["M320 170 C310 90, 300 40, 292 8", "gold", 2.2],
          ["M320 170 C320 85, 320 35, 320 6", "gold", 2.4],
          ["M320 170 C330 90, 340 40, 348 8", "gold", 2.2],
          ["M320 170 C350 100, 390 55, 430 12", "gold", 2],
          ["M320 170 C370 115, 440 75, 500 22", "gold", 1.8],
          ["M320 170 C390 120, 490 70, 570 28", "gold", 1.6],
          ["M320 170 C230 130, 110 90, 36 48", "soft", 1.2],
          ["M320 170 C410 130, 530 90, 604 48", "soft", 1.2],
        ] as const
      ).map(([d, tone, width]) => (
        <path
          key={d}
          d={d}
          stroke={tone === "soft" ? "url(#mantraRaySoft)" : "url(#mantraRayGold)"}
          strokeLinecap="round"
          strokeWidth={width}
        />
      ))}
      {(
        [
          [70, 28, "#c9a227", 5],
          [140, 22, "#e5c378", 4.5],
          [210, 12, "#8b6414", 4],
          [292, 8, "#4a2db3", 3.5],
          [320, 6, "#c9a227", 5.5],
          [348, 8, "#4a2db3", 3.5],
          [430, 12, "#8b6414", 4],
          [500, 22, "#e5c378", 4.5],
          [570, 28, "#c9a227", 5],
          [36, 48, "#4a2db3", 3],
          [604, 48, "#4a2db3", 3],
        ] as const
      ).map(([cx, cy, fill, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} fill={fill} r={r} />
      ))}
    </svg>
  );
}

export function AboutMantraCta() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(229,195,120,0.28),rgba(247,240,226,0))] blur-2xl" />
      </div>
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <MantraRays />
        <p
          className={`${devanagari.className} mt-6 text-[28px] leading-[1.55] font-medium text-primary md:text-[34px] md:leading-[1.5]`}
        >
          ॐ असतो मा सद्गमय ।
          <br />
          तमसो मा ज्योतिर्गमय ।
          <br />
          मृत्योर्मा अमृतं गमय ॥
        </p>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-on-surface-variant italic md:text-base">
          “Lead us from the unreal to the real. Lead us from darkness unto the celestial light. Lead us
          from mortality unto eternal realization.”
        </p>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <BookConsultationButton className="inline-flex w-full items-center justify-center rounded-full bg-primary-container px-6 py-3 text-sm font-semibold text-on-primary shadow-[0_8px_24px_rgba(201,162,39,0.35)] transition hover:brightness-95 sm:w-auto">
            Book Consultation With JyothishiUncle
          </BookConsultationButton>
          <Link
            href="/services#pooja"
            className="inline-flex w-full items-center justify-center rounded-full bg-surface-high px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-surface-highest sm:w-auto"
          >
            Explore Consecrated Homams
          </Link>
        </div>
        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-bold tracking-[0.22em] text-on-surface-variant uppercase">
          <span>Sanctuary Diksha</span>
          <span className="hidden text-outline sm:inline" aria-hidden>
            ·
          </span>
          <span className="text-primary">Vedic Sampradaya</span>
          <span className="hidden text-outline sm:inline" aria-hidden>
            ·
          </span>
          <span>Jyotishya Marga 2026</span>
        </p>
      </div>
    </section>
  );
}
