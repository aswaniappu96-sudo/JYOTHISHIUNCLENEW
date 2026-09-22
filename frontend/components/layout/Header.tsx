"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { usePortal } from "@/components/portal/PortalProvider";

const services = [
  { href: "/astrologers", label: "Astrologers" },
  { href: "/services", label: "Pooja" },
  { href: "/services#products", label: "Products" },
];

const religious = [
  { href: "/blog", label: "Articles" },
  { href: "/religious-travel", label: "Travel" },
];

function Dropdown({
  label,
  items,
  pathname,
}: {
  label: string;
  items: { href: string; label: string }[];
  pathname: string;
}) {
  const active = items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <div className="group relative py-2">
      <button
        type="button"
        className={`flex items-center gap-1 bg-transparent text-sm tracking-wide transition ${
          active ? "font-bold text-primary" : "text-on-surface-variant group-hover:text-primary"
        }`}
      >
        {label} <span className="text-[10px] opacity-70">▾</span>
      </button>
      <div className="invisible absolute top-full left-0 z-[80] w-52 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
        <div className="flex flex-col rounded-xl bg-surface-low p-2 shadow-[0_12px_32px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-high hover:text-on-surface"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header({ logoUrl }: { logoUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, logout } = useAuth();
  const { openAuth } = usePortal();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full overflow-visible bg-surface-lowest/70 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="flex h-24 w-full items-center justify-between px-4 md:px-12">
        <Link href="/" className="flex h-full min-w-0 max-w-[62vw] items-center overflow-hidden xl:max-w-[420px]">
          {logoUrl && !logoUrl.includes("placeholder") ? (
            <img
              src={logoUrl}
              alt="JyothishiUncle"
              className="h-[320%] w-auto max-w-none shrink-0 object-contain brightness-125 drop-shadow-[0_0_10px_rgba(255,224,157,0.35)]"
            />
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary-container text-lg text-on-primary shadow-[0_0_18px_rgba(229,195,120,0.45)]">
                ॐ
              </span>
              <span className="ml-2 font-serif text-2xl leading-none tracking-tight text-primary">JyothishiUncle</span>
            </>
          )}
        </Link>

        <nav className="relative z-[80] hidden items-center gap-6 overflow-visible xl:flex" aria-label="Main">
          <Link href="/" className={`text-sm ${pathname === "/" ? "font-bold text-primary" : "text-on-surface-variant hover:text-primary"}`}>
            Home
          </Link>
          <Link href="/about" className={`text-sm ${pathname === "/about" ? "font-bold text-primary" : "text-on-surface-variant hover:text-primary"}`}>
            About
          </Link>
          <Dropdown label="Services" items={services} pathname={pathname} />
          <Dropdown label="Religious" items={religious} pathname={pathname} />
          <Link href="/contact" className={`text-sm ${pathname === "/contact" ? "font-bold text-primary" : "text-on-surface-variant hover:text-primary"}`}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <BookConsultationButton className="hidden rounded-full bg-primary-container px-4 py-1.5 text-sm font-semibold tracking-wide text-on-primary shadow-[0_0_20px_-3px_rgba(229,195,120,0.5)] transition hover:bg-primary sm:inline-flex" />
          {user ? (
            <div className="relative">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setAccountOpen((value) => !value)}
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary ring-2 ring-emerald-400"
                aria-label="Account"
              >
                {user.name?.[0]?.toUpperCase() || "A"}
                <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border border-surface-lowest bg-emerald-400" />
              </button>
              {accountOpen ? (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-surface-low/95 p-2 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                  <Link href="/account" className="block rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-high" onClick={() => setAccountOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/account/bookings" className="block rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-high" onClick={() => setAccountOpen(false)}>
                    My Bookings
                  </Link>
                  <button
                    type="button"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-on-surface-variant hover:bg-surface-high"
                    onClick={() => {
                      setAccountOpen(false);
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => openAuth("login")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary"
              aria-label="Login"
            >
              <span className="text-sm">👤</span>
            </button>
          )}
          <button
            type="button"
            suppressHydrationWarning
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 xl:hidden"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-px w-4 bg-primary" />
              <span className="block h-px w-4 bg-primary" />
              <span className="block h-px w-4 bg-primary" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-outline-variant/30 bg-surface-lowest/95 px-5 py-4 xl:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-3 text-sm text-on-surface-variant">
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Services</p>
            {services.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="pl-3">
                {item.label}
              </Link>
            ))}
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Religious</p>
            {religious.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="pl-3">
                {item.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <BookConsultationButton className="rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary" />
            {user ? (
              <>
                <Link href="/account" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link href="/account/bookings" onClick={() => setOpen(false)}>My Bookings</Link>
                <button type="button" onClick={() => { setOpen(false); logout(); }} className="text-left">
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openAuth("login");
                }}
                className="text-left"
              >
                Login / Register
              </button>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
