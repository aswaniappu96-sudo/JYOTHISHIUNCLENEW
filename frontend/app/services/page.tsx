import type { Metadata } from "next";
import { ServicesView } from "@/components/pages/ServicesView";
import {
  fallbackSettings,
  getPage,
  getPoojaCategories,
  getPoojas,
  getProductCategories,
  getProducts,
  getSettings,
  getVendors,
  settleApi,
} from "@/lib/api/wordpress";
import { servicesTab } from "@/lib/siteRoutes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sacred Services & Divine Consecrations",
  description: "Shastric poojas, Vedic homams, and consecrated planetary artifacts from MaharshiOm.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const [poojas, products, poojaCategories, productCategories, page, settings, vendors] = await Promise.all([
    settleApi(getPoojas(), []),
    settleApi(getProducts(), []),
    settleApi(getPoojaCategories(), []),
    settleApi(getProductCategories(), []),
    settleApi(getPage("services"), null),
    settleApi(getSettings(), fallbackSettings()),
    settleApi(getVendors(), []),
  ]);
  return (
    <ServicesView
      poojas={poojas}
      products={products}
      poojaCategories={poojaCategories}
      productCategories={productCategories}
      page={page}
      whatsappNumber={settings.whatsapp_number}
      vendors={vendors}
      initialTab={servicesTab(params.tab)}
    />
  );
}
