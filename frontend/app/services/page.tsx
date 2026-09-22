import type { Metadata } from "next";
import { ServicesView } from "@/components/pages/ServicesView";
import { getPage, getPoojas, getProducts, settleApi } from "@/lib/api/wordpress";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sacred Services & Divine Consecrations",
  description: "Shastric poojas, Vedic homams, and consecrated planetary artifacts from JyothishiUncle.",
};

export default async function ServicesPage() {
  const [poojas, products, page] = await Promise.all([
    settleApi(getPoojas(), []),
    settleApi(getProducts(), []),
    settleApi(getPage("services"), null),
  ]);
  return <ServicesView poojas={poojas} products={products} page={page} />;
}
