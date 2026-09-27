"use client";

import { useState } from "react";

export type GalleryImage = { url: string; alt: string };

export function ProductGallery({
  images,
  title,
  available,
}: {
  images: GalleryImage[];
  title: string;
  available?: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];
  if (!current) return null;
  const thumbs = images.slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <div className="group relative overflow-hidden rounded-2xl bg-surface-lowest shadow-[0_12px_45px_rgba(80,55,20,0.18)]">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-highest/90 px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-primary uppercase shadow-md backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Consecrated
          </span>
          {available ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-highest/80 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-secondary uppercase backdrop-blur-md">
              {available}
            </span>
          ) : null}
        </div>
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-linear-to-b from-surface-high/40 to-surface-lowest p-2">
          <img
            src={current.url}
            alt={current.alt || title}
            className="h-full w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-surface-highest/70 p-2 text-on-surface opacity-80 backdrop-blur-md transition-opacity group-hover:opacity-100">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16.2 16.2 20 20" strokeLinecap="round" />
              <path d="M11 8.5v5M8.5 11h5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      {thumbs.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {thumbs.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-square overflow-hidden rounded-xl bg-surface-high p-1 shadow-md transition ${
                index === active ? "ring-2 ring-primary shadow-lg" : "opacity-85 hover:opacity-100 hover:ring-1 hover:ring-primary/60"
              }`}
            >
              <img src={image.url} alt={image.alt || `${title} ${index + 1}`} className="h-full w-full rounded-lg object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
