import { dailyRashiReading } from "@/lib/dailyHoroscope";
import { matchNote } from "@/lib/freeAstrology";
import { RASHIS } from "@/lib/rashis";

export type FreeReadingKind = "kundli" | "match" | "rashi" | "nakshatra" | "numerology" | "tarot";

export type FreeReading = {
  card?: string;
  cards?: string[];
  past?: string;
  present?: string;
  future?: string;
  overview: string;
  personality?: string;
  strengths?: string;
  career?: string;
  relationships?: string;
  guidance?: string;
  caution?: string;
  note?: string;
};

export type FreeReadingFacts = Record<string, string | number | undefined | null>;

const GENERAL_NOTE =
  "This is a general astrological interpretation from your birth-chart outline. It is not a full kundli, and it is not medical, legal, or financial advice. A JyothishiUncle astrologer can read the complete chart on a call, chat, or video.";

const TAROT_NOTE =
  "This free tarot draw is a reflective prompt, not a prediction or a substitute for a personal reading. For a detailed session, call the JyothishiUncle team.";

const RASHI_PERSONALITY: Record<string, { personality: string; strengths: string; career: string; relationships: string }> = {
  medam: {
    personality: "Moon in Mesha (Aries) gives a direct, pioneering nature. You prefer to start things yourself and dislike waiting for permission.",
    strengths: "Courage, initiative, and the will to take the first step when others hesitate.",
    career: "Work that needs a leader, a starter, or a clear decision suits you. Name the delay and move one file forward rather than stacking plans.",
    relationships: "You love honestly and quickly. Say the need plainly; warmth follows truth more than speed.",
  },
  edavam: {
    personality: "Moon in Vrishabha (Taurus) steadies the mind. You build slowly, keep what you value, and need peace in the home.",
    strengths: "Patience, loyalty, and a gift for making daily life beautiful and reliable.",
    career: "Steady skill and finished work win more than sudden leaps. Guard rest so worry does not sit on the desk.",
    relationships: "You show love through care and consistency. A small kindness lands better than a grand promise.",
  },
  midhunam: {
    personality: "Moon in Mithuna (Gemini) keeps the mind curious and social. You learn by talking, writing, and asking the next question.",
    strengths: "Wit, adaptability, and the ability to connect two people or two ideas.",
    career: "Words in a meeting carry weight. Brief others fully; a precise question is more useful than a long speech.",
    relationships: "Ask before you assume. Sharing the full picture with the one who matters heals more than half-news.",
  },
  karkidakam: {
    personality: "Moon in Karka (Cancer) feels the room before it speaks. Home, memory, and care shape your choices.",
    strengths: "Empathy, protection of family, and a quiet intelligence about people’s moods.",
    career: "Protect your pace. Advise others after you are clear; a calm block of work restores the chart.",
    relationships: "Love grows when you feel safe. Listen longer than you reply, and keep the house peaceful.",
  },
  chingam: {
    personality: "Moon in Simha (Leo) wants dignity and a sincere stage. You give generously when you are respected.",
    strengths: "Warmth, loyalty, and the courage to stand for your name without becoming harsh.",
    career: "Use attention for a duty, not a display. Lead, then credit the team.",
    relationships: "Praise without show. Loyalty is the gift; heat is not.",
  },
  kanni: {
    personality: "Moon in Kanya (Virgo) notices the detail others skip. You serve through order, skill, and useful help.",
    strengths: "Discernment, craft, and the patience to finish what was started correctly.",
    career: "Check papers, timings, and health notes. Closing one pending task completely is luck enough.",
    relationships: "Show care in the kept promise, the message, the timing — not in a speech.",
  },
  thulam: {
    personality: "Moon in Tula (Libra) seeks fairness and beauty in company. You weigh both sides before you rest.",
    strengths: "Diplomacy, taste, and the gift of bringing two people to the middle.",
    career: "Partnership talks go better if both sides speak plainly. Do not carry the whole load alone.",
    relationships: "Meet in the middle. Fairness is more attractive than winning the argument.",
  },
  vrischikam: {
    personality: "Moon in Vrischika (Scorpio) feels deeply and remembers. You prefer truth, even when it is intense.",
    strengths: "Focus, loyalty, and the power to transform a stuck situation once it is named.",
    career: "Channel heat into the work, not the quarrel. A hidden issue wants daylight with a trusted guide.",
    relationships: "Trust a little. Holding a secret too tight strains the room; intensity belongs in prayer, not a fight.",
  },
  dhanu: {
    personality: "Moon in Dhanu (Sagittarius) looks for meaning, travel, and an honest teacher. Faith steadies you.",
    strengths: "Hope, candour, and the will to take a longer path without losing humour.",
    career: "A mentor or a longer plan is favoured. Keep it simple; truth kindly told avoids confusion later.",
    relationships: "Speak hope without overselling a future. A shared faith or journey brings you closer.",
  },
  makaram: {
    personality: "Moon in Makara (Capricorn) respects duty, time, and elders. You climb slowly and keep the promise.",
    strengths: "Discipline, endurance, and quiet authority that does not need noise.",
    career: "A slow correct step outruns a hurried one. Document what you agree with seniors.",
    relationships: "Duty shared is love shown. Keep the promise you already made; an elder’s blessing eases a family knot.",
  },
  kumbham: {
    personality: "Moon in Kumbha (Aquarius) thinks of the circle, the idea, and the future. You need space to stay kind.",
    strengths: "Originality, friendship, and the courage to help without becoming a crowd.",
    career: "A new idea is opening. Test it against daily practice; help a peer without emptying your own hour.",
    relationships: "Give space. Friendship first, then the rest. Stay grounded if a new circle appears.",
  },
  meenam: {
    personality: "Moon in Meena (Pisces) dreams loudly and feels other people’s weather. Compassion is your native tongue.",
    strengths: "Imagination, devotion, and a soft intelligence that sees what is unspoken.",
    career: "Dreams are useful after one practical item is done. Finish the small deliverable before the vision talk.",
    relationships: "Compassion without absorbing every sorrow. Keep one boundary, then choose one kind act.",
  },
};

