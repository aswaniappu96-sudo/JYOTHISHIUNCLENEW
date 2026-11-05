export function BrandLogo({
  className = "h-12",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-2">
      <img
        src="/maharshiom-mark.png?v=1"
        alt=""
        className={`w-auto shrink-0 object-contain ${light ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]" : ""} ${className}`}
      />
      <span
        className={`whitespace-nowrap text-[14px] font-bold leading-none tracking-[0.03em] sm:text-[16px] md:text-[18px] ${
          light ? "text-[#FFF6EA] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]" : "text-[#A3332E]"
        }`}
        style={{ fontFamily: "var(--font-brand), Cinzel, serif" }}
      >
        MaharshiOm
        <span
          className="ml-1.5 align-[-0.06em] text-[1.08em] font-semibold"
          style={{ fontFamily: '"Noto Serif Devanagari", serif' }}
          aria-hidden
        >
          ॐ
        </span>
      </span>
    </span>
  );
}
