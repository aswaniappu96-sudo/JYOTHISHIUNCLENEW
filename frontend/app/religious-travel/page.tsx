import type { Metadata } from "next";
import { TravelCard } from "@/components/cards/TravelCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { getPage, getTravelDestinations, settleApi } from "@/lib/api/wordpress";
import { imageSrc } from "@/lib/media";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Religious travel",
  description: "Temple and pilgrimage guidance from JyothishiUncle.",
};

export default async function TravelIndexPage() {
  const [destinations, page] = await Promise.all([
    settleApi(getTravelDestinations(), []),
    settleApi(getPage("religious-travel"), null),
  ]);

  return (
    <>
      <PageIntro
        eyebrow={page?.eyebrow || "Religious travel"}
        title={page?.title || "Temples and sacred places"}
        copy={page?.hero_copy || "Information and coordination for devotees. Confirm dates and temple rules locally."}
        image={imageSrc(page?.featured_image) || undefined}
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-3">
        {destinations.map((item) => (
          <TravelCard key={item.id} travel={item} />
        ))}
      </section>
    </>
  );
}
