import { ButtonLink } from "@/components/ui/ButtonLink";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Testimonial, WPImage } from "@/types/wordpress";

export function DetailLayout({
  eyebrow,
  title,
  summary,
  image,
  gallery = [],
  htmlSections,
  whatsappNumber,
  whatsappMessage,
  extraActions,
  testimonials = [],
}: {
  eyebrow: string;
  title: string;
  summary: string;
  image: WPImage;
  gallery?: NonNullable<WPImage>[];
  htmlSections: { title: string; html: string }[];
  whatsappNumber: string;
  whatsappMessage: string;
  extraActions?: React.ReactNode;
  testimonials?: Testimonial[];
}) {
  return (
    <>
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl items-end gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl text-primary md:text-6xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">{summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {extraActions}
              <ButtonLink href={whatsappUrl(whatsappNumber, whatsappMessage)} variant="ghost" external>
                WhatsApp
              </ButtonLink>
            </div>
          </div>
          <MediaFrame image={image} title={title} className="h-64 rounded-[1.5rem] md:h-80" />
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-16">
        {htmlSections
          .filter((section) => section.html)
          .map((section) => (
            <div key={section.title} className="mb-10">
              <h2 className="font-serif text-3xl text-primary">{section.title}</h2>
              <div className="prose-ju mt-4" dangerouslySetInnerHTML={{ __html: section.html }} />
            </div>
          ))}
        {gallery.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((item) => (
              <MediaFrame key={item.id} image={item} title={title} className="h-52 rounded-3xl" />
            ))}
          </div>
        ) : null}
        {testimonials.length ? (
          <div className="mt-12">
            <h2 className="font-serif text-3xl text-primary">What families say</h2>
            <div className="mt-6 grid gap-4">
              {testimonials.map((item) => (
                <blockquote key={item.id} className="glass-card rounded-3xl p-5">
                  <p className="text-sm leading-relaxed text-on-surface-variant">“{item.review}”</p>
                  <footer className="mt-3 font-serif text-lg text-primary">{item.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
