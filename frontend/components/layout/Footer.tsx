"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { usePortal } from "@/components/portal/PortalProvider";
import { POOJAS_PATH, PRODUCTS_PATH } from "@/lib/siteRoutes";
import { SECTION_INNER } from "@/lib/layout";
import type { MsgKey } from "@/lib/i18n";

const FALLBACK_SOCIAL = {
  instagram: "https://www.instagram.com/jyothishiuncle",
  facebook: "https://www.facebook.com/jyothishiuncle",
  youtube: "https://www.youtube.com/@jyothishiuncle",
};

type FootItem = { href?: string; key: MsgKey; onClick?: () => void };

function FootLink({ href, label, onClick }: { href?: string; label: string; onClick?: () => void }) {
  const className = "text-left text-sm text-on-surface-variant transition hover:text-primary";
  if (onClick) {
    return (
      <a
        href="/account"
        className={className}
        onClick={(event) => {
          event.preventDefault();
          onClick();
        }}
      >
        {label}
      </a>
    );
  }
  if (!href) return <span className="text-sm text-on-surface-variant">{label}</span>;
  const external = href.startsWith("http");
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function FootCol({ title, items }: { title: string; items: { href?: string; label: string; onClick?: () => void }[] }) {
  return (
    <div>
      <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-primary">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <FootLink href={item.href} label={item.label} onClick={item.onClick} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function iconClass() {
  return "flex h-9 w-9 items-center justify-center rounded-full border border-[#EAD9B0] text-primary transition hover:bg-primary/10";
}

export function Footer({
  instagram,
  facebook,
  youtube,
}: {
  text?: string;
  address?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  logoUrl?: string;
}) {
  const { t } = usePrefs();
  const { openAuth } = usePortal();
  const year = new Date().getFullYear();
  const ig = instagram || FALLBACK_SOCIAL.instagram;
  const fb = facebook || FALLBACK_SOCIAL.facebook;
  const yt = youtube || FALLBACK_SOCIAL.youtube;

  const company: FootItem[] = [
    { href: "/about", key: "footer.about" },
    { href: "/contact", key: "footer.contact" },
    { href: "/careers", key: "footer.careers" },
    { href: "/blog", key: "footer.blog" },
    { href: "/help", key: "footer.help" },
  ];

  const consult: FootItem[] = [
    { href: "/astrologers", key: "footer.astrologers" },
    { href: "/astrologers", key: "footer.chat" },
    { href: "/astrologers", key: "footer.call" },
    { href: "/#consultation", key: "footer.video" },
    { href: "/#all-services", key: "footer.categories" },
  ];

  const astrology: FootItem[] = [
    { href: "/?tool=kundli#free-tools", key: "footer.kundli" },
    { href: "/?tool=match#free-tools", key: "footer.match" },
    { href: "/?tool=horoscope#horoscope", key: "footer.horoscope" },
    { href: "/?tool=rashi#free-tools", key: "footer.rashi" },
    { href: "/?tool=nakshatra#free-tools", key: "footer.nakshatra" },
    { href: "/?tool=numerology#free-tools", key: "footer.numerology" },
  ];

  const spiritual: FootItem[] = [
    { href: POOJAS_PATH, key: "footer.pooja" },
    { href: "/#pooja-temples", key: "footer.temple" },
    { href: "/religious-travel", key: "footer.yatra" },
    { href: PRODUCTS_PATH, key: "footer.products" },
  ];

  const forAstrologers: FootItem[] = [
    { href: "/#join", key: "footer.become" },
    { key: "footer.login", onClick: () => openAuth("login") },
    { href: "/contact", key: "footer.partner" },
  ];

  const legal: FootItem[] = [
    { href: "/terms", key: "footer.terms" },
    { href: "/privacy-policy", key: "footer.privacy" },
    { href: "/refund-policy", key: "footer.refund" },
    { href: "/disclaimer", key: "footer.disclaimer" },
  ];

  return (
    <footer className="relative z-10 mt-12 w-full bg-surface-lowest/90 pb-8 pt-16 backdrop-blur-2xl">
      <div className={SECTION_INNER}>
        <div className="grid grid-cols-2 gap-8 py-4 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <Link href="/" className="mb-4 inline-block" aria-label="JyothishiUncle">
              <BrandLogo className="h-14" />
            </Link>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.key}>
                  <FootLink href={item.href} label={t(item.key)} />
                </li>
              ))}
            </ul>
          </div>
          <FootCol title={t("footer.consult")} items={consult.map((item) => ({ ...item, label: t(item.key) }))} />
          <FootCol title={t("footer.astrology")} items={astrology.map((item) => ({ ...item, label: t(item.key) }))} />
          <FootCol title={t("footer.spiritual")} items={spiritual.map((item) => ({ ...item, label: t(item.key) }))} />
          <FootCol
            title={t("footer.forAstrologers")}
            items={forAstrologers.map((item) => ({ ...item, label: t(item.key) }))}
          />
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-outline-variant/30 pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-xs text-on-surface-variant">© {year} JyothishiUncle</p>
            <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-on-surface-variant">
              {legal.map((item) => (
                <Link key={item.key} href={item.href || "/"} className="transition hover:text-primary">
                  {t(item.key)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <a href={ig} target="_blank" rel="noreferrer" className={iconClass()} aria-label="Instagram">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
              </svg>
            </a>
            <a href={fb} target="_blank" rel="noreferrer" className={iconClass()} aria-label="Facebook">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M14.2 21v-7.1h2.4l.4-2.8h-2.8V9.3c0-.8.2-1.4 1.4-1.4H17V5.4c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H8.8v2.8h2.6V21h2.8Z" />
              </svg>
            </a>
            <a href={yt} target="_blank" rel="noreferrer" className={iconClass()} aria-label="YouTube">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M21.6 8.2a2.7 2.7 0 0 0-1.9-1.9C18 6 12 6 12 6s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 8.2 28 28 0 0 0 2.1 12a28 28 0 0 0 .3 3.8 2.7 2.7 0 0 0 1.9 1.9C6 18 12 18 12 18s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .3-3.8 28 28 0 0 0-.3-3.8ZM10 15.1V8.9L15.2 12 10 15.1Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
