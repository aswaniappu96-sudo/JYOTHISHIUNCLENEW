import type { Metadata } from "next";
import { ContactView } from "@/components/pages/ContactView";
import { fallbackSettings, getPage, getSettings, settleApi } from "@/lib/api/wordpress";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact us",
  description: "General Shastric enquiry for pooja, astrology consultation, products, or temple travel guidance.",
};

export default async function ContactPage() {
  const [settings, page] = await Promise.all([
    settleApi(getSettings(), fallbackSettings()),
    settleApi(getPage("contact"), null),
  ]);

  return <ContactView settings={settings} page={page} />;
}
