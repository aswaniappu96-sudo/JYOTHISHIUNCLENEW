"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ConsultationBookPanel } from "@/components/home/ConsultationBookPanel";
import type { SelectedConsultationDay } from "@/components/home/HomeConsultationCalendar";
import { PageHeading } from "@/components/home/SectionHeading";
import { usableWhatsapp } from "@/components/layout/SitePrefs";
import { usePortal } from "@/components/portal/PortalProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { CONSULTATION_ONLY_LABEL } from "@/lib/consultation";
import { telHref } from "@/lib/html";
import { consultPanelAnchor, consultServicesFromWp } from "@/lib/siteServices";
import { useJuList } from "@/lib/useJuList";
import { whatsappUrl } from "@/lib/whatsapp";
import type { AstrologyService, SiteSettings } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

const ALSO_PROVIDE: { id: string; title: string; question: string; answer: string }[] = [
  {
    id: "pooja-booking",
    title: "Pooja booking",
    question: "What is pooja booking?",
    answer:
      "We arrange homam and pooja with a priest for your sankalpa. You share the name and preferred date, and the timing and dakshina are confirmed privately.",
  },
  {
    id: "temple-yatra",
    title: "Temple yatra",
    question: "What is temple yatra?",
    answer:
      "Temple yatra is guidance for a darshan journey. We share temple timing and the path so the family can travel with a clear plan.",
  },
  {
    id: "spiritual-products",
    title: "Spiritual products",
    question: "What are spiritual products?",
    answer:
      "Spiritual products include rudraksha, malas, and puja items arranged for your need. You enquire privately, and prices are not listed on the page.",
  },
];

function serviceExplain(label: string, detail: string) {
  const key = label.toLowerCase();
  if (/kundli|kundali|jathak|birth/.test(key)) {
    return {
      question: "What is Kundli?",
      answer:
        "A kundli is the birth chart made from your date, time, and place of birth. It shows the planetary positions used to read dasha, dosha, and the direction of life.",
    };
  }
  if (/prashna|prasna/.test(key)) {
    return {
      question: "What is Prashna?",
      answer:
        "Prashna is a question chart. You ask one clear question, and the astrologer reads the moment of that question for a direct answer.",
    };
  }
  if (/match/.test(key)) {
    return {
      question: "What is Matchmaking?",
      answer:
        "Matchmaking compares two birth charts for marriage. It looks at guna milan, mangal, and remedies the family can follow.",
    };
  }
  if (/family/.test(key)) {
    return {
      question: "What is Family guidance?",
      answer:
        "Family guidance looks at home, children, career, and marriage together, so the reading stays practical for the people you live with.",
    };
  }
  if (/remed/.test(key)) {
    return {
      question: "What are Remedies?",
      answer:
        "Remedies are simple corrections for a planetary dosha, such as a mantra, charity, or a rite, chosen so they reduce fear and fit daily life.",
    };
  }
  return {
    question: `What is ${label}?`,
    answer: detail || "A personal consultation with a MaharshiOm astrologer on this subject.",
  };
}

