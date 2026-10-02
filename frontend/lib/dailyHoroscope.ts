import { RASHIS } from "@/lib/rashis";

const NOTES: Record<string, string[]> = {
  medam: [
    "A clear talk today can settle a delay. Keep the first step small and honest.",
    "Energy is forward. Do not rush a family decision; name what you need first.",
  ],
  edavam: [
    "Steady work brings ease. Guard your rest and do not take on extra worry.",
    "A household matter needs patience. One kind message is enough for today.",
  ],
  midhunam: [
    "Words carry weight. Ask one precise question before you agree to anything.",
    "A sibling or colleague can help if you share the full picture, not half.",
  ],
  karkidakam: [
    "Home and care come first. Protect your peace before you advise others.",
    "Listen more than you speak. A quiet evening will restore your chart today.",
  ],
  chingam: [
    "Lead with dignity, not heat. Praise someone who has stood by you.",
    "Your name is seen. Use the attention for a duty, not a display.",
  ],
  kanni: [
    "Details matter. Check papers, timings, and health notes before you travel.",
    "Order in the day brings calm. Finish one pending task completely.",
  ],
  thulam: [
    "Balance a relationship with fairness. Meet in the middle, then rest.",
    "A matching or partnership talk goes better if both sides speak plainly.",
  ],
  vrischikam: [
    "Do not hold a secret that is eating you. Share it with a trusted guide.",
    "Intensity is high. Channel it into prayer or work, not an argument.",
  ],
  dhanu: [
    "A teacher or longer journey is favoured. Keep faith, keep the plan simple.",
    "Speak truth kindly. Overselling a hope will confuse the house.",
  ],
  makaram: [
    "Duty first. A slow, correct step will outrun a hurried one.",
    "Elders and office matters need respect. Document what you agree.",
  ],
  kumbham: [
    "A new circle or idea is opening. Stay grounded in daily practice.",
    "Help a friend without draining yourself. Your own chart still needs care.",
  ],
  meenam: [
    "Dreams are loud. Write them, then act on only one practical item.",
    "Compassion is your strength. Do not absorb every sorrow around you.",
  ],
};

function dayIndex(at: Date) {
  const start = Date.UTC(at.getUTCFullYear(), 0, 0);
  return Math.floor((at.getTime() - start) / 86400000);
}

function pick(lines: string[] | undefined, at: Date, slug: string, extra = 0) {
  const list = lines && lines.length ? lines : ["Keep the day simple and honest."];
  return list[(dayIndex(at) + slug.length + extra) % list.length];
}

export function dailyHoroscopeNote(slug: string, at = new Date()) {
  return pick(NOTES[slug] ?? NOTES.medam, at, slug);
}

const LOVE: Record<string, string[]> = {
  medam: ["Say the need plainly. Warmth follows honesty, not speed.", "Do not push a decision. One clear talk is enough."],
  edavam: ["Stay close to home bonds. A small kindness lands better than a grand plan.", "Patience with a partner keeps the evening light."],
  midhunam: ["Ask before you assume. A precise question heals more than a long speech.", "Share the full picture with the one who matters."],
  karkidakam: ["Care for the house first. Love grows when you feel safe.", "Listen longer than you reply."],
  chingam: ["Praise without display. Loyalty is the gift today.", "Lead the heart with dignity, not heat."],
  kanni: ["Show care in the details — a message, a timing, a kept promise.", "Order in the day steadies the bond."],
  thulam: ["Meet in the middle. Fairness is more attractive than winning.", "A matching talk needs both voices, not one."],
  vrischikam: ["Trust a little. Holding a secret too tight strains the room.", "Intensity belongs in prayer, not in a quarrel."],
  dhanu: ["Speak hope kindly. Do not oversell a future.", "A shared faith or journey brings you closer."],
  makaram: ["Duty shared is love shown. Keep the promise you already made.", "Elders’ blessing eases a family knot."],
  kumbham: ["Give space. Friendship first, then the rest.", "A new circle is fine if you stay grounded."],
  meenam: ["Compassion without absorbing every sorrow. Keep one boundary.", "Write the feeling, then choose one kind act."],
};

const CAREER: Record<string, string[]> = {
  medam: ["Start the first step. Waiting costs more than a small error.", "Name the delay and move one file forward."],
  edavam: ["Steady work wins. Do not stack extra worry on the desk.", "Finish the known task before a new one."],
  midhunam: ["Words in a meeting carry weight. Be exact.", "A colleague helps if you brief them fully."],
  karkidakam: ["Protect your pace. Advise others after you are clear.", "A quiet block of work restores the chart."],
  chingam: ["Use attention for a duty, not a show.", "Lead, then credit the team."],
  kanni: ["Check papers and timings once more. Precision is luck today.", "Close one pending task completely."],
  thulam: ["Partnership talks go better if both sides speak plainly.", "Balance the load; do not carry it alone."],
  vrischikam: ["Channel heat into the work, not the argument.", "A hidden issue wants daylight — share it with a guide."],
  dhanu: ["A teacher, mentor, or longer plan is favoured. Keep it simple.", "Truth kindly told avoids confusion later."],
  makaram: ["A slow correct step outruns a hurried one.", "Document what you agree with seniors."],
  kumbham: ["A new idea is opening. Test it against daily practice.", "Help a peer without emptying your own hour."],
  meenam: ["Dreams are loud; act on one practical item only.", "Finish the small deliverable before the vision talk."],
};

const HEALTH: Record<string, string[]> = {
  medam: ["Do not rush the body. Warm food and an early pause help.", "A short walk cools the mind."],
  edavam: ["Guard rest. Extra worry sits in the neck and sleep.", "Eat simply; skip the extra round of talk."],
  midhunam: ["Too many words tire the nerves. One screen-off hour helps.", "Breathe before you answer."],
  karkidakam: ["The stomach follows the mood. Eat warm, sleep on time.", "Protect peace before you care for everyone else."],
  chingam: ["Heart and pride both need rest. Ease the heat.", "Do not skip water and a real meal."],
  kanni: ["Details of health notes matter. Take the dose on time.", "Order in the day calms the gut."],
  thulam: ["Balance effort and rest. The back and kidneys like routine.", "A fair pace is healthier than a late sprint."],
  vrischikam: ["Intensity is high. Prayer, work, or a walk — not a fight.", "Keep the night clean of arguments."],
  dhanu: ["Hips and thighs ask for stretch. Keep faith, keep the plan light.", "Travel only if rest is packed in."],
  makaram: ["Joints and duty. Warm oil or a slow stretch before work.", "Do not skip the meal for a meeting."],
  kumbham: ["Circulation and nerves. Stay warm and regular.", "Help others, then sit with your own breath."],
  meenam: ["Sleep and feet. Write the dream, then rest the eyes.", "Do not absorb every sorrow in the room."],
};

export function dailyRashiReading(slug: string, at = new Date()) {
  return {
    overview: dailyHoroscopeNote(slug, at),
    love: pick(LOVE[slug], at, slug, 1),
    career: pick(CAREER[slug], at, slug, 2),
    health: pick(HEALTH[slug], at, slug, 3),
  };
}

export const HOROSCOPE_RASHIS = RASHIS;
