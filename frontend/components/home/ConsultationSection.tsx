"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { ConsultationBookPanel } from "@/components/home/ConsultationBookPanel";
import type { SelectedConsultationDay } from "@/components/home/HomeConsultationCalendar";
import { TrustCards } from "@/components/home/AboutTeaser";
import { PageHeading, SectionEyebrow } from "@/components/home/SectionHeading";
import { usableWhatsapp } from "@/components/layout/SitePrefs";
import { usePortal } from "@/components/portal/PortalProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { ALSO_SERVICES, isVideoConsultationService, panelChrome, serviceCopy } from "@/lib/consultPanelCopy";
import { CONSULTATION_ONLY_LABEL } from "@/lib/consultation";
import { telHref } from "@/lib/html";
import { consultPanelAnchor, consultServicesFromWp } from "@/lib/siteServices";
import { POOJAS_PATH, PRODUCTS_PATH } from "@/lib/siteRoutes";
import { useJuList } from "@/lib/useJuList";
import { whatsappUrl } from "@/lib/whatsapp";
import type { AstrologyService, SiteSettings, WPImage } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

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
  callLabel,
  chatLabel,
  videoLabel,
  viewHref,
  viewLabel,
}: {
  id?: string;
  title: string;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  callHref: string;
  chatHref: string;
  onVideo?: () => void;
  callLabel: string;
  chatLabel: string;
  videoLabel?: string;
  viewHref?: string;
  viewLabel?: string;
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
              {callLabel}
            </a>
            <a href={chatHref} target="_blank" rel="noreferrer" className={`${action} border border-[#EAD9B0] bg-white text-[#2B2116]`}>
              {chatLabel}
            </a>
            {viewHref ? (
              <Link href={viewHref} className={`${action} col-span-2 bg-[#E9C07A] text-[#1E160E] hover:bg-[#E0B46D]`}>
                {viewLabel} <span aria-hidden>→</span>
              </Link>
            ) : (
              <button type="button" onClick={onVideo} className={`${action} col-span-2 bg-[#E9C07A] text-[#1E160E] hover:bg-[#E0B46D]`}>
                {videoLabel}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ConsultationSection({
  embedded = false,
  settings,
  services,
  joinImage,
}: {
  embedded?: boolean;
  settings: SiteSettings;
  services: AstrologyService[];
  joinImage?: WPImage;
}) {
  const { t, locale } = usePrefs();
  const chrome = panelChrome(locale);
  const { user, loading: authLoading } = useAuth();
  const freeStillOpen = !authLoading && (!user || user.free_consultation_available !== false);
  const { openConsultation } = usePortal();
  const wpServices = useJuList<AstrologyService>("/services", services);
  const consult = useMemo(
    () => consultServicesFromWp(wpServices).filter((item) => isVideoConsultationService(item.label)),
    [wpServices],
  );
  const serviceNames = useMemo(() => {
    const labels = consult.map((item) => item.label);
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
    <section
      id="consultation"
      className={
        embedded
          ? "relative mt-10 scroll-mt-36"
          : "relative w-full overflow-hidden scroll-mt-36 pt-6 pb-12 md:pt-8 md:pb-14 lg:pb-16"
      }
    >
      <div className={`pointer-events-none absolute inset-0 opacity-[0.045] ${embedded ? "hidden" : ""}`}>
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

      <div className={embedded ? "" : INNER}>
        <div className="max-w-[760px]">
          <SectionEyebrow>{t("video.kicker")}</SectionEyebrow>
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

        <TrustCards image={joinImage} />

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div
            id="consultation-services"
            className="order-1 flex w-full min-h-0 scroll-mt-36 flex-col self-stretch rounded-[20px] border border-[#EAD9B0] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(120,90,30,0.12)] lg:order-2 lg:w-[42%] md:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-semibold tracking-[0.14em] text-[#B87E3B]">{chrome.services}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8EB] px-2.5 py-1 text-[10px] font-medium text-[#8A6A3A] ring-1 ring-[#EAD9B0]">
                {t("video.live")}
              </span>
            </div>

            <div className="mt-4 flex-1 space-y-2">
              {consult.map((item) => {
                const copy = serviceCopy(item.label, item.detail, locale);
                return (
                  <ServiceAccordion
                    key={item.id}
                    id={consultPanelAnchor(item.label)}
                    title={copy.title}
                    question={copy.question}
                    answer={copy.answer}
                    open={openId === item.id}
                    onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                    callHref={callHref}
                    chatHref={whatsappUrl(chatNumber, `Namaste. I would like a ${item.label} consultation at MaharshiOm.`)}
                    onVideo={() => startVideo(item.label)}
                    callLabel={chrome.call}
                    chatLabel={chrome.chat}
                    videoLabel={chrome.video}
                  />
                );
              })}
            </div>

            <p className="mt-5 text-[12px] font-semibold tracking-[0.08em] text-[#8A6A3A] uppercase">{chrome.also}</p>
            <div className="mt-2 space-y-2">
              {ALSO_SERVICES.map((item) => {
                const copy = serviceCopy(item.english, "", locale);
                const view =
                  item.id === "pooja-booking"
                    ? { href: POOJAS_PATH, label: t("pooja.view") }
                    : item.id === "spiritual-products"
                      ? { href: PRODUCTS_PATH, label: t("store.view") }
                      : { href: "/#pooja-temples", label: t("temple.view") };
                return (
                <ServiceAccordion
                  key={item.id}
                  title={copy.title}
                  question={copy.question}
                  answer={copy.answer}
                  open={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                  callHref={callHref}
                  chatHref={whatsappUrl(chatNumber, `Namaste. I would like to know more about ${item.english} at MaharshiOm.`)}
                  callLabel={chrome.call}
                  chatLabel={chrome.chat}
                  viewHref={view.href}
                  viewLabel={view.label}
                />
                );
              })}
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
