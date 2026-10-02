export const RASHIS = [
  { slug: "medam", sa: "Mesha", en: "Aries" },
  { slug: "edavam", sa: "Vrishabha", en: "Taurus" },
  { slug: "midhunam", sa: "Mithuna", en: "Gemini" },
  { slug: "karkidakam", sa: "Karka", en: "Cancer" },
  { slug: "chingam", sa: "Simha", en: "Leo" },
  { slug: "kanni", sa: "Kanya", en: "Virgo" },
  { slug: "thulam", sa: "Tula", en: "Libra" },
  { slug: "vrischikam", sa: "Vrischika", en: "Scorpio" },
  { slug: "dhanu", sa: "Dhanu", en: "Sagittarius" },
  { slug: "makaram", sa: "Makara", en: "Capricorn" },
  { slug: "kumbham", sa: "Kumbha", en: "Aquarius" },
  { slug: "meenam", sa: "Meena", en: "Pisces" },
] as const;

export const JOURNEY_CREAM = "#FFF8E7";
export const JOURNEY_LAVENDER = "#F5F0FF";
export const JOURNEY_GOLD = "#FFF4D6";

function hexToRgb(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function mixHex(a: string, b: string, t: number) {
  const from = hexToRgb(a);
  const to = hexToRgb(b);
  const p = Math.min(1, Math.max(0, t));
  const r = Math.round(from.r + (to.r - from.r) * p);
  const g = Math.round(from.g + (to.g - from.g) * p);
  const bch = Math.round(from.b + (to.b - from.b) * p);
  return `rgb(${r}, ${g}, ${bch})`;
}

export function journeyCanvas(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  if (p < 0.5) return mixHex(JOURNEY_CREAM, JOURNEY_LAVENDER, p / 0.5);
  return mixHex(JOURNEY_LAVENDER, JOURNEY_GOLD, (p - 0.5) / 0.5);
}
