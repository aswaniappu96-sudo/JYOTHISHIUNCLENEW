"use client";

import { useEffect, useState } from "react";
import { stripOmanDeep } from "@/lib/publicCopy";

const WORDPRESS_PUBLIC = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "").replace(/\/$/, "");

function juListUrl(path: string) {
  const juPath = path.startsWith("/") ? path : `/${path}`;
  if (WORDPRESS_PUBLIC) {
    return `${WORDPRESS_PUBLIC}/wp-json/ju/v1${juPath}`;
  }
  return `/api/wp${juPath}`;
}

export function useJuList<T>(path: string, initial: T[]): T[] {
  return useJuListStatus(path, initial).items;
}

export function useJuListStatus<T>(path: string, initial: T[] = []) {
  const [items, setItems] = useState<T[]>(initial);
  const [loading, setLoading] = useState(initial.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial.length > 0) {
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(juListUrl(path), { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) {
            setError(`WordPress list failed (${response.status}).`);
            setLoading(false);
          }
          return;
        }
        const json: unknown = await response.json();
        if (!Array.isArray(json)) {
          if (!cancelled) {
            setError("WordPress did not return a list.");
            setLoading(false);
          }
          return;
        }
        if (!cancelled) {
          setItems(stripOmanDeep(json as T[]));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load listings from WordPress.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [path, initial.length]);

  return { items, loading, error };
}
