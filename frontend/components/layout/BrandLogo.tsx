export function BrandLogo({
  className = "h-16",
}: {
  className?: string;
}) {
  return (
    <img
      src="/maharshiom-logo.png?v=3"
      alt="MaharshiOm"
      className={`w-auto max-w-full object-contain object-left ${className}`}
    />
  );
}
