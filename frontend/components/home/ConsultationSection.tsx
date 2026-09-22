import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { HomeConsultationCalendar } from "@/components/home/HomeConsultationCalendar";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { whatsappUrl } from "@/lib/whatsapp";
import type { AstrologyService, SiteSettings } from "@/types/wordpress";

export function ConsultationSection({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: AstrologyService[];
}) {
  return (
    <section id="consultation" className="relative my-8 w-full px-4 py-12 md:px-12">
      <div className="mx-auto max-w-6xl rounded-3xl bg-surface-low/95 p-6 shadow-[0_0_60px_rgba(72,41,179,0.2)] backdrop-blur-3xl md:p-12">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
            Live Astrological Ephemeris Sync
          </span>
          <h2 className="mb-2 font-serif text-[30px] text-primary md:text-[40px]">
            Your Questions. Your Journey. Personal Guidance.
          </h2>
          <p className="text-sm text-on-surface-variant">
            Book an intimate, confidential 1-on-1 Vedic consultation with JyothishiUncle via WhatsApp video, Google Meet, or Zoom.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">1. Select sacred consultation</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <div key={service.id} className="flex items-center gap-2 rounded-xl bg-surface-high/60 p-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_#ffe09d]" />
                  <div>
                    <p className="font-semibold leading-tight text-on-surface">{service.title}</p>
                    <p className="text-xs text-on-surface-variant">
                      {service.duration_minutes} minutes · {service.short_description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-surface-container/60 p-4 lg:col-span-6">
            <HomeConsultationCalendar />
            <div>
              <BookConsultationButton className="inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-[0_0_25px_rgba(229,195,120,0.45)] sm:w-auto" />
              <div className="mt-3">
                <ButtonLink
                  href={whatsappUrl(settings.whatsapp_number, "Hello, I would like to book an astrology consultation.")}
                  variant="ghost"
                  external
                >
                  WhatsApp
                </ButtonLink>
              </div>
              <p className="mt-3 text-center text-xs text-outline">Confidential video call · Oman time confirmed to your local clock</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
