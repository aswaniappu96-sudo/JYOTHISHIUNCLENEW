import { AboutTeaser } from "@/components/home/AboutTeaser";
import { AstrologyConsultingSection } from "@/components/home/AstrologyConsultingSection";
import { AstrologersSection } from "@/components/home/AstrologersSection";
import { BlogSection } from "@/components/home/BlogSection";
import { ConsultationSection } from "@/components/home/ConsultationSection";
import { CtaSection } from "@/components/home/CtaSection";
import { DailyHoroscope } from "@/components/home/DailyHoroscope";
import { EnquiryForm } from "@/components/home/EnquiryForm";
import { Hero } from "@/components/home/Hero";
import { PoojaSection } from "@/components/home/PoojaSection";
import { PoojaTemplesSection } from "@/components/home/PoojaTemplesSection";
import { ProductSection } from "@/components/home/ProductSection";
import { QuickServicesSection } from "@/components/home/QuickServicesSection";
import { Testimonials } from "@/components/home/Testimonials";
import { TravelSection } from "@/components/home/TravelSection";
import { getHomePayload } from "@/lib/api/wordpress";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomePayload();

  return (
    <div>
      <Hero astrologers={data.astrologers || []} phone={data.settings.phone_number} whatsapp={data.settings.whatsapp_number} />
      <div className="relative z-10">
        <AstrologersSection
          astrologers={data.astrologers || []}
          phone={data.settings.phone_number}
          whatsapp={data.settings.whatsapp_number}
        />
        <AstrologyConsultingSection services={data.services || []} />
        <QuickServicesSection />
        <DailyHoroscope />
        <Testimonials testimonials={data.testimonials} />
        <PoojaSection poojas={data.poojas} whatsappNumber={data.settings.whatsapp_number} />
        <PoojaTemplesSection vendors={data.vendors || []} poojas={data.poojas || []} />
        <ProductSection products={data.products} whatsappNumber={data.settings.whatsapp_number} />
        <TravelSection travel={data.travel} whatsappNumber={data.settings.whatsapp_number} />
        <BlogSection articles={data.articles} youtubeUrl={data.settings.social_youtube} />
        <ConsultationSection settings={data.settings} services={data.services || []} />
        <AboutTeaser excerpt={data.settings.about_excerpt} image={data.settings.about_teaser_image} />
        <EnquiryForm whatsappNumber={data.settings.whatsapp_number} faqs={data.faqs} />
        <CtaSection
          whatsappNumber={data.settings.whatsapp_number}
          phone={data.settings.phone_number}
          address={data.settings.address}
        />
      </div>
    </div>
  );
}
