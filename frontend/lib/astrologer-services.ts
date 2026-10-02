export const ASTROLOGER_SERVICES = [
  { title: "Kundli", hint: "Birth-chart reading" },
  { title: "Prashna", hint: "Question-based predictions" },
  { title: "Matchmaking", hint: "Guna milan" },
  { title: "Family guidance", hint: "Finance, career & marriage" },
  { title: "Remedies", hint: "Planetary doshas & obstacles" },
  { title: "Consultation", hint: "Video consulting" },
] as const;

export const ASTROLOGER_SERVICE_POINTS = ASTROLOGER_SERVICES.map(
  (item) => `${item.title} (${item.hint})`,
);
