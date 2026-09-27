export function whatsappUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

export function consultationWhatsAppMessage(details: {
  name: string;
  address: string;
  phone: string;
  email: string;
  dateLabel: string;
  timeLabel: string;
  reason: string;
  astrologer?: string;
  freeSlot?: boolean;
}) {
  const astrologer = details.astrologer?.trim();
  const greeting =
    astrologer && astrologer.toLowerCase() !== "consultation only"
      ? `Namaste. I would like to consult ${astrologer} at JyothishiUncle.`
      : "Namaste. I would like to consult JyothishiUncle.";
  const closing = details.freeSlot
    ? "This is my first 10-minute free consultation as a logged-in member. Please confirm if this time works, or suggest another available date."
    : "I need to know about payment. Please share the payment details so I can complete it on WhatsApp.";
  const lines = [
    greeting,
    "",
    "These are my details and preferred availability. Kindly let me know if you are available on this date and time; if not, I am happy to choose another slot.",
    "",
    `Name: ${details.name}`,
    `Address: ${details.address}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Preferred date: ${details.dateLabel}`,
    `Preferred time: ${details.timeLabel}`,
    `Astrologer: ${astrologer || "Consultation only"}`,
    `Reason for consultation: ${details.reason}`,
    "",
    closing,
  ];
  if (!details.freeSlot) {
    lines.push("", "Please confirm if this time works, or suggest another available date.");
  }
  return lines.join("\n");
}

export function formatBookingDate(value: string) {
  if (!value) return "";
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function poojaWhatsAppMessage(details: {
  poojaTitle: string;
  mode: string;
  vendor?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  dateLabel: string;
  notes: string;
}) {
  const mode = details.mode === "offline" ? "Offline pooja" : "Online pooja";
  const vendor = details.vendor?.trim();
  const lines = [
    "Namaste. This is a pooja booking with JyothishiUncle.",
    "",
    "I would like to book the pooja below. Kindly confirm if this date works; if not, I am happy to choose another date.",
    "",
    `Pooja: ${details.poojaTitle}`,
    `Mode: ${mode}`,
  ];
  lines.push(`Pooja temple: ${vendor || "To be confirmed"}`);
  lines.push(
    `Name: ${details.name}`,
    `Address: ${details.address}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Preferred date: ${details.dateLabel}`,
    `Sankalpa notes: ${details.notes || "—"}`,
    "",
    "I need to know about payment. Please share the payment details so I can complete it on WhatsApp.",
    "",
    "Please confirm this pooja booking, or suggest another available date.",
  );
  return lines.join("\n");
}

export function productWhatsAppMessage(details: {
  productTitle: string;
  quantity: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  notes: string;
}) {
  return [
    "Namaste. This is a product booking with JyothishiUncle.",
    "",
    "I would like to buy the product below. The selected product is available.",
    "",
    `Product: ${details.productTitle}`,
    `Quantity: ${details.quantity}`,
    `Name: ${details.name}`,
    `Address: ${details.address}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Message: ${details.notes || "—"}`,
    "",
    "I need to know the price details.",
    "",
    "Please confirm this product booking.",
  ].join("\n");
}

export function travelWhatsAppMessage(details: {
  yatraTitle: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  dates: string;
  notes: string;
}) {
  return [
    "Namaste. This is a temple yatra enquiry with JyothishiUncle.",
    "",
    "I would like to know more about travel.",
    "",
    `Yatra: ${details.yatraTitle}`,
    `Name: ${details.name}`,
    `Address: ${details.address}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Preferred dates: ${details.dates || "To be confirmed"}`,
    `Message: ${details.notes || "—"}`,
    "",
    "I need to know about payment. Please share the payment details so I can complete it on WhatsApp.",
    "",
    "Please confirm this yatra enquiry. Dates and dakshina can be shared privately.",
  ].join("\n");
}