const NAK_FLAVOR: Record<string, string> = {
  Ashwini: "Ashwini adds healing speed — you recover and help others recover.",
  Bharani: "Bharani asks you to carry responsibility without becoming heavy.",
  Krittika: "Krittika sharpens the will; cut what is leftover, keep what is true.",
  Rohini: "Rohini blesses growth, beauty, and the wish to build a full home.",
  Mrigashira: "Mrigashira keeps you searching — ask, then rest, then ask again.",
  Ardra: "Ardra brings a storm that clears the air if you tell the truth.",
  Punarvasu: "Punarvasu returns what was lost; second chances are in the chart.",
  Pushya: "Pushya nourishes. Care for the body and the people who eat at your table.",
  Ashlesha: "Ashlesha sees under the surface. Use insight to protect, not to control.",
  Magha: "Magha remembers ancestors. Honour the line, then choose your own seat.",
  "Purva Phalguni": "Purva Phalguni loves rest, art, and a generous bond.",
  "Uttara Phalguni": "Uttara Phalguni favours contracts, marriage talks, and kept word.",
  Hasta: "Hasta gives skilled hands — craft, writing, and careful work.",
  Chitra: "Chitra wants a beautiful form. Design the life, do not only dream it.",
  Swati: "Swati needs air and independence. Move, then return of your own will.",
  Vishakha: "Vishakha aims at a goal. Finish one aim before opening two more.",
  Anuradha: "Anuradha finds friends and devotion in unlikely rooms.",
  Jyeshtha: "Jyeshtha carries elder energy. Lead the younger ones with fairness.",
  Mula: "Mula uproots what is false so a truer root can grow.",
  "Purva Ashadha": "Purva Ashadha gives invincible hope if you stay humble.",
  "Uttara Ashadha": "Uttara Ashadha wins through endurance, not display.",
  Shravana: "Shravana learns by listening. Hear the story twice before you advise.",
  Dhanishta: "Dhanishta brings rhythm, music, and the courage to be seen.",
  Shatabhisha: "Shatabhisha heals through solitude and unusual knowledge.",
  "Purva Bhadrapada": "Purva Bhadrapada burns old stories so a new vow can start.",
  "Uttara Bhadrapada": "Uttara Bhadrapada sits in deep waters — patience is the blessing.",
  Revati: "Revati guides travellers home. Kindness at the last mile is your dharma.",
};

