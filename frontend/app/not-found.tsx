import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-saffron">Not found</p>
      <h1 className="mt-4 font-serif text-4xl text-primary">This page is not available</h1>
      <p className="mt-4 text-sm text-on-surface-variant">It may have been unpublished in WordPress.</p>
      <Link href="/" className="mt-8 inline-block text-lotus underline">
        Back home
      </Link>
    </section>
  );
}
