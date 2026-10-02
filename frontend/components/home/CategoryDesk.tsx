"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { KICKER, LEAD, SECTION_INNER } from "@/lib/layout";
import { imageSrc } from "@/lib/media";
import { POOJAS_PATH, PRODUCTS_PATH } from "@/lib/siteRoutes";
import type { Pooja, Product, TravelDestination } from "@/types/wordpress";

type Tab = "pooja" | "store" | "yatra";
type TabKey = "tab.pooja" | "tab.products" | "tab.yatra";
type TabLead = "tab.poojaLead" | "tab.productsLead" | "tab.yatraLead";
type TabAccent = "tab.poojaAccent" | "tab.productsAccent" | "tab.yatraAccent";
type TabCopy = "tab.poojaCopy" | "tab.productsCopy" | "tab.yatraCopy";

const tabs: { id: Tab; label: TabKey; lead: TabLead; accent: TabAccent; copy: TabCopy }[] = [
  { id: "pooja", label: "tab.pooja", lead: "tab.poojaLead", accent: "tab.poojaAccent", copy: "tab.poojaCopy" },
  { id: "store", label: "tab.products", lead: "tab.productsLead", accent: "tab.productsAccent", copy: "tab.productsCopy" },
  { id: "yatra", label: "tab.yatra", lead: "tab.yatraLead", accent: "tab.yatraAccent", copy: "tab.yatraCopy" },
];

const cardGrid = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]";
const cardClass =
  "hero-gold-card twinkle flex min-h-[11.5rem] flex-col rounded-2xl p-5 text-left transition hover:border-[#e5c378]/55";

export function CategoryDesk({
  poojas = [],
  products = [],
  travel = [],
}: {
  poojas?: Pooja[];
  products?: Product[];
  travel?: TravelDestination[];
}) {
  const [tab, setTab] = useState<Tab>("pooja");
  const { t } = usePrefs();
  const current = tabs.find((item) => item.id === tab) || tabs[0];

  return (
    <section id="browse-services" className="relative w-full scroll-mt-36 py-6 md:py-8">
      <div className={SECTION_INNER}>
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 rounded-full px-5 py-2 text-[13px] font-semibold transition ${
                tab === item.id
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "bg-surface-lowest text-on-surface ring-1 ring-primary/20 hover:bg-primary/10"
              }`}
            >
              {t(item.label)}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl text-center">
          <p className={KICKER}>{t(current.label)}</p>
          <PageHeading className="mt-3" lead={t(current.lead)} accent={t(current.accent)} />
          <p className={`${LEAD} mx-auto mt-4`}>{t(current.copy)}</p>
        </div>

        <div className="mt-6">
          {tab === "pooja" ? (
            <div className={cardGrid}>
              {poojas.slice(0, 8).map((item) => (
                <Link key={item.id} href={`/pooja/${item.slug}`} className={`${cardClass} overflow-hidden p-0`}>
                  {imageSrc(item.featured_image) ? (
                    <img src={imageSrc(item.featured_image)} alt={item.title} className="relative z-[1] h-28 w-full object-cover" />
                  ) : null}
                  <div className="relative z-[1] flex flex-1 flex-col p-5">
                    <p className="font-serif text-[20px] leading-snug text-[#fff8ec]">{item.title}</p>
                    <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#f3e6c8]">
                      {item.short_description || "Book this homam with a priest. Details and dakshina are shared privately."}
                    </p>
                    <span className="mt-auto pt-4 text-[12px] font-semibold text-[#e5c378]">View pooja</span>
                  </div>
                </Link>
              ))}
              <Link href={POOJAS_PATH} className={`${cardClass} items-center justify-center text-center`}>
                <p className="relative z-[1] font-serif text-[20px] text-[#fff8ec]">All poojas</p>
                <p className="relative z-[1] mt-2 text-[14px] text-[#f3e6c8]">See every rite we arrange</p>
              </Link>
            </div>
          ) : null}

          {tab === "store" ? (
            <div className={cardGrid}>
              {products.slice(0, 8).map((item) => (
                <Link key={item.id} href={`/product/${item.slug}`} className={`${cardClass} overflow-hidden p-0`}>
                  {imageSrc(item.featured_image) ? (
                    <img src={imageSrc(item.featured_image)} alt={item.title} className="relative z-[1] h-28 w-full object-cover" />
                  ) : null}
                  <div className="relative z-[1] flex flex-1 flex-col p-5">
                    <p className="font-serif text-[20px] leading-snug text-[#fff8ec]">{item.title}</p>
                    <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#f3e6c8]">
                      {item.short_description || "Enquire privately for this item. No public price on the site."}
                    </p>
                    <span className="mt-auto pt-4 text-[12px] font-semibold text-[#e5c378]">Enquire</span>
                  </div>
                </Link>
              ))}
              <Link href={PRODUCTS_PATH} className={`${cardClass} items-center justify-center text-center`}>
                <p className="relative z-[1] font-serif text-[20px] text-[#fff8ec]">All products</p>
                <p className="relative z-[1] mt-2 text-[14px] text-[#f3e6c8]">Browse the full list</p>
              </Link>
            </div>
          ) : null}

          {tab === "yatra" ? (
            travel.length ? (
              <div className={cardGrid}>
                {travel.slice(0, 8).map((item) => (
                  <Link key={item.id} href={`/religious-travel/${item.slug}`} className={`${cardClass} overflow-hidden p-0`}>
                    {imageSrc(item.featured_image) ? (
                      <img src={imageSrc(item.featured_image)} alt={item.title} className="relative z-[1] h-28 w-full object-cover" />
                    ) : null}
                    <div className="relative z-[1] flex flex-1 flex-col p-5">
                      <p className="font-serif text-[20px] leading-snug text-[#fff8ec]">{item.title}</p>
                      <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#f3e6c8]">
                        {item.short_description || item.location || "Darshan notes and travel guidance for this temple."}
                      </p>
                      <span className="mt-auto pt-4 text-[12px] font-semibold text-[#e5c378]">Open yatra</span>
                    </div>
                  </Link>
                ))}
                <Link href="/religious-travel" className={`${cardClass} items-center justify-center text-center`}>
                  <p className="relative z-[1] font-serif text-[20px] text-[#fff8ec]">All yatra</p>
                  <p className="relative z-[1] mt-2 text-[14px] text-[#f3e6c8]">Temple guidance list</p>
                </Link>
              </div>
            ) : (
              <div className="hero-gold-card twinkle rounded-2xl p-6 text-center md:p-8">
                <p className="relative z-[1] text-[15px] leading-relaxed text-[#f3e6c8]">
                  Temple yatra guidance for darshan — timing and travel notes, not a packaged checkout.
                </p>
                <Link
                  href="/religious-travel"
                  className="relative z-[1] mt-5 inline-flex rounded-full bg-primary-container px-5 py-2.5 text-[13px] font-semibold text-on-primary"
                >
                  Open yatra
                </Link>
              </div>
            )
          ) : null}
        </div>
      </div>
    </section>
  );
}
