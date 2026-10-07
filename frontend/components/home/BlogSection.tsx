"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { stripHtml, stripPublicPrices } from "@/lib/html";
import { useLocalizedList } from "@/lib/localized";
import { imageSrc } from "@/lib/media";
import { POOJAS_PATH } from "@/lib/siteRoutes";
import { useJuList } from "@/lib/useJuList";
import type { Article } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

const TOPICS = ["All", "Dosha", "Remedies", "Temples", "Kundli", "Prashna"] as const;
type Topic = (typeof TOPICS)[number];

const FALLBACKS = [
  "from-[#FFF5D6] via-[#FFE9A8] to-[#F9D48B]",
  "from-[#FFF1E6] via-[#FFDDC2] to-[#FFC49A]",
  "from-[#E8F5E9] via-[#D1EED3] to-[#B8DDB9]",
  "from-[#EDE7FF] via-[#DDD2FF] to-[#CAB8FF]",
  "from-[#E0F2F1] via-[#BFE9E6] to-[#9EDAD5]",
  "from-[#FFECEC] via-[#FFD6D6] to-[#FFBABA]",
];

function articleTopic(article: Article): Exclude<Topic, "All"> | "Guidance" {
  const hay = [...(article.categories || []), ...(article.tags || []), article.title, article.excerpt]
    .join(" ")
    .toLowerCase();
  if (/dosha|sade.?sati|mangal|shani|nadi/.test(hay)) return "Dosha";
  if (/remed|parihara|mantra|gemstone/.test(hay)) return "Remedies";
  if (/temple|guruvayur|darshan|archana|sanctum/.test(hay)) return "Temples";
  if (/kundli|jathak|match|guna milan/.test(hay)) return "Kundli";
  if (/prashna|prasnam|horary/.test(hay)) return "Prashna";
  const cat = (article.categories?.[0] || "").trim();
  if (TOPICS.includes(cat as Topic) && cat !== "All") return cat as Exclude<Topic, "All">;
  return "Guidance";
}

function serviceFor(topic: string) {
  if (topic === "Temples" || topic === "Dosha") {
    return { label: "Book pooja", href: POOJAS_PATH };
  }
  return { label: "Talk to astrologer", href: "/#consultation" };
}

function readMins(article: Article) {
  const text = stripHtml(article.excerpt || article.content || "");
  return Math.max(3, Math.min(8, Math.round(text.length / 280) || 3));
}

function categoryLabel(topic: string) {
  if (topic === "Dosha") return "DOSHA & REMEDIES";
  if (topic === "Kundli") return "KUNDLI MATCHING";
  if (topic === "Temples") return "TEMPLE STORIES";
  if (topic === "Prashna") return "PRASHNA GUIDE";
  if (topic === "Remedies") return "DAILY REMEDIES";
  return topic.toUpperCase();
}

