"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ScrollSutra } from "@/components/layout/ScrollSutra";
import { usePortal } from "@/components/portal/PortalProvider";
import { POOJAS_PATH, PRODUCTS_PATH, isPoojasNav, isProductsNav } from "@/lib/siteRoutes";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { allSiteServices, type SiteServiceLink } from "@/lib/siteServices";
import { useJuList } from "@/lib/useJuList";
import type { AstrologyService } from "@/types/wordpress";

const primaryNav = [
  { href: "/", key: "nav.home" as const, match: "home" },
  { href: "/#all-services", key: "nav.services" as const, match: "services" },
  { href: "/astrologers", key: "nav.astrologers" as const, match: "astrologers" },
  { href: POOJAS_PATH, key: "nav.poojas" as const, match: "poojas" },
  { href: PRODUCTS_PATH, key: "nav.products" as const, match: "products" },
  { href: "/religious-travel", key: "nav.yatra" as const, match: "travel" },
];

const moreNav = [
  { href: "/about", key: "nav.about" as const },
  { href: "/blog", key: "nav.articles" as const },
  { href: "/contact", key: "nav.contact" as const },
];

const ctaClass =
  "hidden rounded-full bg-[#c4a227] px-5 py-2 text-[12px] font-semibold tracking-wide text-white shadow-none transition hover:bg-[#b08a1a] sm:inline-flex";

function isNavActive(pathname: string, tab: string | null, item: (typeof primaryNav)[number]) {
  if (item.match === "home") return pathname === "/";
  if (item.match === "services") return pathname === "/" || pathname === "/astrologers";
  if (item.match === "astrologers") return pathname === "/astrologers" || pathname.startsWith("/astrologers/");
  if (item.match === "poojas") return isPoojasNav(pathname, tab);
  if (item.match === "products") return isProductsNav(pathname, tab);
  if (item.match === "travel") return pathname === "/religious-travel" || pathname.startsWith("/religious-travel/");
  return false;
}

