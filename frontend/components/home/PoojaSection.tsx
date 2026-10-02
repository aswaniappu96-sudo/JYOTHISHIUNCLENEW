"use client";

import Link from "next/link";
import { BookPoojaButton } from "@/components/booking/BookPoojaButton";
import { PageHeading } from "@/components/home/SectionHeading";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { imageSrc } from "@/lib/media";
import { POOJAS_PATH } from "@/lib/siteRoutes";
import { useJuList } from "@/lib/useJuList";
import { whatsappUrl } from "@/lib/whatsapp";
import type { Pooja } from "@/types/wordpress";

const INNER = "relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[56px]";

const HEADS = [
  "from-[#f6d7ae] via-[#f8e6c8] to-[#fbf4e6]",
  "from-[#f4d4a4] via-[#f7e3c0] to-[#faf1de]",
  "from-[#f3cfa0] via-[#f6e0bc] to-[#faf0dc]",
  "from-[#efc894] via-[#f5dcb4] to-[#f9ecd4]",
];

const FALLBACKS: Pooja[] = [
  {
    id: 1,
    slug: "ganapathi-homam",
    title: "Ganapathi Homam",
    short_description: "Removes obstacles before new beginnings. Performed with modakam, durva and ghee.",
    featured_image: null,
    display_order: 1,
    full_description: "",
    benefits: "",
    requirements: "",
    gallery: [],
    booking_enabled: true,
    whatsapp_message: "Namaste. I would like to book Ganapathi Homam.",
  },
  {
    id: 2,
    slug: "maha-sudarshana-homam",
    title: "Maha Sudarshana Homam",
    short_description: "For protection from drishti & negativity. Sudarshana chakra mantra with sacred fire.",
    featured_image: null,
    display_order: 2,
    full_description: "",
    benefits: "",
    requirements: "",
    gallery: [],
    booking_enabled: true,
    whatsapp_message: "Namaste. I would like to book Maha Sudarshana Homam.",
  },
  {
    id: 3,
    slug: "maha-mrityunjaya-homam",
    title: "Maha Mrityunjaya Homam",
    short_description: "Healing & longevity homam. Chanting of Tryambakam mantra for health and ayushya.",
    featured_image: null,
    display_order: 3,
    full_description: "",
    benefits: "",
    requirements: "",
    gallery: [],
    booking_enabled: true,
    whatsapp_message: "Namaste. I would like to book Maha Mrityunjaya Homam.",
  },
  {
    id: 4,
    slug: "aghora-homam",
    title: "Aghora Homam",
    short_description: "Intense cleansing for deep karmic blocks. Performed at midnight hora with raksha.",
    featured_image: null,
    display_order: 4,
    full_description: "",
    benefits: "",
    requirements: "",
    gallery: [],
    booking_enabled: true,
    whatsapp_message: "Namaste. I would like to book Aghora Homam.",
  },
];

function poojaLook(title: string) {
  const key = title.toLowerCase();
  if (/ganapathi|ganesha|ganesh/.test(key)) return { deity: "Lord Ganesha", mins: 45, extra: "Samagri included", icon: "star" as const };
  if (/sudarshan/.test(key)) return { deity: "Lord Vishnu", mins: 75, extra: "Priest + Samagri", icon: "sun" as const };
  if (/mrityunjaya|mrityunjay/.test(key)) return { deity: "Lord Shiva", mins: 60, extra: "Sankalpa included", icon: "heart" as const };
  if (/aghora/.test(key)) return { deity: "Aghora Bhairava", mins: 90, extra: "Temple fire kund", icon: "flame" as const };
  return { deity: "Temple rite", mins: 60, extra: "Samagri included", icon: "lamp" as const };
}

