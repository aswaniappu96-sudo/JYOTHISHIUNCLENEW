import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <>
      <PageIntro
        eyebrow="JyothishiUncle"
        title="Careers"
        copy="Join a team that connects people with verified astrologers, pooja, and temple yatra guidance worldwide."
      />
      <section className="mx-auto max-w-3xl px-5 pb-20">
        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
          For office, operations, and partnership roles, send a short note through Contact Us. If you are an astrologer, use Become an Astrologer to apply for the consulting panel.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
          >
            Contact Us
          </Link>
          <Link
            href="/#join"
            className="inline-flex rounded-full border border-[#EAD9B0] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1106]"
          >
            Become an Astrologer
          </Link>
        </div>
      </section>
    </>
  );
}
