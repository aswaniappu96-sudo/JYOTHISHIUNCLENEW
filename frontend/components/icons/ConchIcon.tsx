export function ConchIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <img
      src="/conch.png?v=3"
      alt=""
      aria-hidden
      className={`inline-block object-contain ${className}`}
    />
  );
}
