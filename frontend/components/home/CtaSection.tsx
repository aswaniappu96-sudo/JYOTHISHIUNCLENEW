"use client";

import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ConchIcon } from "@/components/icons/ConchIcon";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SECTION_INNER } from "@/lib/layout";
import { whatsappUrl } from "@/lib/whatsapp";

export function CtaSection({
  whatsappNumber,
}: {
  whatsappNumber: string;
  phone?: string;
  address?: string;
}) {
  const { t } = usePrefs();

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-6 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(229,195,120,0.18),rgba(72,41,179,0.12),rgba(15,12,28,0))] blur-[120px]" />
      </div>
      <div className={SECTION_INNER}>
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-surface-high/70 via-surface-container/60 to-surface-lowest/90 p-5 shadow-[0_0_40px_rgba(229,195,120,0.2)] md:p-7">
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-tr from-surface-lowest via-surface-high to-surface-lowest shadow-[0_0_30px_rgba(255,224,157,0.6)]">
              <span className="font-serif text-2xl text-primary">ॐ</span>
            </div>
            <PageHeading lead={t("cta.lead")} accent={t("cta.accent")} className="mb-3 text-center" />
            <p className="mx-auto mb-7 max-w-2xl text-base leading-relaxed text-[#3a2a14]">{t("cta.copy")}</p>
            <div className="mb-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
              <BookConsultationButton className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-[0_0_25px_rgba(229,195,120,0.45)]">
                Book your 1-on-1 consultation →
              </BookConsultationButton>
              <ButtonLink href="/services" variant="light">
                Explore sacred pooja & homams
              </ButtonLink>
              <ButtonLink
                href={whatsappUrl(whatsappNumber, "Hello, I would like to know more about JyothishiUncle.")}
                variant="ghost"
                external
              >
                WhatsApp
              </ButtonLink>
            </div>
            <div className="grid w-full grid-cols-1 gap-2 border-t border-outline-variant/30 pt-4 text-center sm:grid-cols-2 lg:grid-cols-4">
              {["Instant confirmation after review", "Confidential video guidance", "Traditional pooja with care", "Online consults worldwide"].map(
                (item) => (
                  <div key={item} className="flex items-center justify-center gap-2 rounded-xl bg-surface-low/60 p-2">
                    <span className="text-primary">
                      <ConchIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs text-on-surface">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