function ServiceAccordion({
  id,
  title,
  question,
  answer,
  open,
  onToggle,
  callHref,
  chatHref,
  onVideo,
}: {
  id?: string;
  title: string;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  callHref: string;
  chatHref: string;
  onVideo: () => void;
}) {
  const action =
    "inline-flex min-h-9 items-center justify-center rounded-full px-2 py-2 text-center text-[11px] font-semibold leading-tight";
  return (
    <div id={id} className={`scroll-mt-28 rounded-[14px] border ${open ? "border-[#E9C07A] bg-[#FFF8EB]" : "border-[#F1E6C8] bg-[#FFFDF8]"}`}>
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left" aria-expanded={open}>
        <span className="text-[14px] font-semibold text-[#2B2116]">{title}</span>
        <span className={`text-[12px] text-[#8A6A3A] transition ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div className="px-3.5 pb-3.5">
          <p className="text-[13px] font-semibold text-[#2B2116]">{question}</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[#7A6B59]">{answer}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={callHref} className={`${action} border border-[#EAD9B0] bg-white text-[#2B2116]`}>
              Call
            </a>
            <a href={chatHref} target="_blank" rel="noreferrer" className={`${action} border border-[#EAD9B0] bg-white text-[#2B2116]`}>
              Chat
            </a>
            <button type="button" onClick={onVideo} className={`${action} col-span-2 bg-[#E9C07A] text-[#1E160E] hover:bg-[#E0B46D]`}>
              Video Consultation
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ConsultationSection({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: AstrologyService[];
}) {
  const { t } = usePrefs();
  const { user, loading: authLoading } = useAuth();
  const freeStillOpen = !authLoading && (!user || user.free_consultation_available !== false);
  const { openConsultation } = usePortal();
  const wpServices = useJuList<AstrologyService>("/services", services);
  const consult = useMemo(() => consultServicesFromWp(wpServices), [wpServices]);
  const serviceNames = useMemo(() => {
    const labels = [...consult.map((item) => item.label), ...ALSO_PROVIDE.map((item) => item.title)];
    return labels.some((label) => label.toLowerCase() === "other") ? labels : [...labels, "Other"];
  }, [consult]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [bookPurpose, setBookPurpose] = useState("");
  const [day, setDay] = useState<SelectedConsultationDay | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const chatNumber = usableWhatsapp(settings.whatsapp_number);
  const callHref = telHref(settings.phone_number);

  const startVideo = (label: string) => {
    setBookPurpose(label);
    openConsultation({
      date: day?.date,
      slots: day?.slots,
      whatsapp: chatNumber,
      astrologerName: CONSULTATION_ONLY_LABEL,
      purpose: label,
      services: serviceNames,
    });
  };

  useEffect(() => {
    const openFromHash = (raw?: string) => {
      let stored = "";
      try {
        stored = sessionStorage.getItem("ju_open_service") || "";
      } catch {
        stored = "";
      }
      const explicit = (raw || "").replace(/^#/, "");
      const fromLocation = window.location.hash.replace(/^#/, "");
      const hash = explicit.startsWith("svc-") ? explicit : stored.startsWith("svc-") ? stored : fromLocation;
      if (!hash.startsWith("svc-")) return;
      const hit = consult.find((item) => consultPanelAnchor(item.label) === hash);
      if (!hit) return;
      setOpenId(hit.id);
      try {
        sessionStorage.removeItem("ju_open_service");
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    };
    openFromHash();
    const retry = window.setTimeout(() => openFromHash(), 400);
    const onHash = () => openFromHash();
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.('a[href*="#svc-"]');
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const hash = href.slice(href.indexOf("#") + 1);
      window.setTimeout(() => openFromHash(hash), 0);
    };
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(retry);
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, [consult]);

  useEffect(() => {
    const onVideo = (event: Event) => {
      const hint = String((event as CustomEvent<string>).detail || "").toLowerCase();
      const hit = consult.find((item) => {
        const blob = `${item.id} ${item.label}`.toLowerCase();
        if (hint === "kundli") return /kundli|birth|jathak/.test(blob);
        if (hint === "marriage") return /match/.test(blob);
        if (hint === "prashna") return /prashna/.test(blob);
        if (hint === "remedies") return /remed/.test(blob);
        if (hint === "business" || hint === "career") return /family|career|business/.test(blob);
        return false;
      });
      if (hit) {
        setOpenId(hit.id);
        setBookPurpose(hit.label);
      }
      window.setTimeout(() => {
        calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    };
    window.addEventListener("ju:consult-video", onVideo);
    return () => window.removeEventListener("ju:consult-video", onVideo);
  }, [consult]);

  return (
    <section id="consultation" className="relative w-full overflow-hidden scroll-mt-36 pt-6 pb-12 md:pt-8 md:pb-14 lg:pb-16">
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
          {freeStillOpen ? (
            <p className="mt-3 max-w-[520px]">
              <span className="gold-notice inline-block rounded-xl border border-[#E9C07A] bg-[#FFF4D8] px-3.5 py-2 text-[13px] font-semibold leading-relaxed text-[#6B4A12]">
                {t("video.free")}
              </span>
            </p>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div
            id="consultation-services"
            className="order-1 flex w-full min-h-0 scroll-mt-36 flex-col self-stretch rounded-[20px] border border-[#EAD9B0] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(120,90,30,0.12)] lg:order-2 lg:w-[42%] md:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-semibold tracking-[0.14em] text-[#B87E3B]">Services</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8EB] px-2.5 py-1 text-[10px] font-medium text-[#8A6A3A] ring-1 ring-[#EAD9B0]">
                {t("video.live")}
              </span>
            </div>

            <div className="mt-4 flex-1 space-y-2">
              {consult.map((item) => {
                const copy = serviceExplain(item.label, item.detail);
                return (
                  <ServiceAccordion
                    key={item.id}
                    id={consultPanelAnchor(item.label)}
                    title={item.label}
                    question={copy.question}
                    answer={copy.answer}
                    open={openId === item.id}
                    onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                    callHref={callHref}
                    chatHref={whatsappUrl(chatNumber, `Namaste. I would like a ${item.label} consultation at MaharshiOm.`)}
                    onVideo={() => startVideo(item.label)}
                  />
                );
              })}
            </div>

            <p className="mt-5 text-[12px] font-semibold tracking-[0.08em] text-[#8A6A3A] uppercase">We also provide</p>
            <div className="mt-2 space-y-2">
              {ALSO_PROVIDE.map((item) => (
                <ServiceAccordion
                  key={item.id}
                  title={item.title}
                  question={item.question}
                  answer={item.answer}
                  open={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                  callHref={callHref}
                  chatHref={whatsappUrl(chatNumber, `Namaste. I would like to know more about ${item.title} at MaharshiOm.`)}
                  onVideo={() => startVideo(item.title)}
                />
              ))}
            </div>
          </div>

          <div
            ref={calendarRef}
            id="consultation-calendar"
            className="order-2 flex w-full min-h-0 scroll-mt-36 flex-col self-stretch lg:order-1 lg:w-[58%]"
          >
            <ConsultationBookPanel
              whatsappNumber={settings.whatsapp_number}
              purpose={bookPurpose}
              services={serviceNames}
              selected={day}
              onSelected={setDay}
            />
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-[640px] text-center text-[11px] leading-[1.5] text-[#B9AA92]">{t("video.foot")}</p>
      </div>
    </section>
  );
}