export function BlogSection({
  articles,
  youtubeUrl = "",
}: {
  articles: Article[];
  youtubeUrl?: string;
}) {
  const { t } = usePrefs();
  const list = useJuList<Article>("/articles", articles);
  const localized = useLocalizedList(list);
  const [topic, setTopic] = useState<Topic>("All");

  const filtered = useMemo(() => {
    if (topic === "All") return localized;
    const allowed = new Set(list.filter((item) => articleTopic(item) === topic).map((item) => item.id));
    return localized.filter((item) => allowed.has(item.id));
  }, [list, localized, topic]);

  if (!localized.length) return null;

  const featured = filtered[0] || localized[0];
  const rail = filtered.slice(1, 4);
  const grid = (topic === "All" ? localized.slice(3) : filtered).slice(0, 6);
  const youtube = youtubeUrl || "https://www.youtube.com";

  return (
    <section id="articles" className="relative w-full overflow-hidden scroll-mt-36 py-12 md:py-16 lg:py-20">
      <div className="pointer-events-none absolute -top-[200px] left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.07]" style={{ background: "repeating-radial-gradient(circle at center, transparent 0 22px, #B87E3B 22px 23px, transparent 23px 44px)" }} />

      <div className={INNER}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-white px-4 py-1.5 text-[10px] font-medium tracking-[0.18em] text-[#8A6A3A] shadow-[0_1px_0_0_#F5E8C6]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B87E3B]" />
              {t("articles.kicker")}
            </div>
            <PageHeading className="mt-6" lead={t("articles.lead")} accent={t("articles.accent")} />
            <p className="mt-4 max-w-[520px] text-[15px] leading-[1.6] text-[#6B5E53] md:text-[16px]">
              {t("articles.copy")}{" "}
              <span className="text-[#2B241E]">{t("articles.copyEnd")}</span>
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#EAD9B0] bg-white px-5 py-2.5 text-[13px] font-medium tracking-wide text-[#6B4A23] transition hover:bg-[#FFFAE9]"
          >
            {t("articles.view")}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div id="all-articles" className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[#EAD9B0]" />
            <span className="text-[12px] tracking-[0.18em] text-[#9A8A7A]">{t("articles.filter")}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {TOPICS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTopic(item)}
                className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                  topic === item
                    ? "border-[#B87E3B] bg-[#B87E3B] text-white shadow-[0_4px_12px_rgba(184,126,59,0.25)]"
                    : "border-[#EAD9B0] bg-white text-[#6B4A23] hover:bg-[#FFFAE9]"
                }`}
              >
                {item === "All" ? t("articles.all") : item}
              </button>
            ))}
            <span className="ml-2 hidden items-center text-[12px] text-[#9A8A7A] md:inline-flex">
              {t("articles.count", { n: filtered.length })}
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.85fr] lg:items-start">
          <FeaturedCard article={featured} fallback={FALLBACKS[0]} />
          <div className="flex flex-col gap-4">
            {rail.length ? (
              rail.map((article, index) => (
                <RailCard key={article.id} article={article} fallback={FALLBACKS[(index + 1) % FALLBACKS.length]} />
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[#EAD9B0] bg-white/60 p-8 text-center">
                <p className="font-serif text-[14px] text-[#9A8A7A]">{t("articles.empty")}</p>
              </div>
            )}
            <div className="flex items-center gap-3 rounded-[16px] border border-[#EAD9B0] bg-[#FFFAE8] px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[14px] ring-1 ring-[#EAD9B0]">ॐ</div>
              <p className="text-[12px] leading-[1.4] text-[#6B5E53]">
                <span className="font-semibold text-[#4A3C2E]">{t("articles.serviceNote")}</span> {t("articles.serviceNote2")}
              </p>
            </div>
          </div>
        </div>

        {grid.length ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((article, index) => (
              <GridCard key={article.id} article={article} fallback={FALLBACKS[index % FALLBACKS.length]} />
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-[14px] border border-[#EAD9B0] bg-white px-5 py-4 shadow-[0_2px_0_0_#F5E8C6] md:flex-row">
          <div className="flex items-center gap-3 text-[13px] text-[#6B5E53]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFFBF0] ring-1 ring-[#EAD9B0]">▶︎</span>
            <span className="font-serif">{t("articles.youtube")}</span>
          </div>
          <a
            href={youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#221C16] px-5 py-2 text-[12px] font-medium tracking-wide text-[#FFFBF0] transition hover:bg-[#3A2F25]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D4D]" />
            {t("articles.watch")}
            <span>→</span>
          </a>
        </div>
        <p className="mx-auto mt-6 max-w-[680px] text-center font-serif text-[11px] leading-[1.5] text-[#A99B8C]">{t("articles.foot")}</p>
      </div>
    </section>
  );
}

function FeaturedCard({ article, fallback }: { article: Article; fallback: string }) {
  const src = imageSrc(article.featured_image);
  const topic = articleTopic(article);
  const service = serviceFor(topic);
  const mins = readMins(article);
  const excerpt = stripPublicPrices(stripHtml(article.excerpt || ""));

  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-[#EAD9B0] bg-white shadow-[0_8px_24px_-16px_rgba(184,126,59,0.25)] transition hover:shadow-[0_16px_40px_-18px_rgba(184,126,59,0.3)]">
      <Link href={`/blog/${article.slug}`} className={`relative flex h-[168px] w-full items-center justify-center overflow-hidden bg-linear-to-br md:h-[196px] ${fallback}`}>
        {src ? <img src={src} alt={article.title} className="absolute inset-0 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_55%)]" />
        <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium tracking-wide text-[#8A6A3A] backdrop-blur">
          FEATURED • EDITOR&apos;S PICK
        </div>
      </Link>
      <div className="p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#FFF2D6] px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-[#8A5A1F]">
            {categoryLabel(topic)}
          </span>
          <span className="text-[12px] text-[#9A8A7A]">•</span>
          <span className="text-[12px] text-[#9A8A7A]">{mins} min</span>
        </div>
        <h3 className="mt-4 font-serif text-[20px] font-bold leading-[1.25] tracking-[-0.01em] text-[#221C16] md:text-[22px]">
          <Link href={`/blog/${article.slug}`}>{article.title}</Link>
        </h3>
        {excerpt ? <p className="mt-2.5 line-clamp-2 text-[14px] leading-[1.6] text-[#7A6E64]">{excerpt}</p> : null}
        {article.writer_name ? (
          <div className="mt-4 flex items-center gap-2 text-[12px] text-[#9A8A7A]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FFFBF0] text-[11px] ring-1 ring-[#EAD9B0]">ॐ</span>
            {article.writer_name}
          </div>
        ) : null}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#F5E8C6]/70 pt-5">
          <Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B87E3B] transition hover:gap-2">
            Read guide →
          </Link>
          <Link href={service.href} className="inline-flex items-center rounded-full border border-[#EAD9B0] bg-[#FFFBF0] px-4 py-2 text-[12px] font-medium text-[#6B4A23] transition hover:bg-white">
            {service.label}
          </Link>
        </div>
      </div>
    </article>
  );
}

function RailCard({ article, fallback }: { article: Article; fallback: string }) {
  const src = imageSrc(article.featured_image);
  const topic = articleTopic(article);
  const service = serviceFor(topic);
  const excerpt = stripPublicPrices(stripHtml(article.excerpt || ""));

  return (
    <article className="group flex gap-4 rounded-[18px] border border-[#EAD9B0] bg-white p-3.5 shadow-[0_4px_16px_-12px_rgba(184,126,59,0.25)] transition hover:shadow-[0_10px_28px_-16px_rgba(184,126,59,0.28)]">
      <Link href={`/blog/${article.slug}`} className={`relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[12px] bg-linear-to-br ${fallback}`}>
        {src ? <img src={src} alt={article.title} className="h-full w-full object-cover" /> : null}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[10px] font-semibold tracking-[0.12em] text-[#9A7A4A]">{categoryLabel(topic)}</span>
          <span className="text-[10px] text-[#C7B89E]">• {readMins(article)} min</span>
        </div>
        <h3 className="mt-1 line-clamp-2 font-serif text-[14px] font-bold leading-[1.3] text-[#231E19]">
          <Link href={`/blog/${article.slug}`}>{article.title}</Link>
        </h3>
        {excerpt ? <p className="mt-1 line-clamp-1 text-[12px] leading-[1.4] text-[#85796C]">{excerpt}</p> : null}
        <div className="mt-2 flex items-center gap-3">
          <Link href={`/blog/${article.slug}`} className="text-[11px] font-medium text-[#8A6A3A] hover:text-[#B87E3B]">
            Read →
          </Link>
          <Link href={service.href} className="inline-flex items-center gap-1 rounded-full bg-[#FFFBF0] px-2.5 py-1 text-[10px] font-medium text-[#B87E3B] ring-1 ring-[#EAD9B0] hover:bg-white">
            → {service.label}
          </Link>
        </div>
      </div>
    </article>
  );
}

function GridCard({ article }: { article: Article; fallback: string }) {
  const topic = articleTopic(article);
  const service = serviceFor(topic);
  const excerpt = stripPublicPrices(stripHtml(article.excerpt || ""));
  const src = imageSrc(article.featured_image);

  return (
    <article className="flex flex-col overflow-hidden rounded-[18px] border border-[#EAD9B0] bg-white p-4 transition hover:shadow-[0_10px_24px_-16px_rgba(184,126,59,0.28)]">
      {src ? (
        <Link href={`/blog/${article.slug}`} className="mb-3 block overflow-hidden rounded-[12px]">
          <img src={src} alt={article.title} className="h-28 w-full object-cover" />
        </Link>
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-[#FFF2D6] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#8A5A1F]">
          {categoryLabel(topic)}
        </span>
        <span className="text-[11px] text-[#9A8A7A]">{readMins(article)} min</span>
      </div>
      <h4 className="mt-3 line-clamp-2 font-serif text-[15px] font-semibold leading-[1.35] text-[#221C16]">
        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
      </h4>
      {excerpt ? <p className="mt-2 line-clamp-2 text-[12px] leading-[1.5] text-[#7A6E64]">{excerpt}</p> : null}
      <div className="mt-4 flex items-center justify-between">
        <Link href={`/blog/${article.slug}`} className="text-[12px] font-medium text-[#B87E3B] hover:underline">
          Read guide →
        </Link>
        <Link href={service.href} className="text-[11px] font-medium text-[#8A6A3A] underline decoration-[#EAD9B0] underline-offset-4 hover:text-[#B87E3B]">
          {service.label}
        </Link>
      </div>
    </article>
  );
}
