import { AboutTeaser } from "@/components/home/AboutTeaser";
import { AstrologyConsultingSection } from "@/components/home/AstrologyConsultingSection";
import { AstrologersSection } from "@/components/home/AstrologersSection";
import { BecomeAstrologerSection } from "@/components/home/BecomeAstrologerSection";
import { BlogSection } from "@/components/home/BlogSection";
import { ConsultationSection } from "@/components/home/ConsultationSection";
import { CtaSection } from "@/components/home/CtaSection";
import { DailyHoroscope } from "@/components/home/DailyHoroscope";
import { Hero } from "@/components/home/Hero";
import { PoojaSection } from "@/components/home/PoojaSection";
import { ProductSection } from "@/components/home/ProductSection";
import { ServicesPathSection } from "@/components/home/ServicesPathSection";
import { Testimonials } from "@/components/home/Testimonials";
import { TravelSection } from "@/components/home/TravelSection";
import { getHomePayload } from "@/lib/api/wordpress";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomePayload();

  return (
    <div>
      <Hero
        astrologers={data.astrologers || []}
        services={data.services || []}
        phone={data.settings.phone_number}
        whatsapp={data.settings.whatsapp_number}
        slides={data.settings.hero_slides}
        astroSlides={data.settings.hero_astro_slides}
      />
      <div className="relative z-10">
        <ServicesPathSection />
        <AboutTeaser excerpt={data.settings.about_excerpt} image={data.settings.about_teaser_image} />
        <AstrologyConsultingSection image={data.settings.guidance_image} />
        <AstrologersSection
          astrologers={data.astrologers || []}
          phone={data.settings.phone_number}
          whatsapp={data.settings.whatsapp_number}
        />
        <BecomeAstrologerSection image={data.settings.join_image} />
        <DailyHoroscope phone={data.settings.phone_number} whatsapp={data.settings.whatsapp_number} />
        <ConsultationSection settings={data.settings} services={data.services || []} />
        <PoojaSection poojas={data.poojas} vendors={data.vendors || []} whatsappNumber={data.settings.whatsapp_number} />
        <ProductSection products={data.products} whatsappNumber={data.settings.whatsapp_number} />
        <TravelSection travel={data.travel} whatsappNumber={data.settings.whatsapp_number} />
        <Testimonials testimonials={data.testimonials} />
        <BlogSection articles={data.articles} />
        <CtaSection
          whatsappNumber={data.settings.whatsapp_number}
          phone={data.settings.phone_number}
          address={data.settings.address}
          image={data.settings.cta_image}
        />
      </div>
    </div>
  );
}
