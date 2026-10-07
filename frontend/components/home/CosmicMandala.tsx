const sizeClass = {
  md: "h-[220px] w-[220px] sm:h-[300px] sm:w-[300px] lg:h-[360px] lg:w-[360px]",
  lg: "h-[300px] w-[300px] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]",
  fill: "h-full w-full",
};

export function CosmicMandala({ className = "", size = "lg" }: { className?: string; size?: "md" | "lg" | "fill" }) {
  return (
    <div
      className={`relative flex select-none items-center justify-center ${sizeClass[size]} ${className}`}
      aria-hidden
    >
      <div className="mandala-outer-glow pointer-events-none absolute inset-[3%] rounded-full" />
      <svg className="mandala-spin mandala-gold-emit absolute inset-0 h-full w-full" fill="none" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="235" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1.6" />
        <circle cx="250" cy="250" r="215" stroke="currentColor" strokeWidth="1.2" />
        <g opacity="0.75" stroke="currentColor" strokeWidth="0.7">
          <line x1="250" x2="250" y1="15" y2="485" />
          <line x1="15" x2="485" y1="250" y2="250" />
          <line x1="84" x2="416" y1="84" y2="416" />
          <line x1="84" x2="416" y1="416" y2="84" />
        </g>
        <circle cx="250" cy="25" fill="currentColor" r="5" />
        <circle cx="362" cy="55" fill="currentColor" r="3.5" />
        <circle cx="445" cy="138" fill="currentColor" r="4" />
        <circle cx="475" cy="250" fill="currentColor" r="5" />
        <circle cx="445" cy="362" fill="currentColor" r="3.5" />
        <circle cx="362" cy="445" fill="currentColor" r="4" />
        <circle cx="250" cy="475" fill="currentColor" r="5" />
        <circle cx="138" cy="445" fill="currentColor" r="3.5" />
        <circle cx="55" cy="362" fill="currentColor" r="4" />
        <circle cx="25" cy="250" fill="currentColor" r="5" />
        <circle cx="55" cy="138" fill="currentColor" r="4" />
        <circle cx="138" cy="55" fill="currentColor" r="4" />
      </svg>
      <svg className="mandala-spin-rev mandala-gold-emit absolute h-[78%] w-[78%]" fill="none" viewBox="0 0 400 400">
        <polygon points="200,20 356,110 356,290 200,380 44,290 44,110" stroke="currentColor" strokeWidth="1.2" />
        <polygon
          points="200,380 44,290 44,110 200,20 356,110 356,290"
          stroke="currentColor"
          strokeWidth="0.8"
          transform="rotate(30 200 200)"
        />
        <circle cx="200" cy="200" r="140" stroke="currentColor" strokeDasharray="2 6" strokeWidth="0.75" />
      </svg>
      <div className="relative flex h-[32%] w-[32%] items-center justify-center">
        <div className="om-gold-halo pointer-events-none absolute inset-[-28%] rounded-full" />
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-linear-to-tr from-primary-container/25 via-surface-low/80 to-primary-container/20">
          <div className="om-gold-core relative z-10 flex h-[62%] w-[62%] items-center justify-center rounded-full">
            <span className="font-serif text-2xl font-bold text-on-primary drop-shadow-[0_1px_0_rgba(255,248,212,0.8)] sm:text-4xl lg:text-5xl">
              ॐ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
