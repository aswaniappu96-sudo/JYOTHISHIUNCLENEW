"use client";

import { Fragment, useRef, type ReactNode } from "react";
import { useBrandFlash } from "@/components/brand/BrandTwinkle";
import { BRAND_CLASS, BRAND_NAME, rewriteBrandText } from "@/lib/brand";

export function BrandMark({ className = "", children }: { className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useBrandFlash(ref);
  return (
    <span ref={ref} className={`${BRAND_CLASS} ${className}`.trim()}>
      {children ?? BRAND_NAME}
    </span>
  );
}

export function BrandText({ children, className = "" }: { children: ReactNode; className?: string }) {
  if (typeof children !== "string") return children;
  const text = rewriteBrandText(children);
  if (!text.includes(BRAND_NAME)) {
    return className ? <span className={className}>{text}</span> : text;
  }
  const parts = text.split(BRAND_NAME);
  return (
    <span className={className || undefined}>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <BrandMark /> : null}
        </Fragment>
      ))}
    </span>
  );
}
