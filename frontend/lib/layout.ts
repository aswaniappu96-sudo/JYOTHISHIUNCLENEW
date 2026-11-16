export const SHELL = "mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-8";
export const HEADER_PAD = "pt-16 md:pt-20";
export const HEADER_PULL = "-mt-16 md:-mt-20";
export const SECTION_INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";
export const SECTION = "relative w-full py-5 md:py-6";
export const KICKER = "text-[11px] font-bold uppercase tracking-[0.22em] text-primary";
export const TITLE = "font-serif text-[26px] font-bold leading-tight tracking-tight text-on-surface md:text-[34px]";
export const DISPLAY_TITLE =
  "font-serif text-[36px] font-bold leading-[1.08] tracking-tight text-on-surface sm:text-[48px] md:text-[58px]";
export const PAGE_TITLE_SHAPE =
  "font-serif text-[40px] font-medium not-italic leading-[0.95] tracking-[-0.03em] sm:text-[52px]";
export const PAGE_TITLE_GOLD = "text-[#9A6F3A] dark:text-[#e5c378]";
export const PAGE_TITLE = `${PAGE_TITLE_SHAPE} ${PAGE_TITLE_GOLD}`;
export const PAGE_ACCENT = "not-italic text-[#C4A227] dark:text-[#f0d48a]";
export const LEAD = "max-w-3xl text-[15px] leading-relaxed text-on-surface md:text-base";

export function splitHeading(title: string, lead?: string, accent?: string) {
  if (lead != null && accent != null) return { lead, accent };
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return { lead: words[0] || "", accent: "" };
  return { lead: words.slice(0, -1).join(" "), accent: words[words.length - 1] };
}
