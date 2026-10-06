import { RASHIS } from "@/lib/rashis";

const COLORS = [
  "Red",
  "White",
  "Green",
  "Silver",
  "Gold",
  "Navy",
  "Pink",
  "Maroon",
  "Yellow",
  "Blue",
  "Violet",
  "Sea green",
];

const ELEMENTS: Record<string, "fire" | "earth" | "air" | "water"> = {
  medam: "fire",
  chingam: "fire",
  dhanu: "fire",
  edavam: "earth",
  kanni: "earth",
  makaram: "earth",
  midhunam: "air",
  thulam: "air",
  kumbham: "air",
  karkidakam: "water",
  vrischikam: "water",
  meenam: "water",
};

function daySeed(slug: string, at = new Date()) {
  const start = Date.UTC(at.getUTCFullYear(), 0, 0);
  return Math.floor((at.getTime() - start) / 86400000) + slug.length * 7;
}

export function luckyForRashi(slug: string, at = new Date()) {
  const seed = daySeed(slug, at);
  return {
    color: COLORS[seed % COLORS.length],
    number: (seed % 9) + 1,
  };
}

export function matchNote(a: string, b: string) {
  if (a === b) {
    return { score: 8, line: "Same rashi. Comfort is high; still confirm with a full matching before a decision." };
  }
  const ea = ELEMENTS[a];
  const eb = ELEMENTS[b];
  if (ea && eb && ea === eb) {
    return { score: 7, line: "Same element. A steady pair for daily life — a full matching still explains doshas." };
  }
  const complement =
    (ea === "fire" && eb === "air") ||
    (ea === "air" && eb === "fire") ||
    (ea === "earth" && eb === "water") ||
    (ea === "water" && eb === "earth");
  if (complement) {
    return { score: 6, line: "Supportive elements. Talk openly; book matchmaking for a full guna reading." };
  }
  return { score: 5, line: "Mixed elements. Not a no — a video matching session will show the real picture." };
}

export function rashiBySlug(slug: string) {
  return RASHIS.find((item) => item.slug === slug) || RASHIS[0];
}

function reduceNumber(value: number) {
  let n = value;
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

export function lifePathNumber(isoDate: string) {
  const digits = isoDate.replace(/\D/g, "");
  if (!digits) return 0;
  return reduceNumber([...digits].reduce((sum, digit) => sum + Number(digit), 0));
}

const NAME_MAP: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

export function nameNumber(name: string) {
  const total = name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .reduce((sum, letter) => sum + (NAME_MAP[letter] || 0), 0);
  return total ? reduceNumber(total) : 0;
}
