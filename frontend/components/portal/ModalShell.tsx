"use client";

export const fieldClass = "glass-input mt-1 w-full rounded-xl px-4 py-2.5";
export const goldBtn =
  "w-full rounded-full bg-primary-container py-3 text-sm font-bold text-on-primary shadow-[0_0_24px_rgba(229,195,120,0.4)] transition hover:bg-primary disabled:opacity-60";

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
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 p-4 backdrop-blur-md md:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-primary/30 bg-linear-to-b from-surface-high via-surface-container to-surface-lowest p-6 shadow-[0_0_50px_rgba(229,195,120,0.25)] md:p-8 ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-primary/20 blur-[60px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-secondary-container/30 blur-[60px]" />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-highest/80 text-lg text-on-surface-variant hover:text-primary"
          aria-label="Close"
        >
          ×
        </button>
        {eyebrow ? (
          <p className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        ) : null}
        <h2 className="relative mt-2 font-serif text-3xl text-primary">{title}</h2>
        <div className="relative mt-6">{children}</div>
      </div>
    </div>
  );
}
