import type { Locale } from "@/lib/i18n";
import { RASHIS } from "@/lib/rashis";

const NATIVE: Record<Exclude<Locale, "en">, Record<string, string>> = {
  hi: {
    medam: "मेष",
    edavam: "वृषभ",
    midhunam: "मिथुन",
    karkidakam: "कर्क",
    chingam: "सिंह",
    kanni: "कन्या",
    thulam: "तुला",
    vrischikam: "वृश्चिक",
    dhanu: "धनु",
    makaram: "मकर",
    kumbham: "कुम्भ",
    meenam: "मीन",
  },
  ta: {
    medam: "மேஷம்",
    edavam: "ரிஷபம்",
    midhunam: "மிதுனம்",
    karkidakam: "கடகம்",
    chingam: "சிம்மம்",
    kanni: "கன்னி",
    thulam: "துலாம்",
    vrischikam: "விருச்சிகம்",
    dhanu: "தனுசு",
    makaram: "மகரம்",
    kumbham: "கும்பம்",
    meenam: "மீனம்",
  },
  ml: {
    medam: "മേടം",
    edavam: "ഇടവം",
    midhunam: "മിഥുനം",
    karkidakam: "കർക്കടകം",
    chingam: "ചിങ്ങം",
    kanni: "കന്നി",
    thulam: "തുലാം",
    vrischikam: "വൃശ്ചികം",
    dhanu: "ധനു",
    makaram: "മകരം",
    kumbham: "കുംഭം",
    meenam: "മീനം",
  },
  kn: {
    medam: "ಮೇಷ",
    edavam: "ವೃಷಭ",
    midhunam: "ಮಿಥುನ",
    karkidakam: "ಕರ್ಕ",
    chingam: "ಸಿಂಹ",
    kanni: "ಕನ್ಯಾ",
    thulam: "ತುಲಾ",
    vrischikam: "ವೃಶ್ಚಿಕ",
    dhanu: "ಧನು",
    makaram: "ಮಕರ",
    kumbham: "ಕುಂಭ",
    meenam: "ಮೀನ",
  },
  te: {
    medam: "మేషం",
    edavam: "వృషభం",
    midhunam: "మిథునం",
    karkidakam: "కర్కాటకం",
    chingam: "సింహం",
    kanni: "కన్య",
    thulam: "తుల",
    vrischikam: "వృశ్చికం",
    dhanu: "ధనుస్సు",
    makaram: "మకరం",
    kumbham: "కుంభం",
    meenam: "మీనం",
  },
};

const COLORS: Record<Locale, Record<string, string>> = {
  en: {},
  hi: {
    Red: "लाल",
    White: "सफेद",
    Green: "हरा",
    Silver: "चाँदी",
    Gold: "सोना",
    Navy: "गहरा नीला",
    Pink: "गुलाबी",
    Maroon: "गहरा लाल",
    Yellow: "पीला",
    Blue: "नीला",
    Violet: "बैंगनी",
    "Sea green": "समुद्री हरा",
  },
  ta: {
    Red: "சிவப்பு",
    White: "வெள்ளை",
    Green: "பச்சை",
    Silver: "வெள்ளி",
    Gold: "தங்கம்",
    Navy: "கடும் நீலம்",
    Pink: "இளஞ்சிவப்பு",
    Maroon: "அடர் சிவப்பு",
    Yellow: "மஞ்சள்",
    Blue: "நீலம்",
    Violet: "ஊதா",
    "Sea green": "கடல் பச்சை",
  },
  ml: {
    Red: "ചുവപ്പ്",
    White: "വെള്ള",
    Green: "പച്ച",
    Silver: "വെള്ളി",
    Gold: "സ്വർണം",
    Navy: "കടും നീല",
    Pink: "പിങ്ക്",
    Maroon: "കടും ചുവപ്പ്",
    Yellow: "മഞ്ഞ",
    Blue: "നീല",
    Violet: "ഊദ",
    "Sea green": "കടൽ പച്ച",
  },
  kn: {
    Red: "ಕೆಂಪು",
    White: "ಬಿಳಿ",
    Green: "ಹಸಿರು",
    Silver: "ಬೆಳ್ಳಿ",
    Gold: "ಚಿನ್ನ",
    Navy: "ಗಾಢ ನೀಲಿ",
    Pink: "ಗುಲಾಬಿ",
    Maroon: "ಗಾಢ ಕೆಂಪು",
    Yellow: "ಹಳದಿ",
    Blue: "ನೀಲಿ",
    Violet: "ನೇರಳೆ",
    "Sea green": "ಸಮುದ್ರ ಹಸಿರು",
  },
  te: {
    Red: "ఎరుపు",
    White: "తెలుపు",
    Green: "ఆకుపచ్చ",
    Silver: "వెండి",
    Gold: "బంగారం",
    Navy: "ముదురు నీలం",
    Pink: "గులాబి",
    Maroon: "ముదురు ఎరుపు",
    Yellow: "పసుపు",
    Blue: "నీలం",
    Violet: "ఊదా",
    "Sea green": "సముద్రపు ఆకుపచ్చ",
  },
};

const YOUR_DAY: Record<Locale, string> = {
  en: "Your day",
  hi: "आपका दिन",
  ta: "உங்கள் நாள்",
  ml: "നിങ്ങളുടെ ദിവസം",
  kn: "ನಿಮ್ಮ ದಿನ",
  te: "మీ రోజు",
};

const PAKSHA: Record<Locale, Record<string, string>> = {
  en: {},
  hi: { "Shukla Paksha": "शुक्ल पक्ष", "Krishna Paksha": "कृष्ण पक्ष" },
  ta: { "Shukla Paksha": "சுக்ல பட்சம்", "Krishna Paksha": "கிருஷ்ண பட்சம்" },
  ml: { "Shukla Paksha": "ശുക്ലപക്ഷം", "Krishna Paksha": "കൃഷ്ണപക്ഷം" },
  kn: { "Shukla Paksha": "ಶುಕ್ಲ ಪಕ್ಷ", "Krishna Paksha": "ಕೃಷ್ಣ ಪಕ್ಷ" },
  te: { "Shukla Paksha": "శుక్ల పక్షం", "Krishna Paksha": "కృష్ణ పక్షం" },
};

export function rashiNames(slug: string, locale: Locale) {
  const row = RASHIS.find((item) => item.slug === slug) || RASHIS[0];
  if (locale === "en") return { primary: row.sa, secondary: row.en };
  return { primary: NATIVE[locale][row.slug] || row.sa, secondary: "" };
}

export function rashiLine(slug: string, locale: Locale) {
  const { primary, secondary } = rashiNames(slug, locale);
  return secondary ? `${primary} · ${secondary}` : primary;
}

export function colorLabel(color: string, locale: Locale) {
  return COLORS[locale][color] || color;
}

export function yourDayLabel(locale: Locale) {
  return YOUR_DAY[locale] || YOUR_DAY.en;
}

export function localPaksha(label: string, locale: Locale) {
  return PAKSHA[locale][label] || label;
}