const TAROT_DECK: { card: string; overview: string; guidance: string; caution: string }[] = [
  { card: "The Fool", overview: "A clean page. The next step is simpler than the story in your head.", guidance: "Say yes to a small beginning. Do not wait for a perfect map.", caution: "Do not leap without naming one boundary." },
  { card: "The Magician", overview: "You already hold the tools. Focus them on one intention.", guidance: "Write the ask in one sentence, then act the same day.", caution: "Scattered effort weakens the spell." },
  { card: "The High Priestess", overview: "The answer is arriving through intuition and timing, not through force.", guidance: "Sit quiet. Notice what repeats in dreams, messages, and delays.", caution: "Do not chase a closed door tonight." },
  { card: "The Empress", overview: "Care, body, and creation want room. Something can grow if you feed it.", guidance: "Nourish the bond or the project with daily, ordinary kindness.", caution: "Do not give until you are empty." },
  { card: "The Emperor", overview: "Structure is the blessing. A plan, a call, a rule will steady the house.", guidance: "Take the responsible seat. Book the talk instead of waiting.", caution: "Control is not the same as care." },
  { card: "The Hierophant", overview: "Tradition, a teacher, or family custom can guide this chapter.", guidance: "Ask an elder or a JyothishiUncle astrologer before a big vow.", caution: "Do not follow a crowd against your own dharma." },
  { card: "The Lovers", overview: "A heart choice is on the table. Alignment matters more than winning.", guidance: "Speak the truth of the bond. Choose the path you can live with at dawn.", caution: "A triangle of attention cannot stay hidden." },
  { card: "The Chariot", overview: "Willpower can move this. Two horses — emotion and duty — must face the same way.", guidance: "Pick a direction for 7 days and do not look sideways.", caution: "Force without rest crashes the cart." },
  { card: "Strength", overview: "Soft courage wins. The wild feeling can be held, not fought.", guidance: "Stay kind and firm. Do not answer heat with heat.", caution: "Swallowing the roar forever will make it louder later." },
  { card: "The Hermit", overview: "A lamp for your own path. Solitude is information, not punishment.", guidance: "Take a night off the chat. The next message will be clearer after rest.", caution: "Isolation is not the same as wisdom." },
  { card: "Wheel of Fortune", overview: "A turn in timing. What felt stuck can move — up or around.", guidance: "Say the prayer, then take the practical step that appears.", caution: "Do not gamble a relationship on a mood." },
  { card: "Justice", overview: "Fairness wants daylight. The true picture will not stay half-told.", guidance: "Name facts without drama. What you owe, pay; what you need, ask.", caution: "Secret keeping delays the verdict." },
  { card: "The Hanged One", overview: "Pause is the card. Seeing from the other side changes the reading.", guidance: "Wait one beat before you text, leave, or promise.", caution: "Sacrifice that no one asked for is not nobility." },
  { card: "Transformation", overview: "An ending that clears space. The old form of this story is complete.", guidance: "Let what is finished be finished. Bless it, then walk.", caution: "Clinging to the ashes keeps the burn going." },
  { card: "Temperance", overview: "Blend, do not choose a war. Two truths can sit in one cup.", guidance: "Mix patience with one honest sentence. Middle path.", caution: "People-pleasing is not balance." },
  { card: "The Star", overview: "Hope after a hard night. Healing is available if you allow it.", guidance: "Reach out once, gently. Then tend your own light.", caution: "Do not pin all faith on one reply." },
  { card: "The Moon", overview: "Fog, mixed signals, or a dream that is louder than the facts.", guidance: "Wait for daylight before a decision. Ask one clarifying question.", caution: "Fear will invent a story if you let it." },
  { card: "The Sun", overview: "Warmth, clarity, and a yes that can be seen in public.", guidance: "Celebrate a small win. Share good news with the house.", caution: "Pride should not outrun gratitude." },
  { card: "Judgement", overview: "A call to rise. An old chapter wants a honest review.", guidance: "Answer the inner call. If they contact you, respond from the adult in you.", caution: "Shame is not the same as accountability." },
  { card: "The World", overview: "A cycle completing. You can close this and begin a wider map.", guidance: "Mark the ending with a prayer or a journey. Then start the next round clean.", caution: "Do not drag an old role into the new circle." },
  { card: "Ace of Cups", overview: "A fresh feeling, offer, or opening of the heart.", guidance: "Receive without rushing to define it.", caution: "A new cup is not yet a home." },
  { card: "Two of Cups", overview: "Mutual regard. A meeting of equals is possible.", guidance: "Mirror kindness. Suggest a real conversation, not only chat.", caution: "Chemistry without respect fades." },
  { card: "Three of Swords", overview: "Heart-truth that hurts. A breakup, silence, or disappointment wants naming.", guidance: "Grieve cleanly. Do not argue with what already ended.", caution: "Checking their every move delays healing." },
  { card: "Knight of Cups", overview: "A message, visit, or romantic gesture may move.", guidance: "If they reach out, listen for consistency, not poetry alone.", caution: "Charm without follow-through is only weather." },
  { card: "Seven of Swords", overview: "Something is half-hidden — another relation, a withheld plan, or self-avoidance.", guidance: "Ask the direct question once. Watch what they do, not only what they write.", caution: "Do not become the secret-keeper of a messy triangle." },
  { card: "Four of Wands", overview: "Home, family milestone, or a reason to gather.", guidance: "Bless the house. Invite the people who actually show up.", caution: "A celebration does not fix an unspoken rift." },
  { card: "Ace of Pentacles", overview: "A practical seed — work, money talk, or a stable offer.", guidance: "Take the grounded step. Skill plus timing.", caution: "Do not skip the details of any agreement." },
  { card: "Page of Cups", overview: "A shy apology, a late text, or a tender beginning.", guidance: "Answer from softness and self-respect.", caution: "One sweet line is not a changed pattern." },
];

