import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/pages/ProductDetailView";
import { getProduct, getProducts, getSettings, getTestimonials } from "@/lib/api/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getProducts().catch(() => []);
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getProduct(slug);
  return {
    title: item?.title,
    description: item?.short_description,
    openGraph: { title: item?.title, description: item?.short_description },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, settings, products, testimonials] = await Promise.all([
    getProduct(slug),
    getSettings(),
    getProducts().catch(() => []),
    getTestimonials().catch(() => []),
  ]);
  if (!item) notFound();

  return (
    <ProductDetailView
      product={item}
      settings={settings}
      related={products.filter((entry) => entry.slug !== item.slug).slice(0, 3)}
      testimonials={testimonials.slice(0, 3)}
    />
  );
}
