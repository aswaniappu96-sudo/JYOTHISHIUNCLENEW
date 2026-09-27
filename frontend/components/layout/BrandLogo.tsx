export function BrandLogo({
  className = "h-[4.5rem]",
}: {
  className?: string;
}) {
  return (
    <img
      src="/logo.png?v=5"
      alt="JyothishiUncle"
      className={`w-auto max-w-full object-contain object-left [filter:drop-shadow(0_6px_14px_rgba(201,162,39,0.45))] ${className}`}
    />
  );
}
