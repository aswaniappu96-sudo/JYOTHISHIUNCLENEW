import type { Metadata } from "next";
import { ArticlesView } from "@/components/pages/ArticlesView";
import { getArticles, getPage, getSettings, settleApi } from "@/lib/api/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles",
  description: "Vedic wisdom, pooja notes, and consultation guidance from JyothishiUncle.",
};

export default async function BlogPage() {
  const [articles, page, settings] = await Promise.all([
    settleApi(getArticles(), []),
    settleApi(getPage("articles"), null),
    settleApi(getSettings(), null),
  ]);

  return (
    <ArticlesView
      articles={articles}
      page={page}
      whatsappNumber={settings?.whatsapp_number || ""}
    />
  );
}
