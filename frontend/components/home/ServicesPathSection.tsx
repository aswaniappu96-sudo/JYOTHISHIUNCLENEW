import Link from "next/link";
import { PageHeading, SectionEyebrow } from "@/components/home/SectionHeading";
import { SECTION_INNER } from "@/lib/layout";
import { POOJAS_PATH, PRODUCTS_PATH } from "@/lib/siteRoutes";

const LEAVES = [
  {
    href: "/astrologers",
    title: "Astrologers",
    script: "ज्योतिष",
    copy: "Connect with expert astrologers for kundli, prashna, and personal guidance.",
    image: "/images/astrologers/page-1.jpg",
    focus: "object-[center_20%]",
  },
  {
    href: PRODUCTS_PATH,
    title: "Spiritual Products",
    script: "आध्यात्मिक",
    copy: "Blessed yantras, rudraksha, incense, and authentic pooja essentials.",
    image: "/images/hero/banner-products.jpg",
    focus: "object-[78%_center]",
  },
  {
    href: POOJAS_PATH,
    title: "Poojas",
    script: "पूजा",
    copy: "Book authentic pooja and homam with a priest, live from temple.",
    image: "/images/hero/banner-pooja.jpg",
    focus: "object-[82%_center]",
  },
  {
    href: "/religious-travel",
    title: "Religious Travel",
    script: "यात्रा",
    copy: "Embark on divine journeys with temple yatra, stay, and darshan guidance.",
    image: "/images/hero/banner-temple.jpg",
    focus: "object-[80%_center]",
  },
] as const;

export function ServicesPathSection() {
  return (
    <section id="our-services" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16 lg:py-20">
      <div className={SECTION_INNER}>
        <div className="max-w-[720px]">
          <SectionEyebrow>Our services</SectionEyebrow>
          <PageHeading className="mt-5" lead="Find your" accent="path" />
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#5c4a32]">
            Four sacred paths begin here. Choose one to explore.
          </p>
        </div>

        <div className="relative mt-10">
          <div
            className="pointer-events-none absolute top-6 bottom-6 left-[11px] border-l border-dashed border-[#7a5a32]/60 sm:left-[13px]"
            aria-hidden
          />
          <ul className="relative space-y-3 sm:space-y-4">
            {LEAVES.map((leaf) => (
              <li key={leaf.href} className="relative pl-7 sm:pl-9">
                <span
                  className="absolute top-1/2 left-[5px] z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-[#f6efe2] bg-[#4a3424] shadow-[inset_0_0_0_2px_#c6a56a] sm:left-[7px]"
                  aria-hidden
                />
                <article className="thaliola-leaf relative grid w-full grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-[18px] py-3.5 pr-7 pl-3.5 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:gap-x-5 sm:rounded-[22px] sm:py-4 sm:pr-10 sm:pl-5">
                  <span
                    className="absolute top-1/2 right-3 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#3f2d1d] ring-2 ring-[#d9c29a]"
                    aria-hidden
                  />
                  <img
                    src={leaf.image}
                    alt=""
                    className={`col-start-1 row-start-1 h-[4.5rem] w-[4.5rem] rounded-xl object-cover shadow-[0_4px_10px_rgba(62,40,16,0.18)] sm:row-span-2 sm:h-20 sm:w-20 ${leaf.focus}`}
                  />
                  <h3
                    className="col-start-2 row-start-1 text-[1.15rem] leading-tight text-[#3d2a1c] sm:self-end sm:text-[1.45rem]"
                    style={{ fontFamily: "var(--font-brand), Cinzel, serif" }}
                  >
                    {leaf.title}{" "}
                    <span
                      className="ml-1 align-middle text-sm font-medium text-[#a08b72]"
                      style={{ fontFamily: '"Noto Serif Devanagari", serif' }}
                    >
                      {leaf.script}
                    </span>
                  </h3>
                  <p className="col-span-2 col-start-1 row-start-2 max-w-3xl text-[13px] leading-snug text-[#6f5e4e] sm:col-span-1 sm:col-start-2 sm:self-start sm:text-sm">
                    {leaf.copy}
                  </p>
                  <Link
                    href={leaf.href}
                    className="col-span-2 col-start-1 row-start-3 inline-flex w-fit items-center justify-self-end gap-1.5 rounded-full bg-[#e4c48a] px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-[#3d2a14] shadow-[inset_0_1px_0_rgba(255,248,230,0.7)] transition hover:bg-[#dcb56e] sm:col-span-1 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:justify-self-auto sm:self-center"
                  >
                    EXPLORE
                    <span aria-hidden>→</span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-xs text-[#a08b72] sm:mt-8">Choose a sacred leaf</p>
      </div>
    </section>
  );
}
