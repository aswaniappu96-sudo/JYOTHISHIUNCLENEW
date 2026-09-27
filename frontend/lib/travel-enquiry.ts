import { submitTravelBooking } from "@/lib/api/submit";
import { travelWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";

export async function saveTravelEnquiryAndWhatsApp({
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
  const dates = String(form.get("preferred_dates") || "");
  const notes = String(form.get("message") || "");

  const waMessage = travelWhatsAppMessage({
    yatraTitle: title,
    name,
    address: location,
    phone: mobile,
    email,
    dates,
    notes,
  });

  await submitTravelBooking({
    travel: slug,
    travel_title: title,
    name,
    email,
    mobile,
    location,
    preferred_dates: dates,
    message: notes,
    website: String(form.get("website") || ""),
  });

  const whatsappHref = whatsappNumber.trim() ? whatsappUrl(whatsappNumber, waMessage) : "";
  return { whatsappHref };
}
