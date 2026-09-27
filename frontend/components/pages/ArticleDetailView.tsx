import Link from "next/link";
import { ConchIcon } from "@/components/icons/ConchIcon";
import { ArticleCard } from "@/components/pages/ArticleCard";
import { ArticlePanchangRail } from "@/components/pages/ArticlePanchangRail";
import { ArticleShareBar } from "@/components/pages/ArticleShareBar";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { articleCategory, formatArticleDate, readingMinutes, stripHtml, stripPublicPrices } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Article, Astrologer, Product } from "@/types/wordpress";

export function ArticleDetailView({
  article,
  related,
  whatsappNumber,
  author,
  product,
}: {
  article: Article;
  related: Article[];
  whatsappNumber: string;
  author?: Astrologer | null;
  product?: Product | null;
}) {
  const src = imageSrc(article.featured_image);
  const category = articleCategory(article);
  const mins = readingMinutes(article.content || article.excerpt);
  const excerpt = stripPublicPrices(stripHtml(article.excerpt));
  const content = stripPublicPrices(article.content);
  const tags = article.tags.filter(Boolean);
  const authorName = article.writer_name?.trim() || "JyothishiUncle";
  const authorPhoto = imageSrc(author?.featured_image);
  const authorNote = stripPublicPrices(stripHtml(author?.full_description || author?.short_description || ""));
  const productSrc = imageSrc(product?.featured_image);
  const waHref = whatsappNumber
    ? whatsappUrl(whatsappNumber, `Hello, I read “${article.title}” and would like guidance.`)
    : "";

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-secondary-container/20 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-80 w-80 rounded-full bg-primary-container/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 -z-10 h-96 w-96 rounded-full bg-secondary-container/15 blur-[150px]" />

      <div className="mx-auto max-w-6xl px-4 pt-6 pb-7 md:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px] font-bold tracking-widest text-on-surface-variant uppercase"
        >
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span>Religious</span>
          <span className="opacity-40">/</span>
          <Link href="/blog" className="transition hover:text-primary">
            Vedic articles
          </Link>
          <span className="opacity-40">/</span>
          <span className="max-w-xs truncate text-primary md:max-w-md">{article.title}</span>
        </nav>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface-high/90 px-3 py-1.5 text-primary shadow-md">
          <ConchIcon className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase">{category}</span>
        </div>

        <h1 className="mt-1 mb-6 max-w-4xl font-serif text-[30px] leading-[38px] tracking-tight text-primary md:text-[56px] md:leading-[68px]">
          {article.title}
        </h1>

        <div className="flex flex-col justify-between gap-4 rounded-xl bg-surface-low/70 p-4 shadow-xl backdrop-blur-xl lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              {authorPhoto ? (
                <img src={authorPhoto} alt={authorName} className="h-14 w-14 rounded-full object-cover shadow-lg" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container font-serif text-xl text-on-primary shadow-lg">
                  ॐ
                </div>
              )}
              <span className="absolute right-0 bottom-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary-container text-[9px] font-bold text-on-primary">
                ॐ
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold text-on-surface">{authorName}</span>
                {article.writer_name?.trim() ? (
                  <span className="rounded-full bg-surface-highest px-2 py-0.5 text-xs text-secondary">Writer</span>
                ) : null}
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                <span>{formatArticleDate(article.date)}</span>
                <ConchIcon className="h-2.5 w-2.5 opacity-70" />
                <span>{mins} min read</span>
              </p>
            </div>
          </div>
          <BookConsultationButton className="inline-flex items-center justify-center rounded-full bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary shadow-[0_0_30px_rgba(229,195,120,0.35)] transition hover:brightness-95">
            Seek individual chart consultation
          </BookConsultationButton>
        </div>
      </div>

      {src ? (
        <div className="mx-auto mb-12 max-w-6xl px-4 md:px-12">
          <div className="relative overflow-hidden rounded-2xl bg-surface-container shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <img
              src={src}
              alt={article.featured_image?.alt || article.title}
              className="h-[360px] w-full object-cover object-center md:h-[540px]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-surface-lowest via-surface/40 to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-xl">
                <span className="rounded bg-surface-highest/80 px-2.5 py-1 text-[11px] font-bold tracking-widest text-primary uppercase backdrop-blur-md">
                  {category}
                </span>
                {excerpt ? (
                  <p className="mt-2 line-clamp-3 font-serif text-[22px] leading-8 text-on-surface drop-shadow-md">
                    {excerpt}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 pb-12 lg:grid-cols-12 md:px-12">
        <article className="flex flex-col gap-7 lg:col-span-8">
          {excerpt && !src ? (
            <div className="relative overflow-hidden rounded-2xl bg-surface-container/60 p-7 shadow-lg backdrop-blur-xl">
              <p className="font-serif text-[22px] leading-8 text-primary italic">{excerpt}</p>
            </div>
          ) : null}

          <div className="prose-ju text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />

          <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-surface-high via-surface-container to-surface-low p-7 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
            <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary-container/20 blur-3xl" />
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-widest text-primary uppercase">
              <ConchIcon className="h-4 w-4" />
              Private session
            </div>
            <h3 className="mb-2 font-serif text-[32px] leading-10 text-primary">Want this applied to your chart?</h3>
            <p className="mb-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
              A consultation can take the teaching in this article and look at your own questions. Share your details
              through the booking form, or message us on WhatsApp.
            </p>
            <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
              <BookConsultationButton className="inline-flex items-center justify-center rounded-full bg-primary-container px-5 py-3 text-sm font-semibold tracking-wide text-on-primary shadow-[0_0_24px_rgba(229,195,120,0.35)] transition hover:brightness-95">
                Book a consultation
              </BookConsultationButton>
              {waHref ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-surface-highest px-5 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-high"
                >
                  Discuss on WhatsApp
                </a>
              ) : null}
            </div>
          </div>

          <ArticleShareBar title={article.title} tags={tags} />

          <div className="mt-1 flex flex-col items-center gap-4 rounded-2xl bg-surface-high p-7 shadow-xl md:flex-row md:items-start">
            {authorPhoto ? (
              <img src={authorPhoto} alt={authorName} className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-lg" />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-container font-serif text-3xl text-on-primary shadow-lg">
                ॐ
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 flex flex-col justify-between gap-1 md:flex-row md:items-center">
                <h3 className="font-serif text-[22px] leading-8 text-primary">{authorName}</h3>
                {author?.specialty ? (
                  <span className="text-[11px] font-bold tracking-widest text-secondary uppercase">{author.specialty}</span>
                ) : null}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-on-surface-variant">
                {authorNote ||
                  "Guidance from JyothishiUncle for pooja, consultation, and spiritual questions worldwide."}
              </p>
              <Link href={author ? "/astrologers" : "/about"} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                {author ? "View astrologers" : "About JyothishiUncle"}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-7 lg:col-span-4">
          <div className="flex flex-col gap-7 lg:sticky lg:top-24">
            <ArticlePanchangRail />

            <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-surface-high to-surface-container p-7 text-center shadow-2xl">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-lg">
                <span className="font-serif text-xl">ॐ</span>
              </div>
              <h4 className="mb-2 font-serif text-[22px] leading-8 text-primary">Private 1-on-1 consultation</h4>
              <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
                Book a session to discuss the questions this article raises for your chart.
              </p>
              <BookConsultationButton className="inline-flex w-full items-center justify-center rounded-full bg-primary-container py-3 text-sm font-semibold text-on-primary shadow-[0_0_24px_rgba(229,195,120,0.4)] transition hover:brightness-95">
                Reserve a slot
              </BookConsultationButton>
              <span className="mt-2 block text-xs text-on-surface-variant opacity-70">Audio or video, worldwide</span>
            </div>

            {product ? (
              <div className="flex items-center gap-4 rounded-2xl bg-surface-low p-4 shadow-md">
                {productSrc ? (
                  <img src={productSrc} alt={product.featured_image?.alt || product.title} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-surface-highest text-primary">
                    <ConchIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold tracking-wider text-secondary uppercase">Sacred product</span>
                  <h5 className="mt-0.5 text-lg leading-tight font-semibold text-on-surface">{product.title}</h5>
                  {product.short_description ? (
                    <span className="mt-1 line-clamp-2 text-xs text-on-surface-variant">
                      {stripPublicPrices(stripHtml(product.short_description))}
                    </span>
                  ) : null}
                  <Link href={`/product/${product.slug}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    Explore item →
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      {related.length ? (
        <section className="mx-auto mb-12 max-w-6xl rounded-3xl bg-surface-lowest/70 px-4 py-12 md:px-12">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="mb-1 block text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Further reading</span>
              <h2 className="font-serif text-[32px] leading-10 text-on-surface">Related articles</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-secondary transition hover:text-primary">
              Explore complete archive →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="relative overflow-hidden bg-surface-high py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,224,157,0.1),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-12">
          <span className="mb-2 block text-[11px] font-bold tracking-[0.25em] text-primary uppercase">Apply this teaching</span>
          <h2 className="mb-3 font-serif text-[30px] leading-[38px] text-primary md:text-[56px] md:leading-[68px]">
            Turn this article into a private conversation
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            Book a consultation, or explore poojas if a ritual is the next step.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BookConsultationButton className="inline-flex w-full items-center justify-center rounded-full bg-primary-container px-12 py-3.5 text-sm font-semibold tracking-wide text-on-primary shadow-[0_0_32px_rgba(229,195,120,0.45)] transition hover:brightness-95 sm:w-auto">
              Book full consultation
            </BookConsultationButton>
            <Link
              href="/services"
              className="inline-flex w-full items-center justify-center rounded-full bg-surface-container px-8 py-3.5 text-sm font-semibold text-on-surface transition hover:bg-surface sm:w-auto"
            >
              Explore poojas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
