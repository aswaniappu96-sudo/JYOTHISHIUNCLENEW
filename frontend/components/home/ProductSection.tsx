import Link from "next/link";
import { ProductEnquiryButton } from "@/components/booking/ProductEnquiryButton";
import { ProductCard } from "@/components/cards/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/wordpress";

export function ProductSection({
  products,
  whatsappNumber,
}: {
  products: Product[];
  whatsappNumber: string;
}) {
  const [featured, ...rest] = products;

  return (
    <section id="products" className="relative my-8 w-full px-4 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Energized Talismans</p>
            <h2 className="mt-1 font-serif text-[30px] text-primary md:text-[40px]">Sacred Planetary Store</h2>
          </div>
          <p className="max-w-md text-sm text-on-surface-variant">
            Orders are arranged by enquiry or WhatsApp. There is no public price list or checkout.
          </p>
        </div>
        {featured ? (
          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <article className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-surface-low/90 p-7 shadow-2xl backdrop-blur-2xl lg:col-span-6">
              <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl bg-surface-lowest">
                <MediaFrame image={featured.featured_image} title={featured.title} className="h-full" />
                <div className="absolute top-3 left-3 rounded-full bg-primary-container px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary">
                  {featured.availability === "in_stock" ? "Available" : "Enquire"}
                </div>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Spiritual product</p>
              <h3 className="mt-1 font-serif text-[22px] text-on-surface">{featured.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-on-surface-variant">{featured.short_description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink href={`/product/${featured.slug}`}>View product</ButtonLink>
                <ProductEnquiryButton product={featured} />
                <ButtonLink href={whatsappUrl(whatsappNumber, featured.whatsapp_message)} variant="ghost" external>
                  WhatsApp
                </ButtonLink>
              </div>
            </article>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-6">
              {rest.map((product) => (
                <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-10 text-center">
          <Link href="/services#products" className="text-sm text-primary hover:underline">
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
