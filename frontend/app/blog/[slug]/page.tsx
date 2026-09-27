import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailView } from "@/components/pages/ArticleDetailView";
import { getArticle, getArticles, getAstrologers, getProducts, getSettings } from "@/lib/api/wordpress";

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
  const [article, articles, settings, astrologers, products] = await Promise.all([
    getArticle(slug),
    getArticles().catch(() => []),
    getSettings().catch(() => null),
    getAstrologers().catch(() => []),
    getProducts().catch(() => []),
  ]);
  if (!article) notFound();

  return (
    <ArticleDetailView
      article={article}
      related={articles.filter((item) => item.slug !== article.slug).slice(0, 3)}
      whatsappNumber={settings?.whatsapp_number || ""}
      author={
        astrologers.find(
          (item) => item.title.trim().toLowerCase() === (article.writer_name || "").trim().toLowerCase(),
        ) || null
      }
      product={products[0] || null}
    />
  );
}
