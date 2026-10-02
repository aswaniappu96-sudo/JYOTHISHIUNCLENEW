export function BrandLogo({
  className = "h-[4.5rem]",
}: {
  className?: string;
}) {
  return (
    <img
      src="/ju-logo.png?v=1"
      alt="JyothishiUncle"
      className={`w-auto max-w-full object-contain object-left ${className}`}
    />
  );
}
