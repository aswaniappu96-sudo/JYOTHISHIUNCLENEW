import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/home/SectionHeading";
import { ConchIcon } from "@/components/icons/ConchIcon";
import type { Testimonial } from "@/types/wordpress";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="relative my-8 w-full px-4 py-12 md:px-12">
      <SectionHeading eyebrow="Seeker Testimonies" title="Sacred Stories from the Void" />
      <div className="mx-auto mt-12 grid max-w-7xl gap-7 md:grid-cols-3">
        {testimonials.map((item, index) => {
          const initials = item.name
            .split(/[\s,]+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("");
          return (
            <Reveal key={item.id} delay={index * 0.08}>
              <blockquote className="relative flex h-full flex-col justify-between rounded-3xl bg-surface-container/50 p-7 shadow-lg backdrop-blur-xl">
                <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <ConchIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-3 text-primary">{"★".repeat(item.rating || 5)}</p>
                  <p className="mb-4 text-base leading-relaxed text-on-surface italic">“{item.review}”</p>
                </div>
                <footer className="flex items-center gap-3 pt-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                    {initials || "JU"}
                  </div>
                  <p className="font-semibold leading-tight text-on-surface">{item.name}</p>
                </footer>
              </blockquote>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
