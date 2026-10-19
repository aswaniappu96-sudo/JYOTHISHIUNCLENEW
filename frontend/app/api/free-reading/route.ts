import { NextResponse } from "next/server";
import {
  buildLocalReading,
  mergeReading,
  type FreeReading,
  type FreeReadingFacts,
  type FreeReadingKind,
} from "@/lib/freeReadings";
import { stripPublicPrices } from "@/lib/html";

const KINDS: FreeReadingKind[] = ["kundli", "match", "rashi", "nakshatra", "numerology", "tarot"];

function asKind(value: unknown): FreeReadingKind | null {
  return typeof value === "string" && KINDS.includes(value as FreeReadingKind) ? (value as FreeReadingKind) : null;
}

function cleanFacts(input: unknown): FreeReadingFacts {
  if (!input || typeof input !== "object") return {};
  const facts: FreeReadingFacts = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (typeof value === "string") facts[key] = value.slice(0, 800);
    else if (typeof value === "number" && Number.isFinite(value)) facts[key] = value;
  }
  return facts;
}

function sanitizeReading(reading: Partial<FreeReading>): Partial<FreeReading> {
  const next: Partial<FreeReading> = {};
  for (const [key, value] of Object.entries(reading)) {
    if (typeof value !== "string" || !value.trim()) continue;
    (next as Record<string, string>)[key] = stripPublicPrices(value).replace(/\s+/g, " ").trim().slice(0, 900);
  }
  return next;
}

function schemaFor(kind: FreeReadingKind) {
  if (kind === "tarot") return "overview, past, present, future, guidance, caution, note";
  return "overview, personality, strengths, career, relationships, note";
}

async function askGemini(kind: FreeReadingKind, facts: FreeReadingFacts, locale: string): Promise<Partial<FreeReading> | null> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) return null;
  const prompt = [
    "You are a JyothishiUncle Vedic astrologer writing a free, general reading for a public Indian astrology website.",
    "Tone: warm, practical, pan-Indian. No prices, no rupee rates, no medical/legal/financial guarantees.",
    "Do not use Oman or Kerala as a site theme. Do not invent years of experience or client counts.",
    `Write in locale "${locale}". If unsure, use clear English.`,
    `Return JSON only with keys: ${schemaFor(kind)}. Each value 2-4 short sentences.`,
    kind === "tarot"
      ? "This is a three-card spread. Keep card1 as Past, card2 as Present, card3 as Future. If a partner name is given, speak to both people. Address breakup, contact, or another-relation notes if the user wrote them. End with a gentle invitation to call the JyothishiUncle team for a detailed reading."
      : "Use the birth-chart facts (moon sign, nakshatra, tithi, names, place). This is an outline, not a full kundli.",
    `Kind: ${kind}`,
    `Facts: ${JSON.stringify(facts)}`,
  ].join("\n");

  const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 700,
              responseMimeType: "application/json",
            },
          }),
        },
      );
      if (!response.ok) continue;
      const data = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;
      const parsed = JSON.parse(text) as Partial<FreeReading>;
      if (parsed && typeof parsed.overview === "string") return sanitizeReading(parsed);
    } catch {
      /* try next model */
    }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { kind?: unknown; facts?: unknown; locale?: unknown };
    const kind = asKind(body.kind);
    if (!kind) return NextResponse.json({ ok: false, message: "Unknown reading." }, { status: 400 });
    const facts = cleanFacts(body.facts);
    const locale = typeof body.locale === "string" ? body.locale.slice(0, 8) : "en";
    const local = buildLocalReading(kind, facts);
    const ai = await askGemini(kind, { ...facts, localCard: local.card }, locale);
    const reading = mergeReading(local, ai);
    return NextResponse.json({ ok: true, source: ai ? "ai" : "local", reading });
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to prepare reading." }, { status: 400 });
  }
}
