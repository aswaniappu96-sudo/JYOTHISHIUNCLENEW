export function PageLoading({ message = "Opening page…" }: { message?: string }) {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-20"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        <span className="font-serif text-2xl text-primary">ॐ</span>
      </div>
      <p className="text-sm font-medium tracking-wide text-primary">{message}</p>
    </div>
  );
}
