"use client";

import { useState } from "react";

export type GalleryImage = { url: string; alt: string };

export function PoojaGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  if (!current) return null;

  return (
    <div className="flex flex-col space-y-2">
      <div className="group relative w-full overflow-hidden rounded-2xl bg-surface-lowest shadow-2xl">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={current.url}
            alt={current.alt || title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface-lowest via-transparent to-surface-lowest/30" />
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-surface-lowest/80 px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-primary uppercase backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Sacred ritual
          </div>
          <div className="absolute right-4 bottom-4 left-4 text-on-surface">
            <p className="font-semibold text-primary drop-shadow-sm">{title}</p>
          </div>
        </div>
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-high shadow-md transition ${
                index === active ? "opacity-100 ring-2 ring-primary" : "opacity-60 hover:opacity-100"
              }`}
            >
              <img src={image.url} alt={image.alt || `${title} ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