function asText(value: string | number | undefined | null) {
  return value == null ? "" : String(value).trim();
}

function rashiKey(name: string) {
  const lower = name.toLowerCase();
  return (
    RASHIS.find(
      (item) =>
        item.slug === lower ||
        item.sa.toLowerCase() === lower ||
        item.en.toLowerCase() === lower ||
        lower.includes(item.sa.toLowerCase()) ||
        lower.includes(item.en.toLowerCase()),
    )?.slug || "medam"
  );
}

function hashSeed(input: string) {
  let h = 2166136261;
  for (const ch of input) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Math.abs(h);
}

function tarotByName(name: string) {
  return TAROT_DECK.find((item) => item.card === name) || TAROT_DECK[0];
}

function pickTarot(facts: FreeReadingFacts, exclude: string[] = []) {
  const type = asText(facts.type).toLowerCase();
  const situation = `${asText(facts.situation)} ${asText(facts.question)}`.toLowerCase();
  const pile = asText(facts.pile) || "0";
  const seed = hashSeed(
    `${type}|${asText(facts.name)}|${asText(facts.partner)}|${situation}|${pile}|${new Date().toISOString().slice(0, 10)}`,
  );
  let pool = TAROT_DECK;
  if (type === "love" || type === "relation" || situation.includes("love") || situation.includes("partner")) {
    pool = TAROT_DECK.filter((item) => /lovers|cups|star|sun|empress/i.test(item.card));
  } else if (type === "breakup" || situation.includes("breakup") || situation.includes("broke")) {
    pool = TAROT_DECK.filter((item) => /swords|transformation|hermit|hanged|moon|justice/i.test(item.card));
  } else if (type === "contact" || situation.includes("contact") || situation.includes("text") || situation.includes("call me")) {
    pool = TAROT_DECK.filter((item) => /knight|page|star|judgement|cups/i.test(item.card));
  } else if (type === "other" || situation.includes("another") || situation.includes("affair") || situation.includes("third")) {
    pool = TAROT_DECK.filter((item) => /lovers|seven|justice|moon|hanged/i.test(item.card));
  } else if (type === "career") {
    pool = TAROT_DECK.filter((item) => /emperor|pentacles|chariot|magician|world/i.test(item.card));
  } else if (type === "family") {
    pool = TAROT_DECK.filter((item) => /hierophant|wands|empress|temperance|world/i.test(item.card));
  }
  const blocked = new Set(exclude.filter(Boolean));
  const open = (pool.length ? pool : TAROT_DECK).filter((item) => !blocked.has(item.card));
  const list = open.length ? open : TAROT_DECK;
  return list[seed % list.length];
}

