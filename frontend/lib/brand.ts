export const BRAND_NAME = "MaharshiOm";
export const BRAND_DOMAIN = "maharshiom.com";
export const BRAND_SITE = `www.${BRAND_DOMAIN}`;
export const BRAND_URL = `https://${BRAND_DOMAIN}`;
export const BRAND_EMAIL = `support@${BRAND_DOMAIN}`;
export const BRAND_GRIEVANCE_EMAIL = `grievance@${BRAND_DOMAIN}`;
export const BRAND_CLASS = "brand-mark";

const OLD_EMAIL = /([a-z0-9._%+-]+)@jyothishiuncle\.com/gi;
const OLD_DOMAIN = /(?:www\.)?jyothishiuncle\.com/gi;
const OLD_NAME = /Jyothishi\s*Uncle/gi;
const OLD_HANDLE = /jyothishiuncle/gi;

export function isBrandName(value?: string | null) {
  return (value || "").replace(/\s+/g, "").toLowerCase() === BRAND_NAME.toLowerCase();
}

export function rewriteBrandText(input: string) {
  if (!input) return input;
  return input
    .replace(OLD_EMAIL, `$1@${BRAND_DOMAIN}`)
    .replace(OLD_DOMAIN, BRAND_SITE)
    .replace(OLD_NAME, BRAND_NAME);
}

export function rewriteBrandHandle(input: string) {
  if (!input) return input;
  if (/jyothishiuncle\.(ct\.ws|local)|jyothishuncle\.velvetbyte/i.test(input)) return input;
  return rewriteBrandText(input).replace(OLD_HANDLE, "maharshiom");
}

export function markBrandHtml(html: string) {
  return rewriteBrandText(html).replace(
    /(?:<span class="brand-mark">)?MaharshiOm(?:<\/span>)?/g,
    `<span class="${BRAND_CLASS}">MaharshiOm</span>`,
  );
}

export function rewriteBrandDeep<T>(value: T): T {
  if (typeof value === "string") return rewriteBrandText(value) as T;
  if (Array.isArray(value)) return value.map((item) => rewriteBrandDeep(item)) as T;
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      next[key] = rewriteBrandDeep(nested);
    }
    return next as T;
  }
  return value;
}
