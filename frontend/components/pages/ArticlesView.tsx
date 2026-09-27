"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { ArticleCard } from "@/components/pages/ArticleCard";
import { ConchIcon } from "@/components/icons/ConchIcon";
import { formatArticleDate, readingMinutes } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Article, WPPage } from "@/types/wordpress";

const PAGE_SIZE = 6;

export function ArticlesView({
  articles,
  page,
  whatsappNumber,
}: {
  articles: Article[];
  page?: WPPage | null;
  whatsappNumber: string;
}) {
  const categories = useMemo(() => {
    const names = [...new Set(articles.flatMap((item) => item.categories).filter(Boolean))].filter(
      (name) => name.toLowerCase() !== "uncategorized",
    );
    return names;
  }, [articles]);

  const [active, setActive] = useState("All");
  const [shown, setShown] = useState(PAGE_SIZE);

  const filtered = active === "All" ? articles : articles.filter((item) => item.categories.includes(active));
  const featured = filtered[0];
  const rest = filtered.slice(1);
  const visible = rest.slice(0, shown);

  const featuredSrc = imageSrc(featured?.featured_image) || imageSrc(page?.featured_image);

  return (
    <div className="relative w-full overflow-hidden px-4 pb-16 md:px-12">
      <div className="pointer-events-none absolute top-[-8rem] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-linear-to-b from-primary/10 via-secondary-container/20 to-transparent blur-[120px]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center pt-8 pb-12 text-center md:pt-14">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-high/70 px-4 py-1.5 shadow-[0_0_20px_rgba(229,195,120,0.15)] backdrop-blur-md">
          <ConchIcon className="h-3 w-3" />
          <span className="text-[11px] font-bold tracking-[0.22em] text-primary uppercase">
            {page?.eyebrow || "Vedic Shastra · Sacred Wisdom"}
          </span>
          <span className="text-xs text-secondary">☉</span>
        </div>
        <h1 className="mb-6 max-w-4xl font-serif text-[30px] leading-[38px] tracking-tight text-primary md:text-[56px] md:leading-[68px]">
          {page?.title || "Illuminations of the Rishis: Vedic Wisdom & Astrological Articles"}
        </h1>
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-on-surface-variant">
          {page?.hero_copy ||
            "Quiet reading on pooja, consultation, and temple journeys — written for families seeking clear, traditional guidance."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Traditional jyothisha
          </span>
          <span className="opacity-40">/</span>
          <span>Shastric commentary</span>
          <span className="opacity-40">/</span>
          <span>Sidereal calculations</span>
        </div>
      </div>

      {categories.length ? (
        <div className="relative z-10 mx-auto mb-14 max-w-6xl">
          <div className="no-scrollbar flex items-center justify-start gap-2.5 overflow-x-auto pb-4 md:justify-center">
            <button
              type="button"
              onClick={() => {
                setActive("All");
                setShown(PAGE_SIZE);
              }}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm transition ${
                active === "All"
                  ? "bg-primary-container font-semibold text-on-primary shadow-[0_0_20px_rgba(229,195,120,0.35)]"
                  : "bg-surface-high/60 text-on-surface backdrop-blur-md hover:bg-surface-highest"
              }`}
            >
              All articles ({articles.length})
            </button>
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setActive(name);
                  setShown(PAGE_SIZE);
                }}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm transition ${
                  active === name
                    ? "bg-primary-container font-semibold text-on-primary shadow-[0_0_20px_rgba(229,195,120,0.35)]"
                    : "bg-surface-high/60 text-on-surface backdrop-blur-md hover:bg-surface-highest"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {featured ? (
        <div className="relative z-10 mx-auto mb-20 max-w-6xl">
          <div className="group relative overflow-hidden rounded-2xl bg-surface-low shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <div className="grid min-h-[460px] grid-cols-1 lg:grid-cols-12">
              <div className="relative h-72 overflow-hidden sm:h-96 lg:col-span-7 lg:h-auto">
                {featuredSrc ? (
                  <img
                    src={featuredSrc}
                    alt={featured.featured_image?.alt || featured.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-surface-lowest to-secondary-container/50" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-surface-low via-surface-low/20 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-surface-low/40 lg:to-surface-low" />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-md bg-surface-lowest/80 px-3 py-1.5 backdrop-blur-md">
                  <span className="text-[11px] font-bold tracking-widest text-on-surface uppercase">
                    {featured.categories[0] || "Featured reading"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between bg-surface-low/95 p-6 sm:p-10 lg:col-span-5">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-secondary-container/60 px-3 py-1 text-[11px] font-bold tracking-wider text-secondary uppercase">
                      Editor’s pick
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {readingMinutes(featured.content || featured.excerpt)} min read
                    </span>
                  </div>
                  <h2 className="mb-4 font-serif text-[22px] leading-snug text-primary sm:text-[32px] sm:leading-10">
                    {featured.title}
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">{featured.excerpt}</p>
                </div>
                <div className="-mx-6 -mb-6 flex flex-col justify-between gap-4 bg-surface-container/50 p-6 sm:-mx-10 sm:-mb-10 sm:flex-row sm:items-center sm:p-10">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      {featured.writer_name?.trim() || "JyothishiUncle"}
                    </p>
                    <p className="text-xs text-on-surface-variant">{formatArticleDate(featured.date)}</p>
                  </div>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary shadow-[0_8px_20px_rgba(201,162,39,0.3)] transition hover:brightness-95"
                  >
                    Read sacred article →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="relative z-10 mx-auto max-w-6xl pb-16 text-center text-on-surface-variant">
          Articles will appear here once they are published in WordPress.
        </p>
      )}

      {visible.length ? (
        <>
          <div className="relative z-10 mx-auto mb-10 flex max-w-6xl flex-col justify-between pb-4 md:flex-row md:items-end">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-secondary uppercase">Archive chronicles</span>
              <h3 className="mt-1 font-serif text-[32px] leading-10 text-on-surface">Cosmic discourses</h3>
            </div>
            <p className="mt-2 max-w-md text-sm text-on-surface-variant md:mt-0">
              Quiet notes on pooja, consultation, and family ritual — published as they are written.
            </p>
          </div>
          <div className="relative z-10 mx-auto mb-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      ) : null}

      {rest.length > shown ? (
        <div className="relative z-10 mx-auto mb-24 max-w-md text-center">
          <button
            type="button"
            onClick={() => setShown((value) => value + PAGE_SIZE)}
            className="inline-flex items-center justify-center rounded-full bg-surface-high px-8 py-3.5 text-sm font-semibold text-primary shadow-[0_8px_25px_rgba(0,0,0,0.4)] transition hover:bg-surface-highest"
          >
            Load more articles ({rest.length - shown} more)
          </button>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-3xl bg-linear-to-b from-surface-container to-surface-lowest p-8 text-center shadow-[0_25px_80px_rgba(0,0,0,0.6)] sm:p-14">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
            ॐ
          </div>
          <span className="mb-3 text-[11px] font-bold tracking-[0.25em] text-secondary uppercase">Personal guidance</span>
          <h3 className="mb-4 max-w-2xl font-serif text-[22px] leading-8 text-primary sm:text-[40px] sm:leading-[48px]">
            Need personal guidance beyond the articles?
          </h3>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            Articles share general teaching. A private consultation looks at your chart and questions in confidence.
          </p>
          <div className="mb-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <BookConsultationButton className="inline-flex w-full items-center justify-center rounded-full bg-primary-container px-8 py-3.5 text-sm font-semibold tracking-wide text-on-primary shadow-[0_0_24px_rgba(229,195,120,0.45)] transition hover:brightness-95 sm:w-auto">
              Book 1-on-1 consultation
            </BookConsultationButton>
            {whatsappNumber ? (
              <a
                href={whatsappUrl(whatsappNumber, "Hello, I have a question after reading an article.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-surface-highest px-8 py-3.5 text-sm font-semibold text-on-surface transition hover:text-primary sm:w-auto"
              >
                WhatsApp
              </a>
            ) : null}
          </div>
          <div className="grid w-full max-w-2xl grid-cols-1 gap-4 rounded-xl bg-surface-low/60 p-4 sm:grid-cols-3">
            {["Clear birth-chart reading", "Confidential session", "Practical next steps"].map((item) => (
              <div key={item} className="flex items-center justify-center gap-2 text-sm text-on-surface-variant">
                <span className="text-primary">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
