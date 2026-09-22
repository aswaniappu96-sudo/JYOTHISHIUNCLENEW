import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookPoojaButton } from "@/components/booking/BookPoojaButton";
import { DetailLayout } from "@/components/layout/DetailLayout";
import { getPooja, getPoojas, getSettings, getTestimonials } from "@/lib/api/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getPoojas().catch(() => []);
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPooja(slug);
  return {
    title: item?.title,
    description: item?.short_description,
    openGraph: { title: item?.title, description: item?.short_description },
  };
}

export default async function PoojaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, settings, testimonials] = await Promise.all([getPooja(slug), getSettings(), getTestimonials()]);
  if (!item) notFound();

  return (
    <div id="book">
      <DetailLayout
        eyebrow="Pooja & homam"
        title={item.title}
        summary={item.short_description}
        image={item.featured_image}
        gallery={item.gallery}
        htmlSections={[
          { title: "About this pooja", html: item.full_description },
          { title: "Benefits", html: item.benefits },
          { title: "Requirements", html: item.requirements },
        ]}
        whatsappNumber={settings.whatsapp_number}
        whatsappMessage={item.whatsapp_message}
        extraActions={item.booking_enabled ? <BookPoojaButton pooja={item} /> : null}
        testimonials={testimonials.slice(0, 3)}
      />
    </div>
  );
}
