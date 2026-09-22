import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailLayout } from "@/components/layout/DetailLayout";
import { getSettings, getTravelDestination, getTravelDestinations } from "@/lib/api/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getTravelDestinations().catch(() => []);
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getTravelDestination(slug);
  return { title: item?.title, description: item?.short_description };
}

export default async function TravelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, settings] = await Promise.all([getTravelDestination(slug), getSettings()]);
  if (!item) notFound();

  return (
    <DetailLayout
      eyebrow={item.location || "Religious travel"}
      title={item.title}
      summary={item.short_description}
      image={item.featured_image}
      gallery={item.gallery}
      htmlSections={[
        { title: "About this place", html: item.full_description },
        { title: "Travel information", html: item.travel_information },
      ]}
      whatsappNumber={settings.whatsapp_number}
      whatsappMessage={item.whatsapp_message}
    />
  );
}
