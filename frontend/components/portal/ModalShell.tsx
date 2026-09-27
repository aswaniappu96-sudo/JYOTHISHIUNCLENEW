"use client";

import { useEffect } from "react";

export const fieldClass = "glass-input mt-1 w-full rounded-xl px-4 py-2.5";
export const goldBtn =
  "w-full rounded-full bg-primary-container py-3 text-sm font-bold text-on-primary shadow-[0_8px_24px_rgba(201,162,39,0.35)] transition hover:brightness-95 disabled:opacity-60";
export const ghostBtn =
  "w-full rounded-full border border-primary/30 bg-transparent py-3 text-sm font-semibold text-primary transition hover:bg-surface-highest";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
      {label}
      {children}
    </label>
  );
}

export function ModalShell({
  title,
  eyebrow,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const previousHtml = html.style.overflow;
    const previousBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtml;
      document.body.style.overflow = previousBody;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center overflow-hidden bg-on-surface/35 p-4 backdrop-blur-md md:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative max-h-[90vh] w-full overflow-hidden rounded-2xl border border-primary/30 bg-linear-to-b from-surface-high via-surface-container to-surface-lowest p-6 shadow-[0_0_50px_rgba(229,195,120,0.25)] md:p-8 ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-primary/20 blur-[60px]" />
          <div className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-secondary-container/30 blur-[60px]" />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-highest/80 text-lg text-on-surface-variant hover:text-primary"
          aria-label="Close"
        >
          ×
        </button>
        {eyebrow ? (
          <p className="relative pr-10 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        ) : null}
        <h2 className="relative mt-2 pr-10 font-serif text-3xl text-primary">{title}</h2>
        <div className="no-scrollbar relative mt-6 max-h-[min(68vh,36rem)] overflow-x-hidden overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
