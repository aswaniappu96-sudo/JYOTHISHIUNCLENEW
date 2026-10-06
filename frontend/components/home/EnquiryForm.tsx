"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { PageHeading } from "@/components/home/SectionHeading";
import { usableWhatsapp } from "@/components/layout/SitePrefs";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { Reveal } from "@/components/ui/Reveal";
import { submitCustomerEnquiry } from "@/lib/api/submit";
import { whatsappUrl } from "@/lib/whatsapp";
import { HEAR_ABOUT_OPTIONS } from "@/types/forms";
import type { FaqItem } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

const FIELD =
  "w-full appearance-none rounded-[12px] border border-transparent bg-[#F5EBD8] px-4 py-3.5 text-[14px] font-medium text-[#1E160E] placeholder:text-[#B9A88F] outline-none transition-all focus:border-[#E8C88A] focus:bg-[#FEF7E8] focus:ring-4 focus:ring-[#E8C88A]/20";

const LABEL = "block text-[11px] font-bold tracking-[0.08em] text-[#1E160E]";

const HOME_SUBJECTS = [
  "General enquiry",
  "Pooja & Ritual Booking",
  "Consultation with Acharya",
  "Sacred Product",
  "Temple Yatra",
];

const CONTACT_SUBJECTS = [
  "General Astrological Question",
  "Temple Pilgrimage Inquiry (Yatra)",
  "Media & Speaking Invocations",
  "Other Shastric Inquiries",
];

