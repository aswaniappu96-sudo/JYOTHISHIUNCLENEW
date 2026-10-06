"use client";

import Link from "next/link";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { usePortal } from "@/components/portal/PortalProvider";
import { POOJAS_PATH, PRODUCTS_PATH } from "@/lib/siteRoutes";
import { SECTION_INNER } from "@/lib/layout";
import type { MsgKey } from "@/lib/i18n";

type FootItem = { href?: string; key: MsgKey; onClick?: () => void };

function FootLink({ href, label, onClick }: { href?: string; label: string; onClick?: () => void }) {
  const className = "text-left text-sm text-on-surface-variant transition hover:text-primary";
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {label}
      </button>
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

  const social = [
    instagram ? { href: instagram, label: "Instagram" } : { label: "Instagram" },
    facebook ? { href: facebook, label: "Facebook" } : { label: "Facebook" },
    youtube ? { href: youtube, label: "YouTube" } : { label: "YouTube" },
  ];

  return (
    <footer className="relative z-10 mt-12 w-full bg-surface-lowest/90 pb-8 pt-16 backdrop-blur-2xl">
      <div className={SECTION_INNER}>
        <div className="grid grid-cols-2 gap-8 py-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <div>
            <Link href="/" className="mb-4 block font-serif text-[20px] font-medium tracking-[0.04em] text-[#1A1106] whitespace-nowrap">
              JYOTHISHIUNCLE
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
          <FootCol title={t("footer.legal")} items={legal.map((item) => ({ ...item, label: t(item.key) }))} />
          <FootCol title={t("footer.social")} items={social} />
        </div>

        <div className="mt-8 border-t border-outline-variant/30 pt-6 text-center text-xs text-on-surface-variant sm:text-left">
          <p>{t("footer.copy")}</p>
        </div>
      </div>
    </footer>
  );
}
