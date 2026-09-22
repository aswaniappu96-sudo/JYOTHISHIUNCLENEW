import { AboutTeaser } from "@/components/home/AboutTeaser";
import { BlogSection } from "@/components/home/BlogSection";
import { ConsultationSection } from "@/components/home/ConsultationSection";
import { CtaSection } from "@/components/home/CtaSection";
import { EnquiryForm } from "@/components/home/EnquiryForm";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { Hero } from "@/components/home/Hero";
import { HoroscopeBand } from "@/components/home/HoroscopeBand";
import { PoojaSection } from "@/components/home/PoojaSection";
import { ProductSection } from "@/components/home/ProductSection";
import { Testimonials } from "@/components/home/Testimonials";
import { TravelSection } from "@/components/home/TravelSection";
import { getHomePayload } from "@/lib/api/wordpress";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getHomePayload();

  return (
    <div>
      <Hero settings={data.settings} />
      <HoroscopeBand />
      <AboutTeaser excerpt={data.settings.about_excerpt} image={data.settings.about_teaser_image} />
      <PoojaSection poojas={data.poojas} whatsappNumber={data.settings.whatsapp_number} />
      <ProductSection products={data.products} whatsappNumber={data.settings.whatsapp_number} />
      <TravelSection travel={data.travel} />
      <ConsultationSection settings={data.settings} services={data.services} />
      <Testimonials testimonials={data.testimonials} />
      <FaqAccordion faqs={data.faqs} />
      <EnquiryForm whatsappNumber={data.settings.whatsapp_number} />
      <BlogSection articles={data.articles} />
      <CtaSection
        whatsappNumber={data.settings.whatsapp_number}
        phone={data.settings.phone_number}
        address={data.settings.address}
      />
    </div>
  );
}
