import { AstrologyServiceTiles } from "@/components/pages/AstrologyServiceTiles";
import type { AstrologyService } from "@/types/wordpress";

export function AstrologyServicesSection({
  services,
}: {
  services: AstrologyService[];
  whatsappNumber?: string;
}) {
  return (
    <section className="px-4 py-12 md:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-wider text-primary">Services we offer</p>
        <AstrologyServiceTiles services={services} />
      </div>
    </section>
  );
}
