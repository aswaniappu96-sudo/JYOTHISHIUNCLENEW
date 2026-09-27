"use client";

import { useState } from "react";

export type GalleryImage = { url: string; alt: string };

export function TravelGallery({
  images,
  title,
  location,
}: {
  images: GalleryImage[];
  title: string;
  location?: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];
  if (!current) return null;
  const thumbs = images.slice(0, 4);

  return (
    <div className="flex flex-col space-y-4">
      <div className="group relative overflow-hidden rounded-2xl bg-surface-lowest shadow-2xl">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={current.url}
            alt={current.alt || title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface-lowest via-surface-lowest/20 to-transparent" />
          <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Temple yatra</p>
              <p className="font-serif text-xl text-on-surface">{location || title}</p>
            </div>
          </div>
        </div>
      </div>
      {thumbs.length > 1 ? (
        <div className="grid grid-cols-3 gap-3">
          {thumbs.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`group relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-high shadow-md transition ${
                index === active ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"
              }`}
            >
              <img src={image.url} alt={image.alt || `${title} ${index + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              {image.alt && image.alt !== title ? (
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-surface-lowest/90 to-transparent px-2 py-2 text-left text-[11px] font-medium text-on-surface">
                  {image.alt}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
