/** Strip Oman / Muscat from public website copy. Keep IANA timezone ids intact. */

const IANA_TZ = /^(Africa|America|Antarctica|Asia|Atlantic|Australia|Europe|Indian|Pacific)\//;

export function stripOmanHighlight(text: string): string {
  if (!text || IANA_TZ.test(text)) return text;

  return text
    .replace(/\bDo I need to visit Oman\b/gi, "Do I need to visit in person")
    .replace(/\btravelling from Oman\b/gi, "travelling worldwide")
    .replace(/\bfamilies in Oman and abroad\b/gi, "families worldwide")
    .replace(/\bbased in Muscat,?\s*(the )?Sultanate of Oman\b/gi, "available worldwide")
    .replace(/\bbased in Muscat,?\s*Oman\b/gi, "available worldwide")
    .replace(/\bbased in Oman\b/gi, "available worldwide")
    .replace(/\bteam is in Oman\b/gi, "team works online")
    .replace(/\bcoordinated from Oman\b/gi, "coordinated online")
    .replace(/\bfrom Oman via\b/gi, "online via")
    .replace(/\bfrom Oman,?\s*worldwide\b/gi, "worldwide")
    .replace(/\bonline from Oman\b/gi, "online")
    .replace(/\bsessions from Oman\b/gi, "sessions")
    .replace(/\bguidance from Oman\b/gi, "guidance")
    .replace(/\bspiritual services from Oman\b/gi, "spiritual services worldwide")
    .replace(/\bservices from Oman\b/gi, "services worldwide")
    .replace(/\bfrom Oman\b/gi, "")
    .replace(/\bOman time\b/gi, "your local time")
    .replace(/\bTimes (below )?are Oman time\.?\s*/gi, "")
    .replace(/\bMuscat,?\s*(Sultanate of )?Oman\.?\s*/gi, "")
    .replace(/\bSultanate of Oman\b/gi, "")
    .replace(/,\s*Muscat\b/gi, "")
    .replace(/\bMuscat\b/gi, "")
    .replace(/\bOman\b/gi, "")
    .replace(/\bTraditional astrologers from Keralam\b/gi, "Traditional astrologers")
    .replace(/\bfrom a family of Traditional Astrologers from Keralam\b/gi, "from a family of Traditional Astrologers")
    .replace(/\bfrom Keralam\b/gi, "")
    .replace(/\bKerala jyothisha\b/gi, "Vedic jyothisha")
    .replace(/\bKerala Jyothisha\b/gi, "Vedic Jyothisha")
    .replace(/\bHereditary Kerala\b/gi, "Hereditary Vedic")
    .replace(/\bTraditional Kerala\b/gi, "Traditional Vedic")
    .replace(/\bmasters of Kerala\b/gi, "masters")
    .replace(/\bsanctums of Kerala,?\s*/gi, "sacred sanctums, ")
    .replace(/\bKerala Tantra\b/gi, "Vedic Tantra")
    .replace(/\bKerala Guruvayur\b/gi, "Guruvayur")
    .replace(/\bKerala & Himalaya\b/gi, "Bharat & Himalaya")
    .replace(/\bKERALA THALIOLA\b/g, "VEDIC THALIOLA")
    .replace(/,\s*Kerala,?\s*India\b/gi, ", India")
    .replace(/,\s*Kerala\b/gi, "")
    .replace(/\bKeralam\b/gi, "")
    .replace(/\bKerala\b/gi, "")
    .replace(/\bonline\s*[—–-]\s*WhatsApp video,?\s*Google Meet,?\s*(or\s+)?Zoom\b/gi, "online through video consulting")
    .replace(/\bvia WhatsApp video,?\s*Google Meet,?\s*(or\s+)?Zoom\b/gi, "through video consulting")
    .replace(/\bvia WhatsApp,?\s*Google Meet,?\s*(or\s+)?Zoom\b/gi, "through video consulting")
    .replace(/\bWhatsApp video,?\s*Google Meet,?\s*(or\s+)?Zoom\b/gi, "video consulting")
    .replace(/\bGoogle Meet,?\s*(or\s+)?Zoom,?\s*(or\s+)?Microsoft Teams\b/gi, "video consulting")
    .replace(/\bWhatsApp video\b/gi, "video consulting")
    .replace(/\bGoogle Meet\b/gi, "video consulting")
    .replace(/\bMicrosoft Teams\b/gi, "video consulting")
    .replace(/\bZoom video\b/gi, "video consulting")
    .replace(/(?:video consulting(?:\s*[,/]|,\s*or|\s+or\s+))+video consulting/gi, "video consulting")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\.\s*\./g, ".")
    .replace(/^[\s,·–-]+/, "")
    .replace(/[\s,·]+$/, "")
    .trim();
}

export function stripOmanDeep<T>(value: T): T {
  if (typeof value === "string") return stripOmanHighlight(value) as T;
  if (Array.isArray(value)) return value.map((item) => stripOmanDeep(item)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      out[key] = stripOmanDeep(nested);
    }
    return out as T;
  }
  return value;
}
