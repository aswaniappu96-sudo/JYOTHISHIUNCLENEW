"use client";

import { EnquireButton } from "@/components/portal/EnquireButton";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePortal } from "@/components/portal/PortalProvider";
import { contactNumber } from "@/lib/consultation";
import { telHref } from "@/lib/html";
import { whatsappUrl } from "@/lib/whatsapp";

const pill =
  "inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant/30 bg-surface-highest px-3 py-2 text-xs font-semibold text-on-surface";

export function AstrologerActions({
  name,
  phone,
  whatsapp,
  compact = false,
}: {
  name: string;
  phone?: string;
  whatsapp?: string;
  compact?: boolean;
}) {
  const { openConsultation } = usePortal();
  const number = contactNumber(phone, whatsapp);
  const tel = number ? telHref(number) : "";
  const chatHref = number
    ? whatsappUrl(
        number,
        name
          ? `Namaste. I would like to chat with ${name} at JyothishiUncle.`
          : "Namaste. I would like to chat with an astrologer at JyothishiUncle.",
      )
    : "";

  return (
    <div className="mt-3 flex flex-col gap-2.5 border-t border-outline-variant/20 pt-3">
      <div className="grid grid-cols-2 gap-2">
        {chatHref ? (
          <a href={chatHref} target="_blank" rel="noreferrer" className={`${pill} hover:text-secondary`}>
            Chat
          </a>
        ) : (
          <span className={`${pill} cursor-not-allowed opacity-40`}>Chat</span>
        )}
        {compact ? (
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => openConsultation({ astrologerName: name, whatsapp: number })}
            className="inline-flex items-center justify-center rounded-full bg-primary-container px-3 py-2 text-xs font-bold text-on-primary hover:brightness-95"
          >
            Video consult
          </button>
        ) : tel ? (
          <a href={tel} className={`${pill} hover:text-primary`}>
            Call
          </a>
        ) : (
          <span className={`${pill} cursor-not-allowed opacity-40`}>Call</span>
        )}
      </div>
      {compact ? null : (
        <button
          type="button"
          suppressHydrationWarning
          onClick={() =>
            openConsultation({
              astrologerName: name,
              whatsapp: number,
            })
          }
          className="inline-flex w-full items-center justify-center rounded-full bg-primary-container py-2.5 text-xs font-bold text-on-primary shadow-[0_0_20px_-4px_rgba(229,195,120,0.35)] hover:brightness-95"
        >
          Book Consultation
        </button>
      )}
    </div>
  );
}

export function AstrologerMatchCta({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <section className="px-4 py-16 md:px-12">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-2xl bg-linear-to-b from-surface-low via-surface-container to-surface-lowest p-8 text-center shadow-2xl md:p-14">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-[90px]" />
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-highest text-2xl text-primary">ॐ</div>
        <PageHeading title="Unsure Which Astrologer is Aligned with Your Kundali?" className="max-w-3xl" />
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
          Let our sacred intake concierge match your birth nakshatra and specific life inquiry with the hereditary guru
          best equipped to decipher your karmic chart.
        </p>
        <div className="mt-8 flex w-full max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row">
          <EnquireButton
            subject="Astrologer matching / free guidance"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary-container px-6 py-2.5 text-sm font-semibold text-on-primary sm:w-auto"
          >
            Speak with Astrological Concierge (Free Guidance)
          </EnquireButton>
          <BookConsultationButton className="inline-flex w-full items-center justify-center rounded-full bg-surface-highest px-5 py-2.5 text-sm font-semibold text-on-surface hover:text-primary sm:w-auto">
            Book Direct 1-on-1 Consultation
          </BookConsultationButton>
          {whatsappNumber ? (
            <a
              href={whatsappUrl(whatsappNumber, "Hello, I would like help choosing an astrologer.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-surface-high px-5 py-2.5 text-sm font-semibold text-secondary sm:w-auto"
            >
              WhatsApp Priest Desk
            </a>
          ) : null}
        </div>
        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 border-t border-outline-variant/20 pt-8 sm:grid-cols-3">
          {[
            ["100% Confidential", "Gotra & Janma Sankalpa Protected"],
            ["Authentic Lineage", "Strictly Gurukula-Certified Acharyas"],
            ["Sacred Channels", "Video consulting"],
          ].map(([title, copy]) => (
            <div key={title} className="flex flex-col items-center gap-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface">{title}</span>
              <span className="text-sm text-on-surface-variant">{copy}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
