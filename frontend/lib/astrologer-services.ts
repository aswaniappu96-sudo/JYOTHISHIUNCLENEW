export const ASTROLOGER_SERVICES = [
  { title: "Jathakam", hint: "Horoscope analysis" },
  { title: "Prasnam", hint: "Astrological predictions" },
  { title: "Porutham", hint: "Horoscope matching" },
  { title: "Ashtamangala Prasnam", hint: "Thamboola & ashtamangala" },
  { title: "Family guidance", hint: "Finance, career & marriage" },
  { title: "Parihara remedies", hint: "Planetary doshas & obstacles" },
] as const;

export const ASTROLOGER_SERVICE_POINTS = ASTROLOGER_SERVICES.map(
  (item) => `${item.title} (${item.hint})`,
);
