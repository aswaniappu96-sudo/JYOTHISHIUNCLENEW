const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join("frontend", "lib", "i18n.ts"), "utf8");
const locales = ["en", "hi", "ta", "ml", "kn", "te"];
const messages = {};

for (const name of locales) {
  const re = new RegExp("const " + name + "[^=]*= \\{([\\s\\S]*?)\\n\\};");
  const match = src.match(re);
  if (!match) {
    throw new Error("Missing locale block: " + name);
  }
  const body = match[1];
  const out = {};
  const lineRe = /"([^"]+)": "((?:\\.|[^"\\])*)"/g;
  let row;
  while ((row = lineRe.exec(body))) {
    try {
      out[row[1]] = JSON.parse('"' + row[2] + '"');
    } catch {
      out[row[1]] = row[2];
    }
  }
  messages[name] = out;
  process.stdout.write(name + " " + Object.keys(out).length + "\n");
}

const keys = Object.keys(messages.en);
const groups = {};
for (const key of keys) {
  const prefix = key.includes(".") ? key.split(".")[0] : "other";
  if (!groups[prefix]) groups[prefix] = [];
  groups[prefix].push(key);
}

const labels = {
  nav: "Menu",
  online: "Online bar",
  hero: "Banner / hero",
  stat: "Homepage stats",
  strip: "Service strip",
  how: "How it works",
  trust: "Trust",
  pop: "Popular topics",
  about: "About section",
  astro: "Astrologers",
  svc: "Services",
  pooja: "Poojas",
  prod: "Products",
  travel: "Temple yatra",
  horoscope: "Horoscope",
  consult: "Consultation",
  blog: "Blog",
  cta: "Call to action",
  footer: "Footer",
  search: "Search",
  auth: "Login",
  book: "Booking",
  legal: "Legal pages",
  tool: "Tools",
  other: "Other",
};

const catalog = {
  locales: [
    { id: "en", native: "English" },
    { id: "hi", native: "हिन्दी" },
    { id: "ta", native: "தமிழ்" },
    { id: "ml", native: "മലയാളം" },
    { id: "kn", native: "ಕನ್ನಡ" },
    { id: "te", native: "తెలుగు" },
  ],
  groups: Object.keys(groups).map((id) => ({
    id,
    label: labels[id] || id,
    keys: groups[id],
  })),
  messages,
};

const dest = path.join(
  "app",
  "public",
  "wp-content",
  "plugins",
  "jyothishiuncle-core",
  "includes",
  "i18n-catalog.json",
);
fs.writeFileSync(dest, JSON.stringify(catalog));
process.stdout.write("wrote " + dest + " " + fs.statSync(dest).size + "\n");
