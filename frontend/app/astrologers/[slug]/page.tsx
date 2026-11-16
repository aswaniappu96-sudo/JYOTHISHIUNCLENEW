import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AstrologerProfileView } from "@/components/pages/AstrologerProfileView";
import { astrologerNameSlug } from "@/lib/astrologer-display";
import { fallbackSettings, getAstrologers, getSettings, resolveAstrologer, settleApi } from "@/lib/api/wordpress";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await resolveAstrologer(slug);
  return {
    title: item?.title ? `${item.title} · Astrologer` : "Astrologer",
    description: item?.short_description || item?.specialty || "Talk to an astrologer at MaharshiOm.",
    openGraph: {
      title: item?.title,
      description: item?.short_description || item?.specialty,
    },
  };
}

export default async function AstrologerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await resolveAstrologer(slug);
  if (!item) notFound();
  const canonical = astrologerNameSlug(item.title, item.slug);
  if (canonical && canonical !== slug) redirect(`/astrologers/${canonical}`);
  const [settings, astrologers] = await Promise.all([
    settleApi(getSettings(), fallbackSettings()),
    settleApi(getAstrologers(), []),
  ]);

  return (
    <AstrologerProfileView
      person={item}
      related={astrologers.filter((entry) => entry.slug !== item.slug)}
      phone={settings.phone_number}
      whatsapp={settings.whatsapp_number}
    />
  );
}