function Chevron() {
  return (
    <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#A68B6A]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function WhatsAppMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.06 6.5 2.06 12c0 1.76.46 3.48 1.34 5L2 22l5.18-1.36A9.9 9.9 0 0012.04 22c5.46 0 9.98-4.5 9.98-10s-4.52-10-9.98-10zm0 18c-1.5 0-2.97-.4-4.24-1.16l-.3-.18-3.07.8.82-3-.2-.31A8 8 0 014.06 12c0-4.42 3.6-8 7.98-8 4.38 0 7.98 3.58 7.98 8s-3.6 8-7.98 8zm4.4-5.96c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.38-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.24 1.02.39 1.37.5.57.18 1.09.16 1.5.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

export function EnquiryForm({
  whatsappNumber,
  faqs = [],
  variant = "home",
}: {
  whatsappNumber: string;
  faqs?: FaqItem[];
  variant?: "home" | "contact";
}) {
  const { t } = usePrefs();
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [queryLen, setQueryLen] = useState(0);
  const isContact = variant === "contact";
  const withFaq = !isContact;
  const wa = usableWhatsapp(whatsappNumber);
  const subjects = isContact ? CONTACT_SUBJECTS : HOME_SUBJECTS;

  useEffect(() => {
    if (!sent) return;
    const timer = window.setTimeout(() => setSent(false), 5000);
    return () => window.clearTimeout(timer);
  }, [sent]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await submitCustomerEnquiry({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        mobile: String(data.get("mobile") || ""),
        location: String(data.get("location") || ""),
        source: String(data.get("source") || ""),
        subject: String(data.get("subject") || ""),
        message: String(data.get("message") || ""),
        website: String(data.get("website") || ""),
      });
      setSent(true);
      form.reset();
      setQueryLen(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("enquiry.error"));
    } finally {
      setBusy(false);
    }
  }

  const waCard = wa ? (
    <div className="mt-6 rounded-[16px] border border-[#EAD9B0] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF7EE] text-[#1DA851]">
          <WhatsAppMark />
        </div>
        <div className="flex-1">
          <h3 className="text-[13.5px] font-bold text-[#1E160E]">{t("enquiry.unsure")}</h3>
          <p className="mt-1 text-[12.5px] leading-[1.5] text-[#7A7167]">{t("enquiry.unsureCopy")}</p>
          <a
            href={whatsappUrl(wa, "Namaste. I have a question about JyothishiUncle.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#1DA851]/30 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#1DA851] transition-all hover:border-[#1DA851]/50 hover:bg-[#EAF7EE]"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#1DA851]" />
            {t("enquiry.chat")}
          </a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <section
      id="enquiry"
      className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16 lg:py-20 selection:bg-[#E8C88A]/40"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg className="absolute -top-[20%] -right-[10%] h-[900px] w-[900px] opacity-[0.035]" viewBox="0 0 400 400">
          <g fill="none" stroke="#A67A3B" strokeWidth="0.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <circle key={i} cx="200" cy="200" r={20 + i * 15} />
            ))}
            {Array.from({ length: 24 }).map((_, i) => {
              const a = ((i * 15) * Math.PI) / 180;
              return (
                <line
                  key={`l-${i}`}
                  x1="200"
                  y1="200"
                  x2={(200 + Math.cos(a) * 360).toFixed(4)}
                  y2={(200 + Math.sin(a) * 360).toFixed(4)}
                />
              );
            })}
          </g>
        </svg>
        <svg className="absolute -bottom-[25%] -left-[15%] h-[800px] w-[800px] opacity-[0.03]" viewBox="0 0 400 400">
          <g fill="none" stroke="#A67A3B" strokeWidth="0.5">
            {Array.from({ length: 20 }).map((_, i) => (
              <circle key={i} cx="200" cy="200" r={15 + i * 14} />
            ))}
          </g>
        </svg>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#A67A3B 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </div>

      <Reveal className={INNER}>
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-white px-3.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A67A3B]" />
            <span className="text-[10px] font-bold tracking-[0.18em] text-[#7A6650] uppercase">
              {isContact ? t("enquiry.contactKicker") : t("enquiry.kicker")}
            </span>
          </div>
          <PageHeading
            className="mt-6"
            lead={isContact ? t("enquiry.contactLead") : t("enquiry.lead")}
            accent={isContact ? t("enquiry.contactAccent") : t("enquiry.accent")}
          />
          <p className="mt-4 max-w-[560px] text-[13.5px] leading-[1.6] text-[#7A6F63]">
            {isContact ? t("enquiry.contactCopy") : t("enquiry.copy")}
          </p>
        </div>

        <div className={`grid grid-cols-1 items-start gap-8 ${withFaq ? "lg:grid-cols-[1.15fr_0.85fr]" : "lg:max-w-3xl"}`}>
          <div className="rounded-[24px] border border-[#EAD9B0] bg-white p-[22px] shadow-[0_18px_60px_rgba(166,122,59,0.08),0_2px_8px_rgba(0,0,0,0.04)] md:p-[28px]">
            <form onSubmit={onSubmit} className="space-y-5">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" suppressHydrationWarning />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={LABEL} htmlFor="enquiry-name">
                    {t("enquiry.name")}
                  </label>
                  <input
                    id="enquiry-name"
                    required
                    name="name"
                    defaultValue={user?.name}
                    placeholder={t("enquiry.phName")}
                    className={FIELD}
                    suppressHydrationWarning
                  />
                </div>
                <div className="space-y-2">
                  <label className={LABEL} htmlFor="enquiry-mobile">
                    {t("enquiry.mobile")}
                  </label>
                  <input
                    id="enquiry-mobile"
                    required
                    name="mobile"
                    type="tel"
                    defaultValue={user?.mobile}
                    placeholder={t("enquiry.phMobile")}
                    className={FIELD}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={LABEL} htmlFor="enquiry-email">
                    {t("enquiry.email")}
                  </label>
                  <input
                    id="enquiry-email"
                    required
                    type="email"
                    name="email"
                    defaultValue={user?.email}
                    placeholder={t("enquiry.phEmail")}
                    className={FIELD}
                    suppressHydrationWarning
                  />
                </div>
                {isContact ? (
                  <div className="space-y-2">
                    <label className={LABEL} htmlFor="enquiry-subject">
                      {t("enquiry.subject")}
                    </label>
                    <div className="relative">
                      <select
                        id="enquiry-subject"
                        name="subject"
                        defaultValue={CONTACT_SUBJECTS[0]}
                        className={`${FIELD} pr-10`}
                        suppressHydrationWarning
                      >
                        {subjects.map((subject) => (
                          <option key={subject}>{subject}</option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className={LABEL} htmlFor="enquiry-location">
                      {t("enquiry.location")}
                    </label>
                    <input
                      id="enquiry-location"
                      name="location"
                      defaultValue={user?.location}
                      placeholder={t("enquiry.phLocation")}
                      className={FIELD}
                      suppressHydrationWarning
                    />
                  </div>
                )}
              </div>

              {isContact ? (
                <input type="hidden" name="location" defaultValue={user?.location} suppressHydrationWarning />
              ) : (
                <div className="space-y-2">
                  <label className={LABEL} htmlFor="enquiry-subject">
                    {t("enquiry.subject")}
                  </label>
                  <div className="relative">
                    <select
                      id="enquiry-subject"
                      required
                      name="subject"
                      defaultValue={HOME_SUBJECTS[0]}
                      className={`${FIELD} pr-10`}
                      suppressHydrationWarning
                    >
                      {subjects.map((subject) => (
                        <option key={subject}>{subject}</option>
                      ))}
                    </select>
                    <Chevron />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className={LABEL} htmlFor="enquiry-source">
                  {t("enquiry.hear")}
                </label>
                <div className="relative">
                  <select
                    id="enquiry-source"
                    name="source"
                    defaultValue={user?.source || HEAR_ABOUT_OPTIONS[0]}
                    className={`${FIELD} pr-10`}
                    suppressHydrationWarning
                  >
                    {HEAR_ABOUT_OPTIONS.map((source) => (
                      <option key={source}>{source}</option>
                    ))}
                  </select>
                  <Chevron />
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL} htmlFor="enquiry-message">
                  {t("enquiry.query")}
                </label>
                <textarea
                  id="enquiry-message"
                  required
                  name="message"
                  rows={4}
                  maxLength={500}
                  suppressHydrationWarning
                  placeholder={t("enquiry.phQuery")}
                  onChange={(event) => setQueryLen(event.target.value.length)}
                  className={`${FIELD} min-h-[112px] resize-none leading-[1.6]`}
                />
                <div className="flex justify-between pt-1">
                  <span className="text-[11px] text-[#B9A88F]">{t("enquiry.private")}</span>
                  <span className="text-[11px] text-[#B9A88F]">{queryLen}/500</span>
                </div>
              </div>

              {isContact ? <p className="text-[12px] text-[#7A6650]">{t("enquiry.contactSla")}</p> : null}

              <button
                type="submit"
                disabled={busy}
                suppressHydrationWarning
                className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-[24px] bg-[#E8C88A] px-6 py-[14px] text-[14px] font-bold tracking-[0.02em] text-[#1E160E] shadow-[0_6px_20px_rgba(232,200,138,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all hover:translate-y-[-1px] hover:bg-[#EED596] hover:shadow-[0_10px_28px_rgba(232,200,138,0.45)] active:translate-y-0 disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {busy ? t("enquiry.sending") : isContact ? t("enquiry.contactSubmit") : t("enquiry.submit")}
                  {busy ? null : <span className="transition-transform group-hover:translate-x-0.5">→</span>}
                </span>
              </button>
              <p className="text-center text-[11px] leading-[1.4] text-[#A89A87]">{t("enquiry.legal")}</p>
              {error ? <p className="text-center text-sm text-lotus">{error}</p> : null}
            </form>
          </div>

          {withFaq ? (
            <aside id="faq" className="scroll-mt-36 lg:sticky lg:top-8">
              <FaqAccordion faqs={faqs} />
              {waCard}
              <div className="mt-6 flex items-center gap-2 text-[11px] text-[#B8AD9E]">
                <div className="h-px flex-1 bg-[#EAD9B0]/70" />
                <span className="tracking-[0.1em]">{t("enquiry.footer")}</span>
                <div className="h-px flex-1 bg-[#EAD9B0]/70" />
              </div>
            </aside>
          ) : (
            waCard
          )}
        </div>
      </Reveal>

      <div
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#EAD9B0] bg-[#1E160E] px-5 py-3 text-white shadow-[0_12px_32px_rgba(0,0,0,0.22)] transition-all duration-500 ${
          sent ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
        role="status"
        aria-live="polite"
        aria-hidden={!sent}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8C88A] text-[12px] text-[#1E160E]">✓</div>
        <div className="pr-1">
          <p className="text-[13px] leading-none font-semibold">{t("enquiry.toast")}</p>
          <p className="mt-1 text-[11px] leading-none text-white/60">{t("enquiry.toastSub")}</p>
        </div>
      </div>
    </section>
  );
}
