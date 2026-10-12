"use client";

import { useState } from "react";

export type GalleryImage = { url: string; alt: string };

export function PoojaGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  if (!current) return null;

  return (
    <div className="flex flex-col space-y-2">
      <div className="group relative w-full overflow-hidden rounded-2xl bg-[#F7F0E2] shadow-2xl">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={current.url}
            alt={current.alt || title}
            className="h-full w-full object-cover object-center"
          />
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
              <img src={image.url} alt={image.alt || `${title} ${index + 1}`} className="h-full w-full object-cover object-center" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
