import { ProductCard } from "@/components/cards/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/home/SectionHeading";
import type { Product } from "@/types/wordpress";

export function ProductSection({
  products,
  whatsappNumber,
}: {
  products: Product[];
  whatsappNumber: string;
}) {
  const featured = products.slice(0, 3);
  const hero = featured[0];
  const side = featured.slice(1);

  return (
    <section id="products" className="relative my-8 w-full px-4 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Energized Talismans"
          title="Sacred Planetary Store"
          badge="Services"
          copy="Orders are arranged by enquiry or WhatsApp. There is no public price list or checkout."
        />
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-2 lg:grid-rows-2 lg:h-[560px]">
          {hero ? (
            <Reveal className="h-full min-h-0 lg:row-span-2">
              <ProductCard product={hero} whatsappNumber={whatsappNumber} variant="featured" />
            </Reveal>
          ) : null}
          {side.map((product, index) => (
            <Reveal key={product.id} className="h-full min-h-0" delay={(index + 1) * 0.08}>
              <ProductCard product={product} whatsappNumber={whatsappNumber} variant="compact" />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <ButtonLink href="/services#products" variant="light">
            View all products
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
