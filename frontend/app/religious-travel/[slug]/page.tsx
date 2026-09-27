import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TravelDetailView } from "@/components/pages/TravelDetailView";
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
  const [item, settings, destinations] = await Promise.all([
    getTravelDestination(slug),
    getSettings(),
    getTravelDestinations().catch(() => []),
  ]);
  if (!item) notFound();

  return (
    <TravelDetailView
      travel={item}
      settings={settings}
      related={destinations.filter((entry) => entry.slug !== item.slug).slice(0, 3)}
    />
  );
}
