import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { imageSrc } from "@/lib/media";
import type { WPImage } from "@/types/wordpress";

export function AboutTeaser({ excerpt, image }: { excerpt: string; image?: WPImage }) {
  const src = imageSrc(image, "/images/about-portrait.jpg");
  const isRemote = src.startsWith("http");

  return (
    <section className="relative my-8 w-full px-4 py-12 md:px-12">
      <Reveal className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] max-h-[580px] w-full overflow-hidden rounded-3xl bg-surface-low shadow-2xl">
            {isRemote ? (
              <img src={src} alt="JyothishiUncle" className="absolute inset-0 h-full w-full object-cover brightness-90" />
            ) : (
              <Image
                src={src}
                alt="JyothishiUncle"
                fill
                className="object-cover brightness-90"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-surface-lowest via-surface-lowest/40 to-transparent" />
            <div className="absolute right-4 bottom-4 left-4 flex items-center gap-4 rounded-2xl bg-surface-high/85 p-4 shadow-xl backdrop-blur-xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 font-serif text-xl text-primary">
                ॐ
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">From Oman, for everywhere</p>
                <p className="font-semibold leading-tight text-on-surface">Online consults · Traditional pooja</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Living Vedic Heritage</p>
          <h2 className="mb-4 font-serif text-[30px] leading-[38px] text-on-surface md:text-[40px] md:leading-[48px]">
            Ancient Wisdom.{" "}
            <span className="bg-linear-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent">
              Personal Guidance.
            </span>
          </h2>
          <p className="mb-4 text-base leading-relaxed text-on-surface-variant">{excerpt}</p>
          <p className="mb-7 text-sm leading-relaxed text-on-surface-variant">
            Consultations are online worldwide. The team is based in Oman and meets families on WhatsApp video, Google Meet, or Zoom.
          </p>
          <div className="mb-7 grid grid-cols-3 gap-2 rounded-2xl bg-surface-high/40 px-4 py-4">
            <div>
              <span className="block font-serif text-[32px] text-primary">Online</span>
              <span className="text-xs text-on-surface-variant">Worldwide consults</span>
            </div>
            <div>
              <span className="block font-serif text-[32px] text-secondary">Oman</span>
              <span className="text-xs text-on-surface-variant">Team based here</span>
            </div>
            <div>
              <span className="block font-serif text-[32px] text-primary-container">Pooja</span>
              <span className="text-xs text-on-surface-variant">Rituals with care</span>
            </div>
          </div>
          <ButtonLink href="/about" variant="light">
            Learn more about JyothishiUncle →
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
