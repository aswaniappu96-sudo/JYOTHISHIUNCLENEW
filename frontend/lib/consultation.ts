export const CONSULTATION_ONLY_LABEL = "Consultation only";

export function contactNumber(phone?: string, whatsapp?: string) {
  return (phone || whatsapp || "").trim();
}
