import type { ItemI18n } from "@/lib/localized";

/** Current WordPress temple post titles. Used when a public copy still has the old place prefix. */
const CURRENT_TEMPLE_POSTS: Record<string, string> = {
  "sri-mahaganapathi-temple": "Hanuman Swami Temple",
  "sri-mahavishnu-temple": "Vishnumaya Swami – Karimkutty Swami Temple",
  "sri-mahadeva-temple": "Bhadrakali Temple",
};

function hasOldPlaceName(value?: string) {
  return Boolean(value && /anjoor/i.test(value));
}

export function withCurrentTemplePosts<
  T extends { slug?: string; title?: string; location?: string; i18n?: ItemI18n },
>(vendors: T[]): T[] {
  if (!Array.isArray(vendors)) return vendors;
  return vendors.map((vendor) => {
    const current = vendor.slug ? CURRENT_TEMPLE_POSTS[vendor.slug] : "";
    if (!current || !hasOldPlaceName(vendor.title)) return vendor;
    const sameAsTitle = (vendor.location || "").trim().toLowerCase() === (vendor.title || "").trim().toLowerCase();
    const packs = vendor.i18n && !Array.isArray(vendor.i18n) ? vendor.i18n : undefined;
    const i18n = packs
      ? (Object.fromEntries(
          Object.entries(packs).map(([locale, pack]) => {
            if (!pack || !hasOldPlaceName(pack.title)) return [locale, pack];
            return [locale, { ...pack, title: current }];
          }),
        ) as ItemI18n)
      : vendor.i18n;
    return {
      ...vendor,
      title: current,
      location: sameAsTitle ? current : vendor.location,
      i18n,
    };
  });
}

export function templePostName(slug?: string, title = "") {
  const [named] = withCurrentTemplePosts([{ slug, title }]);
  return named?.title?.trim() || title.trim() || slug || "";
}
