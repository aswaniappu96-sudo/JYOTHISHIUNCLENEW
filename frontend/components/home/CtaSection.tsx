import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { whatsappUrl } from "@/lib/whatsapp";

export function CtaSection({
  whatsappNumber,
  phone,
  address,
}: {
  whatsappNumber: string;
  phone: string;
  address: string;
}) {
  return (
    <section className="relative my-12 flex w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center md:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(229,195,120,0.18),rgba(72,41,179,0.12),rgba(15,12,28,0))] blur-[120px]" />
      </div>
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-linear-to-b from-surface-high/70 via-surface-container/60 to-surface-lowest/90 p-7 shadow-[0_0_80px_rgba(229,195,120,0.3)] backdrop-blur-2xl md:p-12">
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-tr from-surface-lowest via-surface-high to-surface-lowest shadow-[0_0_50px_rgba(255,224,157,0.8)]">
            <span className="font-serif text-4xl text-primary">ॐ</span>
          </div>
          <div className="mb-3 inline-flex items-center rounded-full bg-surface-high/80 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md">
            Sacred Karmic Awakening
          </div>
          <h2 className="mb-3 max-w-3xl bg-linear-to-b from-primary via-on-surface to-secondary bg-clip-text font-serif text-[38px] leading-tight text-transparent md:text-[56px]">
            Your Cosmic Journey Begins Now
          </h2>
          <p className="mx-auto mb-7 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            {address} {phone ? `· ${phone}` : ""} A conversation can start today.
          </p>
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
            {["Instant confirmation after review", "Confidential video guidance", "Traditional pooja with care", "Online from Oman, worldwide"].map(
              (item) => (
                <div key={item} className="flex items-center justify-center gap-2 rounded-xl bg-surface-low/60 p-2">
                  <span className="text-primary">✦</span>
                  <span className="text-xs text-on-surface">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
