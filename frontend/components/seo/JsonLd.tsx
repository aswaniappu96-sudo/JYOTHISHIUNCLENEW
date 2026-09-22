import type { SiteSettings } from "@/types/wordpress";

export function JsonLd({ settings }: { settings: SiteSettings }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "JyothishiUncle",
    description: settings.hero_subtitle,
    telephone: settings.phone_number,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Muscat",
      addressCountry: "OM",
    },
    areaServed: "Worldwide",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
