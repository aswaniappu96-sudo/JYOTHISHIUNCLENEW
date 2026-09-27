import { submitPoojaBooking } from "@/lib/api/submit";
import { formatBookingDate, poojaWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Vendor } from "@/types/wordpress";

export function vendorTempleLabel(vendors: Vendor[], slug: string) {
  const vendor = vendors.find((item) => item.slug === slug);
  if (!vendor) return slug;
  return vendor.location ? `${vendor.title} — ${vendor.location}` : vendor.title;
}

export async function savePoojaBookingAndWhatsApp({
  slug,
  title,
  form,
  vendors,
  whatsappNumber,
}: {
  slug: string;
  title: string;
  form: FormData;
  vendors: Vendor[];
  whatsappNumber: string;
}) {
  const name = String(form.get("name") || "");
  const email = String(form.get("email") || "");
  const mobile = String(form.get("mobile") || "");
  const location = String(form.get("location") || "");
  const preferredDate = String(form.get("preferred_date") || "");
  const offeringMode = String(form.get("offering_mode") || "online");
  const vendorSlug = String(form.get("vendor") || "");
  const message = String(form.get("message") || "");
  const vendor = vendorSlug ? vendorTempleLabel(vendors, vendorSlug) : "";

  const waMessage = poojaWhatsAppMessage({
    poojaTitle: title,
    mode: offeringMode,
    vendor,
    name,
    address: location,
    phone: mobile,
    email,
    dateLabel: formatBookingDate(preferredDate) || preferredDate,
    notes: message,
  });

  await submitPoojaBooking({
    pooja: slug,
    pooja_title: title,
    name,
    email,
    mobile,
    location,
    preferred_date: preferredDate,
    offering_mode: offeringMode,
    vendor: vendorSlug,
    message,
    website: String(form.get("website") || ""),
  });

  const whatsappHref = whatsappNumber.trim() ? whatsappUrl(whatsappNumber, waMessage) : "";
  return { whatsappHref };
}
