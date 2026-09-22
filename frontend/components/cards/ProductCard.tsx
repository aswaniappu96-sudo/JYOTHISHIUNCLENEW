import { ProductEnquiryButton } from "@/components/booking/ProductEnquiryButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/wordpress";

export function ProductCard({
  product,
  whatsappNumber,
}: {
  product: Product;
  whatsappNumber: string;
}) {
  return (
    <article className="overflow-hidden rounded-3xl bg-surface-container/70 shadow-xl backdrop-blur-2xl">
      <MediaFrame image={product.featured_image} title={product.title} className="h-44" />
      <div className="p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          {product.availability === "in_stock" ? "Available" : "Enquire"}
        </p>
        <h3 className="mt-2 font-serif text-[22px] text-on-surface">{product.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-on-surface-variant">{product.short_description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <ButtonLink href={`/product/${product.slug}`}>View product</ButtonLink>
          <ProductEnquiryButton product={product} />
          <ButtonLink href={whatsappUrl(whatsappNumber, product.whatsapp_message)} variant="ghost" external>
            WhatsApp
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
