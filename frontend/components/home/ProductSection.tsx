"use client";

import Link from "next/link";
import { ProductEnquiryButton } from "@/components/booking/ProductEnquiryButton";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { stripPublicPrices } from "@/lib/html";
import { imageSrc } from "@/lib/media";
import { PRODUCTS_PATH } from "@/lib/siteRoutes";
import { useJuList } from "@/lib/useJuList";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

const CARDS = [
  "from-[#f7e3c2] via-[#f8ebd4] to-[#fdf8ee]",
  "from-[#f6d7c4] via-[#f8e4d4] to-[#fdf6ef]",
  "from-[#f3e4b8] via-[#f7eed0] to-[#fbf7e8]",
  "from-[#e9d8f2] via-[#f3eaf8] to-[#faf5fc]",
];

function productKind(title: string) {
  const key = title.toLowerCase();
  if (/rudraksha/.test(key)) return "Rudraksha";
  if (/yantra/.test(key)) return "Yantra";
  if (/ghee/.test(key)) return "Puja samagri";
  if (/incense|agarbatti|dhoop/.test(key)) return "Incense";
  if (/mala|bead/.test(key)) return "Mala";
  if (/stone|gem|navratna/.test(key)) return "Gem";
  return "Sacred item";
}

function stockLine(availability: string, ready: string, order: string, enquire: string) {
  if (availability === "made_to_order") return order;
  if (availability === "unavailable") return enquire;
  return ready;
}

function notesFor(index: number, t: (key: "store.bless" | "store.courier" | "store.video" | "store.lab" | "store.natural") => string) {
  const pairs = [
    [t("store.bless"), t("store.courier")],
    [t("store.bless"), t("store.video")],
    [t("store.courier"), t("store.lab")],
    [t("store.bless"), t("store.natural")],
  ] as const;
  return pairs[index % pairs.length];
}

function KindGlyph({ kind }: { kind: string }) {
  if (kind === "Rudraksha") {
    return <span className="text-[22px] text-[#b8873a]">◉</span>;
  }
  if (kind === "Yantra") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#b8873a]" fill="none" aria-hidden>
        <rect x="5" y="5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13.5" y="5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="5" y="13.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13.5" y="13.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (kind === "Puja samagri") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#b8873a]" fill="none" aria-hidden>
        <path d="M12 19c3.2-1.4 5-4 5-7.2C17 8 14.6 5.6 12 4 9.4 5.6 7 8 7 11.8 7 15 8.8 17.6 12 19Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#b8873a]" fill="none" aria-hidden>
      <path d="M7 16c1.4-3 2.6-7.5 5-12 2.4 4.5 3.6 9 5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.5 16h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function EyeGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path d="M3.5 12S7 6.8 12 6.8 20.5 12 20.5 12 17 17.2 12 17.2 3.5 12 3.5 12Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ChatGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path d="M5 17.5 6.2 14A7 7 0 1 1 12 19H7.2L5 17.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function BagGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path d="M6.5 8.5h11l.8 10.2a1.6 1.6 0 0 1-1.6 1.7H7.3a1.6 1.6 0 0 1-1.6-1.7L6.5 8.5Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8.4V7.2A3 3 0 0 1 12 4.2 3 3 0 0 1 15 7.2v1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HeartGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 19s-6.2-3.8-8.2-7.3C2.3 9.2 3.4 6 6.4 6c1.7 0 2.8.9 3.6 2 0.8-1.1 1.9-2 3.6-2 3 0 4.1 3.2 2.6 5.7C18.2 15.2 12 19 12 19Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ProductSection({
  products,
  whatsappNumber,
}: {
  products: Product[];
  whatsappNumber: string;
}) {
  const { t } = usePrefs();
  const list = useJuList<Product>("/products", products);
  const cards = list.slice(0, 4);
  if (!cards.length) return null;

  return (
    <section id="store" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute -top-32 right-0 h-[560px] w-[560px] rounded-full bg-[#e5c378]/14 blur-[120px]" />
      <div className={INNER}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-white/85 px-3.5 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C4A227]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A8560]">{t("store.badge")}</span>
            </div>
            <PageHeading className="mt-5" lead={t("store.lead")} accent={t("store.accent")} />
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#5c4a32]">{t("store.copy")}</p>
          </div>
          <Link
            href={PRODUCTS_PATH}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#EAD9B0] bg-white px-4 py-2 text-[13px] font-semibold text-[#6b4a12] shadow-sm transition hover:bg-[#fffdf5]"
          >
            {t("store.view")} <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((product, index) => {
            const title = stripPublicPrices(product.title);
            const summary = stripPublicPrices(product.short_description);
            const src = imageSrc(product.featured_image);
            const loved = index === 0 || index === cards.length - 1;
            const kind = productKind(title);
            const notes = notesFor(index, t);
            const waHref = whatsappNumber
              ? whatsappUrl(whatsappNumber, product.whatsapp_message || `Namaste. I would like to know more about ${title}.`)
              : "";
            return (
              <article
                key={product.id}
                className={`relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#EAD9B0]/80 bg-linear-to-b ${CARDS[index % CARDS.length]} shadow-[0_10px_28px_rgba(30,22,14,0.05)]`}
              >
                <div className="relative px-4 pt-4">
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                        loved ? "bg-[#c9a227] text-[#1A1106]" : "bg-[#d7ead6] text-[#2f6b3a]"
                      }`}
                    >
                      {loved ? `★ ${t("store.loved")}` : `✦ ${t("store.energized")}`}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EAD9B0] bg-white/70 text-[#b8873a]">
                      <HeartGlyph />
                    </span>
                  </div>
                  <div className="mt-6 mb-4 flex justify-center">
                    <div className="relative flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-[22px] border border-white bg-white shadow-[0_8px_20px_rgba(30,22,14,0.08)]">
                      {src ? (
                        <img src={src} alt={title} className="h-full w-full object-cover" />
                      ) : (
                        <KindGlyph kind={kind} />
                      )}
                    </div>
                  </div>
                  <p className="mb-3 text-center">
                    <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-[#7a6448]">
                      {t("store.after")}
                    </span>
                  </p>
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A8560]">{kind}</p>
                    <span className="text-[10px] font-medium text-[#B8A183]">✦ {t("store.service")}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-[20px] leading-snug text-[#1A1106]">{title}</h3>
                  {summary ? <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#6b5a42]">{summary}</p> : null}
                  <p className="mt-2 text-[12px] font-medium text-emerald-700">● {stockLine(product.availability, t("store.ready"), t("store.order"), t("store.enquire"))}</p>
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <Link
                      href={`/product/${product.slug}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#EAD9B0] bg-white/80 px-3 py-2 text-[12px] font-semibold text-[#6b4a12] transition hover:bg-white"
                    >
                      <EyeGlyph /> {t("store.viewBtn")}
                    </Link>
                    {waHref ? (
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#b7cbb4] bg-white/70 px-3 py-2 text-[12px] font-semibold text-[#4a6b4a] transition hover:bg-white"
                      >
                        <ChatGlyph /> {t("store.chat")}
                      </a>
                    ) : null}
                    <ProductEnquiryButton
                      product={product}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#C4A227] px-3 py-2 text-[12px] font-semibold text-[#1A1106] transition hover:brightness-95"
                    >
                      <BagGlyph /> {t("store.buy")}
                    </ProductEnquiryButton>
                  </div>
                  <p className="mt-3 text-[11px] text-[#9A8560]">✓ {notes[0]} · {notes[1]}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