export function drawTarotCard(facts: FreeReadingFacts, exclude: string[] = []) {
  return pickTarot(facts, exclude).card;
}

function named(facts: FreeReadingFacts) {
  return asText(facts.name) || "You";
}

function nakFlavor(label: string) {
  const found = Object.keys(NAK_FLAVOR).find((key) => label === key || label.startsWith(`${key} `));
  return found ? NAK_FLAVOR[found] : "";
}

export function buildLocalReading(kind: FreeReadingKind, facts: FreeReadingFacts): FreeReading {
  if (kind === "tarot") {
    const pastCard = asText(facts.card1) || pickTarot({ ...facts, pile: 1 }).card;
    const presentCard = asText(facts.card2) || pickTarot({ ...facts, pile: 2 }, [pastCard]).card;
    const futureCard = asText(facts.card3) || pickTarot({ ...facts, pile: 3 }, [pastCard, presentCard]).card;
    const past = tarotByName(pastCard);
    const present = tarotByName(presentCard);
    const future = tarotByName(futureCard);
    const who = named(facts);
    const partner = asText(facts.partner);
    const situation = asText(facts.situation);
    const typeLabel = asText(facts.typeLabel) || asText(facts.type) || "tarot";
    const subject =
      partner && who !== "You"
        ? `${who}, this ${typeLabel} for you and ${partner}`
        : partner
          ? `This ${typeLabel} for you and ${partner}`
          : who === "You"
            ? `This ${typeLabel}`
            : `${who}, this ${typeLabel}`;
    return {
      card: `${pastCard} · ${presentCard} · ${futureCard}`,
      cards: [pastCard, presentCard, futureCard],
      past: `Past — ${pastCard}. ${past.overview}`,
      present: `Present — ${presentCard}. ${present.overview}`,
      future: `Future — ${futureCard}. ${future.overview}`,
      overview: `${subject} is a three-card spread: ${pastCard}, ${presentCard}, and ${futureCard}. ${present.overview}${situation ? ` You asked about: “${situation.slice(0, 180)}”.` : ""}`,
      guidance: `${present.guidance} Looking ahead: ${future.guidance}`,
      caution: future.caution,
      note: TAROT_NOTE,
    };
  }

  if (kind === "match") {
    const a = asText(facts.rashiA) || asText(facts.boyRashi);
    const b = asText(facts.rashiB) || asText(facts.girlRashi);
    const slugA = rashiKey(a);
    const slugB = rashiKey(b);
    const match = matchNote(slugA, slugB);
    const one = asText(facts.boyName) || "Person one";
    const two = asText(facts.girlName) || "Person two";
    return {
      overview: `${one} and ${two}: a free outline score of ${match.score}/10. ${match.line}`,
      personality: `${one} (${a || RASHIS.find((r) => r.slug === slugA)?.sa}) and ${two} (${b || RASHIS.find((r) => r.slug === slugB)?.sa}) bring different moon weather. Read both charts, not only the score.`,
      strengths: "Comfort grows where daily habits and speech match. Name what each person needs at home.",
      career: "If this is a marriage talk, keep career and family duty in the same conversation — one side should not carry all the load.",
      relationships: "A full guna matching, mangal and dasha reading on video will show what this outline cannot.",
      note: GENERAL_NOTE,
    };
  }

  if (kind === "numerology") {
    const who = named(facts);
    const life = asText(facts.lifePath) || "—";
    const nameNo = asText(facts.nameNumber) || "—";
    return {
      overview: `${who}: life path ${life}, name number ${nameNo}. Numbers sketch a pattern of effort and expression — they do not replace a kundli.`,
      personality: `Life path ${life} colours how you take decisions. Name number ${nameNo} is the outer voice people hear first.`,
      strengths: "Use the number as a reminder of style, not as a cage. Your birth moon still leads the inner weather.",
      career: "Choose work that matches your pace: some numbers build slowly, some start quickly. Confirm with a chart before a leap.",
      relationships: "A partner with a complementary number can feel easy, but guna and moon matching still matter more.",
      note: GENERAL_NOTE,
    };
  }

  if (kind === "nakshatra") {
    const who = named(facts);
    const nak = asText(facts.nakshatra) || "your nakshatra";
    const flavor = nakFlavor(nak) || "This nakshatra flavours the moon with a specific lesson.";
    return {
      overview: `${who}, born under ${nak}. ${flavor}`,
      personality: `${nak} sits on the moon at birth in this outline. It describes instinct — how you rest, react, and seek comfort.`,
      strengths: "The pada (quarter) refines the picture. A full reading names the pada lord and the dasha in play.",
      career: "Work that respects this nakshatra’s tempo — fast, careful, public, or hidden — will feel less like a fight.",
      relationships: "Matching also looks at nakshatra kuta, not only rashi. Book a session for marriage or a serious bond.",
      note: GENERAL_NOTE,
    };
  }

  const moon = asText(facts.moon) || asText(facts.rashi);
  const slug = rashiKey(moon);
  const bank = RASHI_PERSONALITY[slug] || RASHI_PERSONALITY.medam;
  const daily = dailyRashiReading(slug);
  const who = named(facts);
  const nak = asText(facts.nakshatra);
  const tithi = asText(facts.tithi);
  const place = asText(facts.place);
  const when = [asText(facts.dob), asText(facts.time)].filter(Boolean).join(" · ");
  const rashiName = moon || RASHIS.find((item) => item.slug === slug)?.sa || "your moon rashi";
  const nakLine = nak ? nakFlavor(nak) : "";

  if (kind === "rashi") {
    return {
      overview: `${who}, moon rashi ${rashiName}. ${daily.overview}`,
      personality: bank.personality,
      strengths: bank.strengths,
      career: `${bank.career} Today’s career note: ${daily.career}`,
      relationships: `${bank.relationships} Today’s heart note: ${daily.love}`,
      note: GENERAL_NOTE,
    };
  }

  return {
    overview: `${who}${when ? `, born ${when}` : ""}${place ? ` in ${place}` : ""}. Moon sign ${rashiName}${nak ? `, nakshatra ${nak}` : ""}${tithi ? `, tithi ${tithi}` : ""}. ${bank.personality.split(".")[0]}. ${nakLine} ${daily.overview}`.replace(/\s+/g, " ").trim(),
    personality: bank.personality,
    strengths: bank.strengths,
    career: bank.career,
    relationships: bank.relationships,
    note: GENERAL_NOTE,
  };
}

export function mergeReading(base: FreeReading, incoming: Partial<FreeReading> | null | undefined): FreeReading {
  if (!incoming) return base;
  const next = { ...base };
  (Object.keys(incoming) as (keyof FreeReading)[]).forEach((key) => {
    const value = incoming[key];
    if (typeof value === "string" && value.trim()) next[key] = value.trim();
  });
  return next;
}

export async function enhanceReading(
  kind: FreeReadingKind,
  facts: FreeReadingFacts,
  locale = "en",
): Promise<FreeReading> {
  const local = buildLocalReading(kind, facts);
  try {
    const response = await fetch("/api/free-reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, facts, locale }),
    });
    if (!response.ok) return local;
    const data = (await response.json()) as { reading?: Partial<FreeReading> };
    return mergeReading(local, data.reading);
  } catch {
    return local;
  }
}