function NavLink({
  href,
  label,
  active,
  overHero,
}: {
  href: string;
  label: string;
  active?: boolean;
  overHero?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative px-1 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
        overHero
          ? active
            ? "text-[#e5c378]"
            : "text-[#fff8ec]/90 hover:text-[#e5c378]"
          : active
            ? "text-[#8b6414]"
            : "text-[#b08a1a] hover:text-[#8b6414]"
      }`}
    >
      {label}
      {active ? (
        <span className="absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-[#c4a227]" />
      ) : null}
    </Link>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 18.5c1.2-3 3.5-4.5 6.5-4.5s5.3 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ServiceMega({
  items,
  open,
  onClose,
}: {
  items: SiteServiceLink[];
  open: boolean;
  onClose: () => void;
}) {
  const consult = items.filter((item) => item.group === "consult");
  const offer = items.filter((item) => item.group === "offer");

  return (
    <div
      className={`absolute top-full left-1/2 z-[90] w-[min(36rem,70vw)] -translate-x-1/2 pt-2 transition ${
        open ? "visible opacity-100" : "invisible opacity-0 group-hover:visible group-hover:opacity-100"
      }`}
    >
      <div className="relative z-[90] grid gap-4 rounded-xl bg-surface-lowest p-4 shadow-[0_12px_32px_rgba(90,60,20,0.12)] ring-1 ring-outline-variant/80 sm:grid-cols-2">
        <div>
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Consultation</p>
          {consult.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className="block rounded-lg px-3 py-2 hover:bg-surface-low"
            >
              <span className="block text-[13px] font-semibold text-primary">{item.label}</span>
              <span className="block text-[11px] text-primary/70">{item.hint}</span>
            </Link>
          ))}
        </div>
        <div>
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Also available</p>
          {offer.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className="block rounded-lg px-3 py-2 hover:bg-surface-low"
            >
              <span className="block text-[13px] font-semibold text-primary">{item.label}</span>
              <span className="block text-[11px] text-primary/70">{item.hint}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header({
  logoUrl: _logoUrl,
  services = [],
}: {
  logoUrl?: string;
  services?: AstrologyService[];
}) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, logout } = useAuth();
  const { openAuth } = usePortal();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const moreActive = moreNav.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const wpServices = useJuList<AstrologyService>("/services", services);
  const catalog = useMemo(() => allSiteServices(wpServices), [wpServices]);
  const { t } = usePrefs();
  const isHome = pathname === "/";
  const [overHero, setOverHero] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }
    const update = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!hero) {
        setOverHero(window.scrollY < 80);
        return;
      }
      setOverHero(hero.getBoundingClientRect().bottom > 96);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  const navTone = overHero ? "text-[#fff8ec]/90 hover:text-[#e5c378]" : "text-primary hover:text-on-surface";
  const moreTone = overHero
    ? moreActive
      ? "text-[#e5c378]"
      : "text-[#fff8ec]/90 group-hover:text-[#e5c378]"
    : moreActive
      ? "text-[#8b6414]"
      : "text-[#b08a1a] group-hover:text-[#8b6414]";

  return (
    <header
      className={`fixed top-0 z-50 w-full overflow-visible transition-[background-color,color] duration-300 ${
        overHero ? "bg-transparent text-[#fff8ec]" : "bg-surface-lowest/95 text-primary backdrop-blur-md"
      }`}
    >
      <div className="relative flex h-16 w-full items-center justify-between px-4 md:h-20 md:px-8 lg:px-10">
        <Link href="/" className="relative z-10 flex h-full min-w-0 max-w-[48vw] items-center lg:max-w-[280px]">
          <BrandLogo className={`h-12 md:h-16 ${overHero ? "drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]" : ""}`} />
        </Link>

        <nav
          className="absolute left-1/2 z-[80] hidden -translate-x-1/2 items-center gap-5 overflow-visible xl:flex"
          aria-label="Main"
        >
          {primaryNav.map((item) =>
            item.match === "services" ? (
              <div
                key={item.href}
                className="group relative flex h-16 items-center md:h-20"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href="/#all-services"
                  className={`flex items-center gap-1 bg-transparent text-[11px] font-semibold uppercase tracking-[0.16em] transition ${navTone}`}
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen(false)}
                >
                  {t("nav.services")}
                  <span className="text-[9px] opacity-80">▾</span>
                </Link>
                <ServiceMega items={catalog} open={servicesOpen} onClose={() => setServicesOpen(false)} />
              </div>
            ) : (
              <NavLink key={item.href} href={item.href} label={t(item.key)} active={isNavActive(pathname, tab, item)} overHero={overHero} />
            ),
          )}
          <div
            className="group relative flex h-20 items-center"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 bg-transparent text-[11px] font-semibold uppercase tracking-[0.16em] transition ${moreTone}`}
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(true)}
            >
              {t("nav.more")}
              <span className="text-[9px] opacity-80">▾</span>
              {moreActive ? (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-[#c4a227]" />
              ) : null}
            </button>
            <div
              className={`absolute top-full left-1/2 z-[90] w-48 -translate-x-1/2 pt-2 transition ${
                moreOpen ? "visible opacity-100" : "invisible opacity-0 group-hover:visible group-hover:opacity-100"
              }`}
            >
              <div className="relative z-[90] flex flex-col rounded-xl bg-surface-lowest p-2 shadow-[0_12px_32px_rgba(90,60,20,0.12)] ring-1 ring-outline-variant/80">
                {moreNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="rounded-lg px-3 py-2 text-[12px] font-medium tracking-wide text-primary hover:bg-surface-low hover:text-primary"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <BookConsultationButton className={ctaClass} />
          {user ? (
            <div className="relative">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setAccountOpen((value) => !value)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#c4a227] bg-surface-lowest text-primary ring-2 ring-emerald-400"
                aria-label="Account"
              >
                {user.name?.[0]?.toUpperCase() || "A"}
                <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border border-white bg-emerald-400" />
              </button>
              {accountOpen ? (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-surface-lowest p-2 shadow-[0_12px_32px_rgba(90,60,20,0.12)] ring-1 ring-outline-variant/80">
                  <Link href="/account" className="block rounded-lg px-3 py-2 text-sm text-primary hover:bg-surface-low" onClick={() => setAccountOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/account/bookings" className="block rounded-lg px-3 py-2 text-sm text-primary hover:bg-surface-low" onClick={() => setAccountOpen(false)}>
                    My Bookings
                  </Link>
                  <button
                    type="button"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-primary hover:bg-surface-low"
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c4a227] bg-surface-lowest text-primary"
              aria-label="Login"
            >
              <AccountIcon />
            </button>
          )}
          <button
            type="button"
            suppressHydrationWarning
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full xl:hidden ${
              overHero ? "border border-[#f3e6c8]/35" : "border border-[#ead9bc]"
            }`}
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-px w-4 ${overHero ? "bg-[#e5c378]" : "bg-[#b08a1a]"}`} />
              <span className={`block h-px w-4 ${overHero ? "bg-[#e5c378]" : "bg-[#b08a1a]"}`} />
              <span className={`block h-px w-4 ${overHero ? "bg-[#e5c378]" : "bg-[#b08a1a]"}`} />
            </span>
          </button>
        </div>
      </div>
      <ScrollSutra />

      {open ? (
        <nav className="max-h-[70vh] overflow-y-auto border-t border-outline-variant/60 bg-surface-lowest px-5 py-4 xl:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-3 text-sm font-medium tracking-wide text-primary">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {t(item.key)}
              </Link>
            ))}
            <p className="pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{t("nav.services")}</p>
            {catalog.map((item) => (
              <Link key={item.id} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {moreNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {t(item.key)}
              </Link>
            ))}
            <BookConsultationButton className="rounded-full bg-[#c4a227] px-4 py-2 text-sm font-semibold text-white" />
            {user ? (
              <>
                <Link href="/account" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/account/bookings" onClick={() => setOpen(false)}>
                  My Bookings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="text-left"
                >
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
