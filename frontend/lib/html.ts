function decodeHtmlEntities(text: string) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export function decodeWpText(text: string) {
  if (!text) return text;
  return decodeHtmlEntities(text);
}

function cleanPlainText(html: string) {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

export function htmlListItems(html: string): string[] {
  if (!html) return [];
  return [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => cleanPlainText(match[1]))
    .filter(Boolean);
}

export function htmlParagraphs(html: string): string[] {
  if (!html) return [];
  const fromTags = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => cleanPlainText(match[1]))
    .filter(Boolean);
  if (fromTags.length) return fromTags;
  const text = cleanPlainText(html);
  return text ? [text] : [];
}

export function stripPublicPrices(text: string): string {
  if (!text) return text;
  return text
    .replace(/[₹$€£]\s*[\d,]+(?:\.\d+)?(?:\s*(?:USD|INR|AED|OMR))?/gi, "")
    .replace(/\b(?:INR|USD|AED|OMR|Rs\.?)\s*[\d,]+(?:\.\d+)?/gi, "")
    .replace(/\b[\d,]+\s*(?:INR|USD|AED|OMR)\b/gi, "")
    .replace(/\bDM on WhatsApp for payment details\b/gi, "Contact on WhatsApp")
    .replace(/\bDM on WhatsApp for payment\b/gi, "Contact on WhatsApp")
    .replace(/\bWhatsApp for payment details\b/gi, "WhatsApp")
    .replace(/\bWhatsApp for payment\b/gi, "WhatsApp")
    .replace(/\bpayment details\b/gi, "details")
    .replace(/\bfor payment\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function readingMinutes(html: string) {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function articleCategory(article: { categories: string[] }) {
  const name = article.categories.find((item) => item && item.toLowerCase() !== "uncategorized");
  return name || "Guidance";
}

export function formatArticleDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function stripHtml(html: string) {
  return cleanPlainText(html);
}
