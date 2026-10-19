"use client";

import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { usableWhatsapp } from "@/components/layout/SitePrefs";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { telHref } from "@/lib/html";
import { whatsappUrl } from "@/lib/whatsapp";

const FALLBACK_PHONE = "+91 84519 89496";

function usablePhone(value?: string) {
  const text = (value || "").trim();
  if (!text || /0000/.test(text) || text.replace(/\D/g, "") === "96800000000") return FALLBACK_PHONE;
  return text;
}

const trio =
  "inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-3 py-3 text-center text-[13px] font-bold leading-tight sm:text-sm";

export function FreeConsultActions({
  phone,
  whatsapp,
  purpose,
  callTeam,
}: {
  phone?: string;
  whatsapp?: string;
  purpose?: string;
  callTeam?: boolean;
}) {
  const { t } = usePrefs();
  const callNumber = usablePhone(phone);
  const chatNumber = usableWhatsapp(whatsapp);
  const chatHref = whatsappUrl(chatNumber, `Namaste. ${purpose || "I would like a consultation at JyothishiUncle."}`);
  const callHref = telHref(callNumber);

  return (
    <div className="mt-5 space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <a href={callHref} className={`${trio} border-2 border-[#c9a227] bg-white text-[#1A1106] hover:bg-[#fff8ec]`}>
          {t("daily.callConsult")}
        </a>
        <a
          href={chatHref}
          target="_blank"
          rel="noreferrer"
          className={`${trio} border-2 border-[#c9a227] bg-white text-[#1A1106] hover:bg-[#fff8ec]`}
        >
          {t("daily.chatConsult")}
        </a>
        <BookConsultationButton
          prefill={{ whatsapp: chatNumber, purpose }}
          className={`${trio} bg-primary-container text-on-primary shadow-[0_8px_20px_-4px_rgba(201,162,39,0.45)] hover:brightness-95`}
        >
          {t("daily.videoConsult")}
        </BookConsultationButton>
      </div>
      {callTeam ? (
        <a
          href={callHref}
          className={`${trio} bg-[#1A1106] text-[#fff8ec] hover:bg-[#3a2a12]`}
        >
          {t("daily.callTeam")}
        </a>
      ) : null}
    </div>
  );
}