function DeityIcon({ kind }: { kind: ReturnType<typeof poojaLook>["icon"] }) {
  const common = "h-7 w-7";
  if (kind === "star") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M12 3.2 13.7 9h6l-4.9 3.5 1.9 5.8L12 14.7 7.3 18.3l1.9-5.8L4.3 9h6L12 3.2Z" stroke="#8B5A2B" strokeWidth="1.4" strokeLinejoin="round" />
        <circle cx="17.6" cy="5.2" r="1.1" fill="#8B5A2B" />
      </svg>
    );
  }
  if (kind === "sun") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <circle cx="12" cy="12" r="3.4" stroke="#8B5A2B" strokeWidth="1.5" />
        <path d="M12 4.2v1.6M12 18.2v1.6M4.2 12h1.6M18.2 12h1.6M6.4 6.4l1.1 1.1M16.5 16.5l1.1 1.1M17.6 6.4l-1.1 1.1M7.5 16.5l-1.1 1.1" stroke="#8B5A2B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M12 19s-7-4.4-7-9.1C5 7.2 6.8 5.5 9 5.5c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.7 4 4.4C19 14.6 12 19 12 19Z" stroke="#8B5A2B" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "flame") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M12 20c3.4 0 5.5-2.4 5.5-5.4 0-3.4-2.6-5.6-3.7-8.1-.3-.6-1.3-.5-1.5.2C11.8 8.4 11 10 10.2 10c-.5 0-.8-.6-1.2-1.2C8.4 7.8 7.2 8.6 6.8 10.2 6.2 12.4 6.6 20 12 20Z" stroke="#8B5A2B" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
      <path d="M12 4.5c1.4 2.2 2.2 3.8 2.2 5.4A2.2 2.2 0 0 1 12 12.1 2.2 2.2 0 0 1 9.8 9.9c0-1.6.8-3.2 2.2-5.4Z" stroke="#8B5A2B" strokeWidth="1.5" />
      <path d="M8 14.5c1.2 2.6 2.4 3.8 4 3.8s2.8-1.2 4-3.8" stroke="#8B5A2B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v4.2l2.6 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <rect x="5" y="4.5" width="14" height="15" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8.5h8M8 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.8v3.4M16 3.8v3.4M4 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChatGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M5 17.5 6.2 14A7 7 0 1 1 12 19H7.2L5 17.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function PoojaSection({ poojas, whatsappNumber = "" }: { poojas: Pooja[]; whatsappNumber?: string }) {
  const { t } = usePrefs();
  const list = useJuList<Pooja>("/poojas", poojas);
  const cards = (list.length ? list : FALLBACKS).slice(0, 4);
  const chatHref = whatsappNumber.trim()
    ? whatsappUrl(whatsappNumber, "Namaste. I would like to ask about a temple pooja.")
    : "";

  return (
    <section id="poojas" className="relative w-full overflow-hidden scroll-mt-36 py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[#e5c378]/16 blur-[120px]" />

      <div className={INNER}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EAD9B0] bg-white/85 px-3.5 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C4A227]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A8560]">{t("pooja.badge")}</span>
            </div>
            <PageHeading className="mt-5" lead={t("pooja.lead")} accent={t("pooja.accent")} />
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#5c4a32]">{t("pooja.copy")}</p>
          </div>
          <Link
            href={POOJAS_PATH}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#EAD9B0] bg-white px-4 py-2 text-[13px] font-semibold text-[#6b4a12] shadow-sm transition hover:bg-[#fffdf5]"
          >
            {t("pooja.view")} <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((pooja, index) => {
            const look = poojaLook(pooja.title);
            const src = imageSrc(pooja.featured_image);
            return (
              <article
                key={pooja.id}
                className="flex h-full flex-col overflow-hidden rounded-[22px] border border-[#EAD9B0] bg-white shadow-[0_8px_24px_rgba(30,22,14,0.05)]"
              >
                <div className={`relative h-[132px] overflow-hidden bg-linear-to-b ${HEADS[index % HEADS.length]}`}>
                  {src ? <img src={src} alt={pooja.title} className="absolute inset-0 h-full w-full object-cover" /> : null}
                  <div className={`absolute inset-0 bg-linear-to-b ${HEADS[index % HEADS.length]} ${src ? "opacity-30" : ""}`} />
                  {index === 0 ? (
                    <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#1E160E] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FBF0D9]">
                      ★ {t("pooja.booked")}
                    </span>
                  ) : null}
                  <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    </span>
                    {t("pooja.live")}
                  </span>
                  {!src ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#F0DEB3] bg-[#FFF8EC] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                        <DeityIcon kind={look.icon} />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium text-[#9A8560]">
                    <span className="h-1 w-1 rounded-full bg-[#C4A227]" />
                    {look.deity}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[#7a6448]">
                    <ClockGlyph />
                    {t("pooja.mins", { n: look.mins })} · {look.extra}
                  </p>
                  <h3 className="mt-2 font-serif text-[20px] leading-snug text-[#1A1106]">{pooja.title}</h3>
                  {pooja.short_description ? (
                    <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-[#6b5a42]">{pooja.short_description}</p>
                  ) : null}
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <Link
                      href={`/pooja/${pooja.slug}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#EAD9B0] bg-white px-3 py-2 text-[12px] font-semibold text-[#6b4a12] transition hover:bg-[#fffdf5]"
                    >
                      <BookGlyph /> {t("pooja.read")}
                    </Link>
                    <BookPoojaButton
                      pooja={pooja}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#C4A227] px-3 py-2 text-[12px] font-semibold text-[#1A1106] transition hover:brightness-95"
                    >
                      <CalendarGlyph /> {t("pooja.book")}
                    </BookPoojaButton>
                    {chatHref ? (
                      <a
                        href={chatHref}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="WhatsApp"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EAD9B0] text-[#6b4a12] transition hover:bg-[#fffdf5]"
                      >
                        <ChatGlyph />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-[#EAD9B0] bg-white px-4 py-2.5 text-[12px] text-[#6b5a42] shadow-sm">
            <span className="inline-flex items-center gap-1.5">✓ {t("pooja.foot1")}</span>
            <span className="hidden h-3 w-px bg-[#EAD9B0] sm:block" />
            <span className="inline-flex items-center gap-1.5">◉ {t("pooja.foot2")}</span>
            <span className="hidden h-3 w-px bg-[#EAD9B0] sm:block" />
            <span className="inline-flex items-center gap-1.5">✦ {t("pooja.foot3")}</span>
            <span className="hidden h-3 w-px bg-[#EAD9B0] sm:block" />
            <span className="inline-flex items-center gap-1.5">✓ {t("pooja.foot4")}</span>
          </div>
          <p className="text-[12px] text-[#9A8560] lg:ml-2">{t("pooja.note")}</p>
        </div>
      </div>
    </section>
  );
}
