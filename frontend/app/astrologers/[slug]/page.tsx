import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AstrologerProfileView } from "@/components/pages/AstrologerProfileView";
import { fallbackSettings, getAstrologer, getAstrologers, getSettings, settleApi } from "@/lib/api/wordpress";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getAstrologer(slug);
  return {
    title: item?.title ? `${item.title} · Astrologer` : "Astrologer",
    description: item?.short_description || item?.specialty || "Talk to an astrologer at JyothishiUncle.",
    openGraph: {
      title: item?.title,
      description: item?.short_description || item?.specialty,
    },
  };
}

export default async function AstrologerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, settings, astrologers] = await Promise.all([
    getAstrologer(slug),
    settleApi(getSettings(), fallbackSettings()),
    settleApi(getAstrologers(), []),
  ]);
  if (!item) notFound();

  return (
    <AstrologerProfileView
      person={item}
      related={astrologers.filter((entry) => entry.slug !== item.slug)}
      phone={settings.phone_number}
      whatsapp={settings.whatsapp_number}
    />
  );
}
