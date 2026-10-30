import Link from "next/link";
import { PageHeading } from "@/components/home/SectionHeading";
import { KICKER, LEAD } from "@/lib/layout";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-24">
      <p className={KICKER}>Not found</p>
      <PageHeading as="h1" title="This page is not available" className="mt-3" />
      <p className={`${LEAD} mt-4`}>It may have been unpublished in WordPress.</p>
      <Link href="/" className="mt-8 inline-block text-sm font-semibold text-primary underline">
        Back home
      </Link>
    </section>
  );
}
