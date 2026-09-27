import { ConsultationBookPanel } from "@/components/home/ConsultationBookPanel";
import { AstrologyServiceTiles } from "@/components/pages/AstrologyServiceTiles";
import { SectionHeading } from "@/components/home/SectionHeading";
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
      <div className="mx-auto max-w-6xl rounded-3xl border border-primary/15 bg-surface-low/80 p-6 shadow-[0_18px_50px_-28px_rgba(139,100,20,0.35)] backdrop-blur-sm md:p-12">
        <div className="mb-8">
          <SectionHeading
            eyebrow="Live Astrological Ephemeris Sync"
            title="Your Questions. Your Journey. Personal Guidance."
            copy="Book an intimate, confidential 1-on-1 Vedic consultation with JyothishiUncle through video consulting."
          />
        </div>
        <div className="grid items-stretch gap-6 lg:grid-cols-12">
          <ConsultationBookPanel whatsappNumber={settings.whatsapp_number} />
          <div className="flex flex-col gap-4 lg:col-span-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Services we offer</p>
            <AstrologyServiceTiles services={services} whatsappNumber={settings.whatsapp_number} bookable />
          </div>
        </div>
      </div>
    </section>
  );
}
