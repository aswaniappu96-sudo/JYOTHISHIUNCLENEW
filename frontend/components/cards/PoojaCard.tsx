import Link from "next/link";
import { BookPoojaButton } from "@/components/booking/BookPoojaButton";
import { imageSrc } from "@/lib/media";
import type { Pooja } from "@/types/wordpress";

const FALLBACKS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbWL3okzkn5bZg1MCUYym3qKo4bQQTQPlPXLbT6d1x9RWPa5sTlCq_b_-f1erDJfDWDoMb6vptFclDzhHSyqVP9IaAVKzvsBJUumDsI6J5F1JBb1Wlq1rSAXVErXWkSf0ME7OgwEkXDS_V2m3wHTS9IqaLyafkga0XEEdmfPuLA5igFfy5OWiYvTsIGHlMA5HIboICnaxpUx4bSUoZF6K6v9b43IdxK9WDFvLW7rYYgeofbUUKoRVQ-w",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDCgwpvhr-e9ByB50W7ZvTkF3HsnIsNn6yug0Reu4zvdaiOupYnI9wV_jmQ-d9F7RCQs6TUE8Qxy4JUw-wttIcsLLiVKpJq53SZF0PjiYobwpt2yuMGzEOL9Iml7njUi-xd7MMmlc767ENOFJyJR58aNZ0ESXCCRXUYP7k-QhBgUlLoc6pTprpZgR2x9mHfAGP1EQU6fD8dAJBBV5dZDKaBpzUOFaMRMfQXXAI_k5jBbBBnknASDWx8w",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD6vwXvFwWTl9DdS3WxNvBSUNcIq6C6i6dhEa_1z0cFOCVTTLJG1Xdie6yvU5L2WxrCDLl0CCy6RsPz3eNnxp5jbzC2M2agr3IVSKjmfCcN3o-yWaQrD65hSaAkUZUON_PcaLxxGl_hWePN8PLOmD2ctMU-ZeXKZJzc_bab6ctXeOWugx9VrzHBJbJG6KbKc20RtYJyDJuLYP7RAcbbpm7-cwgWgAAQFqHLC4LQha31E-Bl1oKszKBCnw",
];

export function PoojaCard({ pooja }: { pooja: Pooja }) {
  const src = imageSrc(pooja.featured_image, FALLBACKS[Math.abs(pooja.id) % FALLBACKS.length]);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-low shadow-xl">
      <div className="relative h-80 overflow-hidden">
        <img
          src={src}
          alt={pooja.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface-low via-surface-low/40 to-transparent" />
        <h3 className="absolute right-4 bottom-4 left-4 font-serif text-[22px] leading-tight text-on-surface">{pooja.title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="line-clamp-3 text-sm leading-6 text-on-surface-variant">{pooja.short_description}</p>
        <div className="mt-5 flex flex-wrap gap-2 opacity-100 transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <Link
            href={`/pooja/${pooja.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary via-primary-container to-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
          >
            Read more
          </Link>
          {pooja.booking_enabled ? <BookPoojaButton pooja={pooja}>Book now</BookPoojaButton> : null}
        </div>
      </div>
    </article>
  );
}
