import { BRAND_NAME, BRAND_URL } from "@/lib/brand";
import type { SiteSettings } from "@/types/wordpress";

export function JsonLd({ settings }: { settings: SiteSettings }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BRAND_NAME,
    description: settings.hero_subtitle,
    telephone: settings.phone_number,
    areaServed: "Worldwide",
    url: process.env.NEXT_PUBLIC_SITE_URL || BRAND_URL,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
