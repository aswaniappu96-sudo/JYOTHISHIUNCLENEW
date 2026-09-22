import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductEnquiryButton } from "@/components/booking/ProductEnquiryButton";
import { DetailLayout } from "@/components/layout/DetailLayout";
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
  const [item, settings, testimonials] = await Promise.all([getProduct(slug), getSettings(), getTestimonials()]);
  if (!item) notFound();

  return (
    <DetailLayout
      eyebrow="Spiritual product"
      title={item.title}
      summary={item.short_description}
      image={item.featured_image}
      gallery={item.gallery}
      htmlSections={[
        { title: "About this product", html: item.full_description },
        { title: "Product information", html: item.product_info },
      ]}
      whatsappNumber={settings.whatsapp_number}
      whatsappMessage={item.whatsapp_message}
      extraActions={<ProductEnquiryButton product={item} />}
      testimonials={testimonials.slice(0, 3)}
    />
  );
}
