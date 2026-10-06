import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = { title: "Help Center" };

export default function HelpPage() {
  return (
    <>
      <PageIntro
        eyebrow="Support"
        title="Help Center"
        copy="Answers about consultations, astrologers, video sessions, and payments. If you still need a person, write through Contact Us or WhatsApp."
      />
      <section className="mx-auto max-w-3xl px-5 pb-20">
        <FaqAccordion />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
          >
            Contact Us
          </Link>
          <Link
            href="/#faq"
            className="inline-flex rounded-full border border-[#EAD9B0] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1106]"
          >
            Home FAQ
          </Link>
        </div>
      </section>
    </>
  );
}
