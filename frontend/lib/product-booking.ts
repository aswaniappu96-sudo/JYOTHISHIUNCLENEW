import { submitProductEnquiry } from "@/lib/api/submit";
import { productWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";

export async function saveProductBookingAndWhatsApp({
  slug,
  title,
  form,
  whatsappNumber,
}: {
  slug: string;
  title: string;
  form: FormData;
  whatsappNumber: string;
}) {
  const name = String(form.get("name") || "");
  const email = String(form.get("email") || "");
  const mobile = String(form.get("mobile") || "");
  const location = String(form.get("location") || "");
  const quantity = Math.max(1, Number(form.get("quantity") || 1));
  const message = String(form.get("message") || "");

  const waMessage = productWhatsAppMessage({
    productTitle: title,
    quantity,
    name,
    address: location,
    phone: mobile,
    email,
    notes: message,
  });

  await submitProductEnquiry({
    product: slug,
    product_title: title,
    name,
    email,
    mobile,
    location,
    quantity,
    message,
    website: String(form.get("website") || ""),
  });

  const whatsappHref = whatsappNumber.trim() ? whatsappUrl(whatsappNumber, waMessage) : "";
  return { whatsappHref };
}
