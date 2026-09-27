import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import type { WPImage } from "@/types/wordpress";

const ABOUT_COPY = [
  "JyothishiUncle.com is a venture from a family of Traditional Astrologers with more than 500+ years of tradition. We practice Astrology as divine, and this wisdom is being transferred through generations.",
  "Our aim is to make people understand the true spiritual traditions of Bharat, and to practice or follow them in their true spirit for a better tomorrow filled with discipline and happiness.",
  "We offer a better space for astrologers who preach or practice Astrology in its true spirit and share their wisdom for the betterment of society. Guidance is also given to astrologers for unique predictions based on true astro guidelines.",
];

export function AboutTeaser({ image: _image }: { excerpt?: string; image?: WPImage }) {
  return (
    <section className="relative my-8 w-full px-4 py-12 md:px-12">
      <Reveal className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] max-h-[580px] w-full overflow-hidden rounded-3xl bg-surface-low shadow-2xl">
            <Image
              src="/images/about-portrait.jpg?v=sanyasi"
              alt="JyothishiUncle"
              fill
              className="object-cover object-[center_20%] brightness-95"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-surface-lowest via-surface-lowest/40 to-transparent" />
            <div className="absolute right-4 bottom-4 left-4 flex items-center gap-4 rounded-2xl bg-surface-high/85 p-4 shadow-xl backdrop-blur-xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 font-serif text-xl text-primary">
                ॐ
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Traditional astrologers</p>
                <p className="font-semibold leading-tight text-on-surface">500+ years of divine tradition</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col justify-center lg:col-span-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Living Vedic Heritage</p>
          <h2 className="mb-4 font-serif text-[30px] leading-[38px] text-on-surface md:text-[40px] md:leading-[48px]">
            Ancient Wisdom.{" "}
            <span className="bg-linear-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent">
              Personal Guidance.
            </span>
          </h2>
          {ABOUT_COPY.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mb-4 text-base leading-relaxed text-on-surface-variant">
              {paragraph}
            </p>
          ))}
          <div className="mb-7 grid grid-cols-3 gap-2 rounded-2xl bg-surface-high/40 px-4 py-4">
            <div>
              <span className="block font-serif text-[32px] text-primary">500+</span>
              <span className="text-xs text-on-surface-variant">Years of tradition</span>
            </div>
            <div>
              <span className="block font-serif text-[32px] text-secondary">Online</span>
              <span className="text-xs text-on-surface-variant">Worldwide</span>
            </div>
            <div>
              <span className="block font-serif text-[32px] text-primary-container">Offline</span>
              <span className="text-xs text-on-surface-variant">Poojas available</span>
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
