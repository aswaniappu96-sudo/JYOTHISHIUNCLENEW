import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { getArticles, getPage, settleApi } from "@/lib/api/wordpress";
import { imageSrc } from "@/lib/media";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Articles",
  description: "Guidance on pooja, consultation, and temple journeys from JyothishiUncle.",
};

export default async function BlogPage() {
  const [articles, page] = await Promise.all([
    settleApi(getArticles(), []),
    settleApi(getPage("articles"), null),
  ]);

  return (
    <>
      <PageIntro
        eyebrow={page?.eyebrow || "Articles"}
        title={page?.title || "Reading for a quieter mind"}
        copy={page?.hero_copy}
        image={imageSrc(page?.featured_image) || undefined}
      />
      <section className="mx-auto grid max-w-4xl gap-6 px-5 py-16">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="glass-card flex gap-5 rounded-3xl p-6 transition hover:border-saffron/50"
          >
            {imageSrc(article.featured_image) ? (
              <img src={imageSrc(article.featured_image)} alt="" className="h-28 w-28 shrink-0 rounded-2xl object-cover" />
            ) : null}
            <div>
              <h2 className="font-serif text-3xl text-white">{article.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
