export const RASHIS = [
  { slug: "chingam", mal: "ചിങ്ങം", name: "Chingam", en: "Leo" },
  { slug: "kanni", mal: "കന്നി", name: "Kanni", en: "Virgo" },
  { slug: "thulam", mal: "തുലാം", name: "Thulam", en: "Libra" },
  { slug: "vrischikam", mal: "വൃശ്ചികം", name: "Vrischikam", en: "Scorpio" },
  { slug: "dhanu", mal: "ധനു", name: "Dhanu", en: "Sagittarius" },
  { slug: "makaram", mal: "മകരം", name: "Makaram", en: "Capricorn" },
  { slug: "kumbham", mal: "കുംഭം", name: "Kumbham", en: "Aquarius" },
  { slug: "meenam", mal: "മീനം", name: "Meenam", en: "Pisces" },
  { slug: "medam", mal: "മേടം", name: "Medam", en: "Aries" },
  { slug: "edavam", mal: "ഇടവം", name: "Edavam", en: "Taurus" },
  { slug: "midhunam", mal: "മിഥുനം", name: "Midhunam", en: "Gemini" },
  { slug: "karkidakam", mal: "കർക്കടകം", name: "Karkidakam", en: "Cancer" },
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
