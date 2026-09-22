import Image from "next/image";
import type { WPImage } from "@/types/wordpress";
import { mediaUrl } from "@/lib/api/client";

export function MediaFrame({
  image,
  title,
  className = "",
}: {
  image: WPImage;
  title: string;
  className?: string;
}) {
  const src = mediaUrl(image?.url || image?.full);

  if (!src) {
    return (
      <div
        className={`flex items-end bg-linear-to-br from-surface-lowest to-secondary-container p-5 ${className}`}
        aria-hidden
      >
        <p className="font-serif text-2xl text-primary">{title}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={image?.alt || title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
    </div>
  );
}
