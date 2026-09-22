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
      "bg-linear-to-r from-primary via-primary-container to-primary text-on-primary shadow-[0_0_25px_rgba(229,195,120,0.45)] hover:shadow-[0_0_35px_rgba(255,224,157,0.7)]",
    ghost: "border border-primary/30 bg-transparent text-primary hover:bg-surface-highest",
    light: "bg-surface-highest text-primary hover:bg-primary hover:text-on-primary",
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
