import Link from "next/link";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "light";
  external?: boolean;
}) {
  const styles = {
    primary:
      "bg-primary-container text-on-primary shadow-[0_8px_22px_rgba(201,162,39,0.35)] hover:brightness-95",
    ghost: "border border-primary/30 bg-transparent text-primary hover:bg-surface-highest",
    light: "bg-surface-highest text-primary hover:bg-primary hover:text-surface-lowest",
  }[variant];

  const className = `inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition ${styles}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
