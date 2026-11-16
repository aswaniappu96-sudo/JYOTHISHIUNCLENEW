const POOJA: Record<string, string> = {
  "ganapathi-homam": "/catalog/pooja/ganapathi-homam.png",
  "navagraha-homam": "/catalog/pooja/navagraha-homam.png",
  "maha-mrityunjaya-homam": "/catalog/pooja/maha-mrityunjaya-homam.png",
  "vidhya-prapti-homam": "/catalog/pooja/vidhya-prapti-homam.png",
  "dakshina-moorthi-pooja": "/catalog/pooja/dakshina-moorthi-pooja.png",
  "karthyayani-durga-pooja-marital-peace": "/catalog/pooja/karthyayani-durga-pooja-marital-peace.png",
  "mangalik-dhosha-pooja": "/catalog/pooja/mangalik-dhosha-pooja.png",
  "laxmi-kuber-dhana-akarsham-homam": "/catalog/pooja/laxmi-kuber-dhana-akarsham-homam.png",
};

const TEMPLE: Record<string, string> = {
  "sri-mahaganapathi-temple": "/catalog/temple/sri-mahaganapathi-temple.jpg",
  "sri-mahavishnu-temple": "/catalog/temple/sri-mahavishnu-temple.jpg",
  "sri-mahadeva-temple": "/catalog/temple/sri-mahadeva-temple.jpg",
};

const ASTROLOGER: Record<string, string> = {
  "sri-devadathan-namboothiri": "/catalog/astrologer/sri-devadathan-namboothiri.jpg",
  "pandit-radhakrishnan-shastri": "/catalog/astrologer/pandit-radhakrishnan-shastri.jpg",
  "vidushi-gayatri-devi": "/catalog/astrologer/vidushi-gayatri-devi.jpg",
  "acharya-shankaranarayana-bhat": "/catalog/astrologer/acharya-shankaranarayana-bhat.jpg",
};

function stalePublicPhoto(url: string) {
  return /velvetbyte\.com|jyothishiuncle\.ct\.ws/i.test(url);
}

function preferFresh(bundled: string | undefined, remote = "") {
  if (bundled && (!remote || stalePublicPhoto(remote))) return bundled;
  return remote || bundled || "";
}

/** The photo saved on this computer wins. A bundled copy replaces the older public file. */
export function liveCatalogPhoto(kind: "pooja" | "temple", slug: string | undefined, remote = "") {
  const bundled = slug ? (kind === "pooja" ? POOJA : TEMPLE)[slug] : "";
  return preferFresh(bundled, remote);
}

export function astrologerPhoto(slug: string | undefined, remote = "") {
  return preferFresh(slug ? ASTROLOGER[slug] : "", remote);
}
