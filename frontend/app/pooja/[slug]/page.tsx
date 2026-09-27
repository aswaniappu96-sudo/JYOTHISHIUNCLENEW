import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PoojaDetailView } from "@/components/pages/PoojaDetailView";
import { getPooja, getPoojas, getSettings, getVendors } from "@/lib/api/wordpress";

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
  const [item, settings, poojas, vendors] = await Promise.all([
    getPooja(slug),
    getSettings(),
    getPoojas().catch(() => []),
    getVendors(),
  ]);
  if (!item) notFound();

  return (
    <PoojaDetailView
      pooja={item}
      settings={settings}
      relatedPoojas={poojas.filter((entry) => entry.slug !== item.slug)}
      vendors={vendors}
    />
  );
}
