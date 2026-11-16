"use client";

import { useEffect, useRef } from "react";
import { armBrandMark } from "@/components/brand/BrandTwinkle";
import { markBrandHtml } from "@/lib/brand";

export function CmsHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const stops = [...root.querySelectorAll<HTMLElement>(".brand-mark")].map((el) => armBrandMark(el));
    return () => stops.forEach((stop) => stop());
  }, [html]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: markBrandHtml(html) }} />;
}
