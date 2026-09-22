import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { getArticle, getArticles } from "@/lib/api/wordpress";
import { imageSrc } from "@/lib/media";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getArticles().catch(() => []);
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return {
    title: article?.title || "Article",
    description: article?.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <PageIntro
        eyebrow={article.categories[0] || "Article"}
        title={article.title}
        copy={article.excerpt}
        image={imageSrc(article.featured_image) || undefined}
      />
      <article className="prose-ju mx-auto max-w-3xl px-5 py-16" dangerouslySetInnerHTML={{ __html: article.content }} />
    </>
  );
}
