import Link from "next/link";
import { articleCategory, formatArticleDate, readingMinutes } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import type { Article } from "@/types/wordpress";

export function ArticleCard({ article }: { article: Article }) {
  const src = imageSrc(article.featured_image);
  const category = articleCategory(article);
  const mins = readingMinutes(article.content || article.excerpt);

  return (
    <article className="group flex h-full flex-col justify-between rounded-xl bg-surface-container p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:bg-surface-high">
      <div>
        <div className="relative mb-5 h-48 w-full overflow-hidden rounded-lg bg-surface-lowest">
          {src ? (
            <img
              src={src}
              alt={article.featured_image?.alt || article.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-surface-lowest to-secondary-container/40" />
          )}
          <div className="absolute top-3 left-3 rounded-full bg-surface-lowest/80 px-2.5 py-1 text-[11px] font-bold tracking-[0.18em] text-tertiary uppercase backdrop-blur-md">
            {category}
          </div>
          <div className="absolute right-3 bottom-3 rounded bg-surface-lowest/80 px-2 py-0.5 text-xs text-on-surface backdrop-blur-sm">
            {mins} min read
          </div>
        </div>
        {article.tags[0] ? (
          <span className="mb-1 block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            {article.tags[0]}
          </span>
        ) : null}
        <h3 className="mb-3 font-serif text-[22px] leading-snug text-primary transition group-hover:text-primary-container">
          {article.title}
        </h3>
        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">{article.excerpt}</p>
      </div>
      <div className="flex items-center justify-between pt-4">
        <span className="text-xs text-on-surface-variant">
          {article.writer_name?.trim() ? `${article.writer_name.trim()} · ` : ""}
          {formatArticleDate(article.date)}
        </span>
        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:translate-x-1"
        >
          Read study →
        </Link>
      </div>
    </article>
  );
}
