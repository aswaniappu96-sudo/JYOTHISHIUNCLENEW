"use client";

import { useEffect, useState } from "react";
import { stripOmanDeep } from "@/lib/publicCopy";

const WORDPRESS_PUBLIC = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://jyothishiuncle.ct.ws").replace(
  /\/$/,
  "",
);

export function useJuList<T>(path: string, initial: T[]): T[] {
  const [items, setItems] = useState<T[]>(initial);

  useEffect(() => {
    if (initial.length > 0) return;
    let cancelled = false;

    (async () => {
      try {
        const url = `${WORDPRESS_PUBLIC}/wp-json/ju/v1${path.startsWith("/") ? path : `/${path}`}`;
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) return;
        const json = await response.json();
        if (!cancelled && Array.isArray(json)) {
          setItems(stripOmanDeep(json));
        }
      } catch {
        /* Browser can reach InfinityFree even when Vercel cannot. */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [path, initial.length]);

  return items;
}
