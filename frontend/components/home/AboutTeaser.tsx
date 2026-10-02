"use client";

import Link from "next/link";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { Reveal } from "@/components/ui/Reveal";
import { stripHtml, stripPublicPrices } from "@/lib/html";
import type { WPImage } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

const FALLBACK =
  "JyothishiUncle offers traditional pooja, homam, and astrology consultation. The team is available worldwide and consults devotees anywhere through video consulting.";

function ChipIcon({ kind }: { kind: "time" | "globe" | "pin" }) {
  const common = { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "#8B6A3A", strokeWidth: 1.6 };
  if (kind === "time") {
    return (
      <svg {...common} aria-hidden>
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  if (kind === "globe") {
    return (
      <svg {...common} aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function AboutTeaser({ excerpt, image: _image }: { excerpt?: string; image?: WPImage }) {
  const { t } = usePrefs();
  const fromCms = stripPublicPrices(stripHtml(excerpt || "")).trim();
  const lead = fromCms || FALLBACK;

  const chips = [
    { icon: "time" as const, label: t("about.statYears") },
    { icon: "globe" as const, label: t("about.statOnline") },
    { icon: "pin" as const, label: t("about.statOffline") },
  ];

  const tiles = [
    { emoji: "📜", title: t("about.tileKundli"), sub: t("about.tileKundliSub") },
    { emoji: "🔥", title: t("about.tilePooja"), sub: t("about.tilePoojaSub") },
    { emoji: "🛕", title: t("about.tileYatra"), sub: t("about.tileYatraSub") },
  ];

  return (
    <section id="about" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <svg className="absolute -left-[180px] top-[80px] h-[720px] w-[720px] text-[#8B6A3A] opacity-[0.04]" viewBox="0 0 400 400" fill="none">
          <g stroke="currentColor" strokeWidth="0.6">
            {Array.from({ length: 24 }).map((_, n) => (
              <circle key={n} cx="200" cy="200" r={20 + n * 14} opacity={0.6 - n * 0.02} />
            ))}
            {Array.from({ length: 12 }).map((_, n) => {
              const a = (n * 30 * Math.PI) / 180;
              return (
                <line
                  key={`l-${n}`}
                  x1={200 + Math.cos(a) * 20}
                  y1={200 + Math.sin(a) * 20}
                  x2={200 + Math.cos(a) * 320}
                  y2={200 + Math.sin(a) * 320}
                />
              );
            })}
          </g>
        </svg>
        <div className="absolute right-[8%] top-[60px] select-none font-serif text-[120px] leading-none text-[#C9A86A] opacity-[0.08]">
          ॐ
        </div>
        <div className="absolute bottom-[40px] left-[46%] select-none font-serif text-[90px] leading-none text-[#C9A86A] opacity-[0.06]">
          ॐ
        </div>
        <div className="absolute -right-[200px] top-[-80px] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#FFE9B8] to-[#FFDDA1] opacity-[0.35] blur-[40px]" />
      </div>

      <Reveal className={INNER}>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 xl:gap-16">
          <div className="relative max-w-[600px]">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-[#E9C07A]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9C8360]">{t("about.kicker")}</span>
            </div>

            <PageHeading lead={t("about.lead")} accent={t("about.accent")} rest={t("about.rest")} />

            <div className="mt-8 space-y-5 text-[15.5px] leading-[1.85] text-[#6E6256]">
              <p>{lead}</p>
              <p className="text-[15px]">{t("about.body")}</p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              {chips.map((chip, index) => (
                <div key={chip.label} className="flex items-center gap-2.5">
                  {index > 0 ? <span className="hidden h-1 w-1 rounded-full bg-[#D8C39A] sm:inline-block" /> : null}
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-[#FBF0D9] px-4 py-2 text-[13px] font-medium text-[#5C4A32] shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#EAD9B0] bg-white">
                      <ChipIcon kind={chip.icon} />
                    </span>
                    {chip.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#E9C07A] px-7 text-[14px] font-semibold tracking-[0.01em] text-[#1E160E] shadow-[0_4px_14px_rgba(233,192,122,0.35)] transition-colors hover:bg-[#E0B46D]"
              >
                {t("about.read")}
                <span className="ml-2 inline-flex" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#EAD9B0] font-serif text-[13px] text-[#5C4A32]">
                  J
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#FBF0D9] font-serif text-[13px] text-[#5C4A32]">
                  U
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#EAD9B0] bg-white text-[12px]">
                  📿
                </div>
              </div>
              <p className="text-[12.5px] leading-[1.5] text-[#8B7E6E]">
                {t("about.trusted")}
                <br />
                <span className="font-medium text-[#1E160E]">{t("about.values")}</span>
              </p>
            </div>

            <div className="mt-10 border-t border-[#E9C07A]/40 pt-8">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FBF0D9] font-serif text-[10px] text-[#8B6A3A]">
                  ॐ
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9C8360]">{t("about.guidance")}</span>
              </div>
              <h3 className="font-serif text-[22px] font-bold leading-[1.15] tracking-[-0.01em] text-[#1E160E]">{t("about.why")}</h3>
              <p className="mt-3 max-w-[520px] text-[13.5px] leading-[1.7] text-[#6E6256]">{t("about.whyCopy")}</p>
              <ul className="mt-5 space-y-3.5">
                {(
                  [
                    { title: t("about.why1Title"), copy: t("about.why1Copy"), mark: "check" as const },
                    { title: t("about.why2Title"), copy: t("about.why2Copy"), mark: "ring" as const },
                    { title: t("about.why3Title"), copy: t("about.why3Copy"), mark: "om" as const },
                  ] as const
                ).map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-[1px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#EAD9B0] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                      {item.mark === "check" ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B6A3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M5 12l4 4L19 6" />
                        </svg>
                      ) : item.mark === "ring" ? (
                        <span className="font-serif text-[11px] leading-none text-[#8B6A3A]">◍</span>
                      ) : (
                        <span className="font-serif text-[12px] leading-none text-[#8B6A3A]">ॐ</span>
                      )}
                    </span>
                    <div>
                      <div className="text-[13.5px] font-semibold leading-[1.4] text-[#1E160E]">{item.title}</div>
                      <div className="mt-0.5 text-[12.5px] leading-[1.6] text-[#8B7E6E]">{item.copy}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative lg:pl-6">
            <div className="relative overflow-hidden rounded-[24px] border border-[#EAD9B0] bg-white shadow-[0_20px_60px_rgba(94,72,36,0.08),0_2px_0_0_#fff_inset]">
              <div className="flex h-[56px] items-center justify-between border-b border-[#FBF0D9] bg-[#FFFBF0]/60 px-7">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FBF0D9] font-serif text-[11px] text-[#8B6A3A]">
                    ॐ
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9C8360]">{t("about.parampara")}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E9C07A]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EAD9B0]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FBF0D9]" />
                </div>
              </div>

              <div className="relative bg-gradient-to-b from-[#FFFBF0] to-[#FFF8E9] p-6 sm:p-8">
                <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
                  <svg width="100%" height="100%" viewBox="0 0 400 320" preserveAspectRatio="none">
                    <g stroke="#8B6A3A" strokeWidth="0.5" fill="none">
                      <path d="M200 20 L380 300 L20 300 Z" />
                      <path d="M200 300 L380 20 L20 20 Z" opacity="0.5" />
                      <circle cx="200" cy="160" r="80" />
                      <circle cx="200" cy="160" r="110" />
                    </g>
                  </svg>
                </div>

                <div className="relative mx-auto max-w-[340px]">
                  <div className="relative mx-auto h-[300px] w-[300px]">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFE9B8] to-[#FFD6A0] opacity-60 blur-[1px]" />
                    <div className="absolute inset-[10px] flex items-center justify-center overflow-hidden rounded-full border border-[#F0DFB8] bg-white shadow-[inset_0_1px_0_white]">
                      <div className="relative flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#FFFBF0_0%,#FFF3D8_55%,#FFE9B8_100%)]">
                        <div className="mb-3 text-[#C89B5A] opacity-80" aria-hidden>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2v4M9 6h6M8 10c0-2 2-4 4-4s4 2 4 4c0 2-2 3-4 5-2-2-4-3-4-5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                            <path d="M8 18h8M9 22h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="flex items-end">
                          <div className="flex h-[68px] w-[48px] flex-col items-center rounded-t-full border border-[#D8C39A] bg-gradient-to-b from-[#F5E6C8] to-[#EAD9B0] pt-2">
                            <div className="h-6 w-6 rounded-full bg-[#1E160E]/10" />
                            <div className="mt-1 h-[2px] w-8 bg-[#1E160E]/10" />
                            <div className="mt-3 h-8 w-[36px] rounded-sm bg-white/60" />
                          </div>
                          <div className="relative z-10 -mx-2 flex h-[92px] w-[56px] flex-col items-center rounded-t-full border border-[#E9C07A] bg-gradient-to-b from-[#FFF8E9] to-[#F0DFB8] pt-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8C39A] bg-[#EAD9B0] font-serif text-[14px]">
                              ॐ
                            </div>
                            <div className="mt-2 h-[3px] w-10 rounded-full bg-[#C9A86A]/40" />
                            <div className="mt-1 h-[3px] w-8 rounded-full bg-[#C9A86A]/30" />
                            <div className="mt-4 flex h-[28px] w-[44px] items-center justify-center rounded-[6px] border border-[#EAD9B0] bg-white">
                              <span className="text-[10px] tracking-widest text-[#9C8360]">VEDA</span>
                            </div>
                          </div>
                          <div className="flex h-[68px] w-[48px] flex-col items-center rounded-t-full border border-[#D8C39A] bg-gradient-to-b from-[#F5E6C8] to-[#EAD9B0] pt-2">
                            <div className="h-6 w-6 rounded-full bg-[#1E160E]/10" />
                            <div className="mt-1 h-[2px] w-8 bg-[#1E160E]/10" />
                            <div className="mt-3 h-8 w-[36px] rounded-sm bg-white/60" />
                          </div>
                        </div>
                        <div className="mt-4 flex h-[28px] w-[180px] items-center justify-center gap-1 rounded-[8px] border border-[#C9A86A]/30 bg-gradient-to-r from-[#EAD9B0] to-[#D8C39A] px-2 shadow-sm">
                          <div className="h-[2px] flex-1 rounded-full bg-[#1E160E]/15" />
                          <div className="h-[2px] flex-1 rounded-full bg-[#1E160E]/15" />
                          <div className="h-[2px] flex-1 rounded-full bg-[#1E160E]/15" />
                          <div className="ml-1 h-3 w-3 rounded-full bg-[#1E160E]/20" />
                        </div>
                        <span className="absolute top-6 left-8 h-1 w-1 rounded-full bg-[#E9C07A] opacity-60" />
                        <span className="absolute top-12 right-10 h-1 w-1 rounded-full bg-[#E9C07A] opacity-40" />
                        <span className="absolute bottom-14 left-12 h-1 w-1 rounded-full bg-[#E9C07A] opacity-50" />
                      </div>
                    </div>

                    <div className="absolute -left-2 bottom-8 flex items-center gap-2.5 rounded-full border border-[#EAD9B0] bg-white px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E160E] font-serif text-[13px] font-bold text-[#E9C07A]">
                        {t("about.years")}
                      </div>
                      <div className="leading-[1.1]">
                        <div className="text-[11px] font-bold tracking-[0.02em] text-[#1E160E]">{t("about.yearsOf")}</div>
                        <div className="text-[11px] text-[#6E6256]">{t("about.heritage")}</div>
                      </div>
                    </div>

                    <div className="absolute -right-1 top-14 rounded-[14px] border border-[#EAD9B0] bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9C8360]">{t("about.worldwide")}</div>
                      <div className="grid grid-cols-5 gap-[4px]">
                        {Array.from({ length: 15 }).map((_, n) => (
                          <span key={n} className={`h-[5px] w-[5px] rounded-full ${n % 4 === 0 ? "bg-[#E9C07A]" : "bg-[#F0DFB8]"}`} />
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-[#6E6256]">{t("about.video")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mt-6 grid grid-cols-3 gap-3">
                  {tiles.map((tile) => (
                    <div key={tile.title} className="rounded-[12px] border border-[#F0DFB8] bg-white px-3 py-3">
                      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#EAD9B0] bg-[#FFFBF0] text-[13px]">
                        {tile.emoji}
                      </div>
                      <div className="text-[11px] font-semibold leading-tight text-[#1E160E]">{tile.title}</div>
                      <div className="mt-0.5 text-[10px] text-[#8B7E6E]">{tile.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex h-[48px] items-center justify-between bg-[#1E160E] px-6">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E9C07A]" />
                  <span className="text-[11px] tracking-[0.08em] text-[#EAD9B0]">{t("about.live")}</span>
                </div>
                <span className="text-[11px] text-[#9C8360]">{t("about.est")}</span>
              </div>
            </div>

            <div className="pointer-events-none absolute -top-2 -right-6 -z-10 h-[320px] w-[320px] rounded-full border border-dashed border-[#EAD9B0] opacity-60" aria-hidden />
            <div className="pointer-events-none absolute -bottom-4 -left-8 -z-10 h-[200px] w-[200px] rounded-full bg-[#FBF0D9] opacity-80" aria-hidden />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
