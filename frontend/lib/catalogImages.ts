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

function isLocalMedia(url: string) {
  try {
    const host = new URL(url, "http://127.0.0.1").hostname;
    return host === "127.0.0.1" || host === "localhost" || host === "0.0.0.0" || host.endsWith(".local");
  } catch {
    return false;
  }
}

/** Bundled photos replace the public WordPress files. Local WordPress addresses stay as saved. */
export function liveCatalogPhoto(kind: "pooja" | "temple", slug: string | undefined, remote = "") {
  const bundled = slug ? (kind === "pooja" ? POOJA : TEMPLE)[slug] : "";
  if (!bundled) return remote;
  if (!remote || !isLocalMedia(remote)) return bundled;
  return remote;
}
