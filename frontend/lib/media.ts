import { mediaUrl } from "@/lib/api/client";
import type { WPImage } from "@/types/wordpress";

export function imageSrc(image?: WPImage, fallback = "") {
  return mediaUrl(image?.url || image?.full) || fallback;
}
