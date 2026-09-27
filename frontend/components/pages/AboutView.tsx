import Link from "next/link";
import { AboutMantraCta } from "@/components/pages/AboutMantraCta";
import { BookConsultationButton } from "@/components/portal/BookConsultationButton";
import { Eyebrow } from "@/components/pages/PageHero";
import { imageSrc } from "@/lib/media";
import type { WPPage } from "@/types/wordpress";

const PORTRAIT = "/images/about-portrait.jpg";
const HOMAM =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbWL3okzkn5bZg1MCUYym3qKo4bQQTQPlPXLbT6d1x9RWPa5sTlCq_b_-f1erDJfDWDoMb6vptFclDzhHSyqVP9IaAVKzvsBJUumDsI6J5F1JBb1Wlq1rSAXVErXWkSf0ME7OgwEkXDS_V2m3wHTS9IqaLyafkga0XEEdmfPuLA5igFfy5OWiYvTsIGHlMA5HIboICnaxpUx4bSUoZF6K6v9b43IdxK9WDFvLW7rYYgeofbUUKoRVQ-w";
const NAVAGRAHA =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDCgwpvhr-e9ByB50W7ZvTkF3HsnIsNn6yug0Reu4zvdaiOupYnI9wV_jmQ-d9F7RCQs6TUE8Qxy4JUw-wttIcsLLiVKpJq53SZF0PjiYobwpt2yuMGzEOL9Iml7njUi-xd7MMmlc767ENOFJyJR58aNZ0ESXCCRXUYP7k-QhBgUlLoc6pTprpZgR2x9mHfAGP1EQU6fD8dAJBBV5dZDKaBpzUOFaMRMfQXXAI_k5jBbBBnknASDWx8w";

const ROOTS = [
  ["PARASHARA HORA", "Vedic Astrology Foundation"],
  ["JAIMINI SUTRAS", "Chara Dasha Nuances"],
  ["VEDIC THALIOLA", "Palm Leaf Prashna Marga"],
  ["GURUVAYUR DIKSHA", "Tantric Agni Vidya"],
];

const STATS = [
  ["35+", "Years Sadhana", "Bharat & Himalaya"],
  ["48k+", "Seekers Guided", "Across 42 Nations"],
  ["108+", "Vedic Homams", "Consecrated Rites"],
  ["100%", "Ethical Secrecy", "Direct Counsel"],
];

const STEPS = [
  ["01 · ASTRONOMICAL AUDIT", "Chart Mathematical Sync", "Precise degrees calculated using Surya Siddhanta aligned with modern high-precision planetary ephemerides."],
  ["02 · INDIVIDUAL SANKALPA", "Energetic Cord Binding", "Your lineage name, Gotra, birth star, and present transit location are formally offered to the cosmic deities."],
  ["03 · MANTRA VIBRATION", "Vedic Sound Frequency", "Consecrated priests chant Beeja syllables strictly adhering to musical Vedic Svara intonations for harmonic effect."],
  ["04 · ENERGIZED DELIVERY", "Sanctified Bhasma & Yantra", "Consecrated sacred ash, blessed silver/copper talisman, and ritual cord dispatched to your doorstep globally."],
];

const PILLARS = [
  ["PILLAR I", "Truth Without Fear", "We strictly condemn the weaponization of astrological “curses” (Kaal Sarp, Sade Sati) to induce anxiety. We provide objective, empowering perspective.", "EMPOWERMENT OVER DREAD", "primary"],
  ["PILLAR II", "Astronomical Precision", "Zero algorithmic guesswork. We synthesize classic Lahiri Ayanamsha with calibrated planetary positions for down-to-the-minute accuracy.", "TRUE CELESTIAL ALIGNMENT", "secondary"],
  ["PILLAR III", "Karmic Realignment", "Remedies focus on lifestyle, conscious charitable deeds (Daan), and genuine sound vibrations—never overpriced superstitious trinkets.", "AUTHENTIC REMEDIES ONLY", "primary"],
  ["PILLAR IV", "Sanctuary Privacy", "Your birth charts, queries, and video sessions are strictly confidential between you and Jyothishi Uncle. We maintain sacred client secrecy.", "SACRED CONFIDENTIALITY", "secondary"],
];

const READINGS = [
  ["Complete Kundali Reading", "60 Mins · Life Path & Dasha"],
  ["Marriage / Jathaka Matching", "Compatibility & muhurta"],
  ["Prashna (Urgent Query)", "Immediate celestial inquiry"],
  ["Yearly Transit Forecast", "3-year dasha timelines"],
];

export function AboutView({ page }: { page: WPPage | null }) {
  const portrait = imageSrc(page?.featured_image, PORTRAIT);
  const ritual1 = imageSrc(page?.image_1, HOMAM);
  const ritual2 = imageSrc(page?.image_2, NAVAGRAHA);
  const customTitle = page?.title && !/^about( us)?$/i.test(page.title) ? page.title : null;
  const cmsHtml = page?.content && !/This is sample copy/i.test(page.content) ? page.content : undefined;

  return (
    <div>
      <section className="relative overflow-hidden px-4 pt-8 pb-16 text-center md:px-12">
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
          <Eyebrow className="mb-6">{page?.eyebrow || "Guru-Shishya Parampara · Vedic Lineage"}</Eyebrow>
          <h1 className="max-w-4xl font-serif text-[38px] leading-[46px] tracking-tight text-on-surface md:text-[56px] md:leading-[68px]">
            {customTitle || (
              <>
                The Unbroken Lineage of <span className="italic text-primary">Stellar Seers</span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            {page?.hero_copy ||
              "Deep in the celestial soils of ancient Bharat, wisdom descends like golden light. From Sage Parashara to the palm leaf Thaliola masters, our lineage is rooted in eternal cosmic mathematics."}
          </p>
          <div className="relative mt-12 flex w-full max-w-3xl flex-col items-center">
            <svg className="h-44 w-full overflow-visible text-primary opacity-85" fill="none" viewBox="0 0 800 200">
              <defs>
                <radialGradient id="rootGlow" cx="50%" cy="0%" r="80%">
                  <stop offset="0%" stopColor="#ffe09d" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#cabeff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#fffbf3" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="rootGoldLine" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffe09d" />
                  <stop offset="70%" stopColor="#e5c378" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#4829b3" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <circle className="animate-pulse" cx="400" cy="10" fill="url(#rootGlow)" r="16" />
              <circle cx="400" cy="10" fill="#ffe09d" r="4" />
              <path d="M400 10 C400 60, 360 80, 240 120 C180 140, 110 150, 40 190" stroke="url(#rootGoldLine)" strokeDasharray="6 3" strokeWidth="2" />
              <path d="M400 10 C390 70, 310 90, 290 140 C270 170, 210 185, 170 195" stroke="url(#rootGoldLine)" strokeWidth="2" />
              <path d="M400 10 C400 80, 390 120, 380 195" stroke="url(#rootGoldLine)" strokeWidth="2.5" />
              <path d="M400 10 C400 80, 410 120, 420 195" stroke="url(#rootGoldLine)" strokeWidth="2.5" />
              <path d="M400 10 C410 70, 490 90, 510 140 C530 170, 590 185, 630 195" stroke="url(#rootGoldLine)" strokeWidth="2" />
              <path d="M400 10 C400 60, 440 80, 560 120 C620 140, 690 150, 760 190" stroke="url(#rootGoldLine)" strokeDasharray="6 3" strokeWidth="2" />
              <circle cx="240" cy="120" fill="#ffe09d" r="5" />
              <circle cx="560" cy="120" fill="#ffe09d" r="5" />
              <circle cx="170" cy="195" fill="#cabeff" r="4" />
              <circle cx="380" cy="195" fill="#cabeff" r="4" />
              <circle cx="420" cy="195" fill="#cabeff" r="4" />
              <circle cx="630" cy="195" fill="#cabeff" r="4" />
              <circle cx="40" cy="190" fill="#ffe09d" r="3" />
              <circle cx="760" cy="190" fill="#ffe09d" r="3" />
            </svg>
            <div className="-mt-2 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
              {ROOTS.map(([title, copy]) => (
                <div key={title} className="flex flex-col items-center rounded-xl bg-surface-low/60 p-3 text-center backdrop-blur-md">
                  <span className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{title}</span>
                  <span className="text-xs text-on-surface-variant">{copy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl bg-linear-to-b from-primary/30 via-secondary-container/20 to-surface-lowest p-2 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_-5px_rgba(229,195,120,0.25)]">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <img alt={page?.portrait_name || "Jyothishi Uncle portrait"} className="h-full w-full object-cover object-center" src={portrait} />
                <div className="absolute inset-0 bg-linear-to-t from-surface-lowest/90 via-surface-lowest/20 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-surface-lowest/80 px-3 py-1 backdrop-blur-md">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Guruvayur Diksha</span>
                </div>
                <div className="absolute right-4 bottom-4 left-4 rounded-xl bg-surface-high/80 p-4 backdrop-blur-xl">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-serif text-[22px] text-primary">{page?.portrait_name || "Sri Devadathan Namboothiri"}</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">ESTD. 1989</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {page?.portrait_caption || "“Jyothishi Uncle” — Chief Custodian of Jyotishya Marga & Vedic Astral Mechanics."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6 lg:col-span-7">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">The Oracle Behind the Sight</span>
            </div>
            <h2 className="font-serif text-[30px] leading-tight text-on-surface md:text-[40px]">
              Ancient Wisdom. Personal Guidance.{" "}
              <span className="italic text-primary">No Fear. Absolute Clarity.</span>
            </h2>
            <p className="text-base leading-relaxed text-on-surface-variant">
              For more than thirty-five years, Sri Devadathan (fondly sought as Jyothishi Uncle) has walked the sacred
              nexus where Vedic scripture meets mathematical astronomy. Initiated at age eleven in the sacred sanctums,
              he mastered the rare discipline of <span className="font-medium text-primary">Ashtamangala Deva Prashnam</span>{" "}
              alongside ancient palm-leaf ephemerides.
            </p>
            <p className="text-sm leading-relaxed text-on-surface-variant/90">
              Rejecting fatalistic dread and modern commercial exploitation, his approach is profoundly compassionate:
              Jyotishya is not a decree of helpless fate; it is a celestial navigational lamp. By identifying specific
              planetary resonances, karmic friction is mitigated through exact energetic counter-frequencies—sacred fire
              homams, Vedic mantras, and conscious ethical conduct.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
              {STATS.map(([n, label, note]) => (
                <div key={label} className="flex flex-col rounded-xl bg-surface-container p-4 shadow-sm">
                  <span className="mb-1 font-serif text-[32px] leading-none text-primary">{n}</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">{label}</span>
                  <span className="mt-1 text-xs text-outline">{note}</span>
                </div>
              ))}
            </div>
            <div className="relative flex items-start gap-4 rounded-xl bg-surface-low p-5 shadow-[0_0_25px_rgba(72,41,179,0.15)]">
              <span className="shrink-0 text-3xl text-primary/70">“</span>
              <p className="text-sm italic text-on-surface">
                Planets do not curse; they simply hold mirrors to our unspent karma. Through precise Shastric remedies
                and righteous action, even the heaviest planetary eclipse turns into an awakening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {cmsHtml ? (
        <article className="prose-ju mx-auto max-w-3xl px-5 pb-8" dangerouslySetInnerHTML={{ __html: cmsHtml }} />
      ) : null}

      <section className="relative w-full bg-surface-lowest/60 py-20">
        <div className="mx-auto flex max-w-7xl flex-col space-y-12 px-4 md:px-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Agni Kund & Tantric Vidya</span>
              </div>
              <h2 className="font-serif text-[30px] text-on-surface md:text-[40px]">
                Authentic Shastric Rituals & <span className="italic text-primary">Planetary Remediation</span>
              </h2>
              <p className="text-sm text-on-surface-variant">
                Remedies at JyothishiUncle are never symbolic tokens. They are sacred, mathematically synchronized Vedic
                invocations performed by traditionally consecrated priests in adherence to the Rigveda and Agamas.
              </p>
            </div>
            <Link href="/services#pooja" className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary hover:brightness-95">
              Explore Ritual Schedule →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <article className="flex flex-col overflow-hidden rounded-2xl bg-surface-low shadow-xl">
              <div className="relative h-80 overflow-hidden">
                <img alt={page?.image_1_title || "Maha Mrityunjaya fire homam"} className="h-full w-full object-cover" src={ritual1} />
                <div className="absolute inset-0 bg-linear-to-t from-surface-low via-surface-low/30 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-surface-lowest/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-md">
                  Maha Agni Hotra
                </span>
                <span className="absolute bottom-4 left-4 font-serif text-[22px] text-on-surface">{page?.image_1_title || "Maha Mrityunjaya & Navagraha Homam"}</span>
              </div>
              <div className="flex flex-col space-y-4 p-6">
                <p className="text-sm text-on-surface-variant">
                  {page?.image_1_copy ||
                    "Performed at the Brahmamuhurtha, holy Samidha wood, Desi Cow Ghee, and 108 medicinal herbs are offered into the blazing Agni. Every ritual includes your individual Sankalpa with Nakshatra, Gotra, and Rashi chanted verbatim."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Individual Sankalpa", "1008 Beeja Japas", "Global Prasadam Dispatch"].map((tag) => (
                    <span key={tag} className="rounded-full bg-surface-container px-2.5 py-1 text-xs text-secondary">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
            <article className="flex flex-col overflow-hidden rounded-2xl bg-surface-low shadow-xl">
              <div className="relative h-80 overflow-hidden">
                <img alt={page?.image_2_title || "Navagraha planetary deities"} className="h-full w-full object-cover" src={ritual2} />
                <div className="absolute inset-0 bg-linear-to-t from-surface-low via-surface-low/30 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-surface-lowest/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-md">
                  Navagraha Sanctum
                </span>
                <span className="absolute bottom-4 left-4 font-serif text-[22px] text-on-surface">{page?.image_2_title || "Planetary Prana Pratishtha"}</span>
              </div>
              <div className="flex flex-col space-y-4 p-6">
                <p className="text-sm text-on-surface-variant">
                  {page?.image_2_copy ||
                    "Targeted planetary pacification addressing Sade Sati, Rahu-Ketu doshas, and Manglik afflictions. Idols are energized through ancient Abhishekam with Panchamritam, accompanied by sacred Yantras blessed directly by Jyothishi Uncle."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Panchamrit Abhishekam", "Consecrated Raksha Sootra", "Copper Yantra Seal"].map((tag) => (
                    <span key={tag} className="rounded-full bg-surface-container px-2.5 py-1 text-xs text-primary">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          </div>
          <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([k, title, copy]) => (
              <div key={k} className="flex flex-col space-y-2 rounded-xl bg-surface-container p-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{k}</span>
                <span className="text-lg font-semibold text-on-surface">{title}</span>
                <p className="text-xs text-on-surface-variant">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-20 md:px-12">
        <div className="mx-auto mb-16 flex max-w-3xl flex-col items-center text-center">
          <Eyebrow className="mb-4">The Sacred Covenant</Eyebrow>
          <h2 className="mb-3 font-serif text-[30px] text-on-surface md:text-[40px]">
            The Four Pillars of <span className="italic text-primary">JyothishiUncle</span>
          </h2>
          <p className="text-base text-on-surface-variant">Our foundational promise to every seeker entering this digital sanctuary of light.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(([k, title, copy, footer, tone]) => (
            <article key={k} className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface-high/60 p-6 shadow-lg backdrop-blur-xl transition hover:bg-surface-highest">
              <div className="flex flex-col space-y-3">
                <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${tone === "secondary" ? "text-secondary" : "text-primary"}`}>{k}</span>
                <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
                <p className="text-sm text-on-surface-variant">{copy}</p>
              </div>
              <div className={`mt-6 pt-4 text-[11px] font-bold uppercase tracking-[0.18em] ${tone === "secondary" ? "text-secondary" : "text-primary"}`}>
                {footer}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="booking-sanctuary" className="relative mx-auto max-w-7xl px-4 py-20 md:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-surface-high via-surface-container to-surface-lowest p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] md:p-14">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-between lg:col-span-5">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-container/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  ● Live 1-on-1 Oracle Audience
                </div>
                <h2 className="font-serif text-[30px] leading-snug text-on-surface md:text-[40px]">
                  Seek the Council of the <span className="italic text-primary">Cosmos</span>
                </h2>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Book a private, deep-dive session with Jyothishi Uncle. Receive an in-depth analysis of your Natal
                  Kundali, planetary dasha cycles, and immediate actionable remedies.
                </p>
                <div className="space-y-3 pt-3">
                  {[
                    "Complete Natal Chart (Lagna, Navamsha & D10)",
                    "Upcoming 3-Year Dasha & Transit Timelines",
                    "Personalized Vedic Homam & Mantra Prescriptions",
                    "Secure Audio/Video Recording Provided",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-on-surface">
                      <span className="text-primary">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex items-center gap-4 rounded-xl bg-surface-lowest/70 p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">ॐ</div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-on-surface">Consecrated Auspicious Timings</span>
                  <span className="text-xs text-on-surface-variant">Synchronized with seeker&apos;s local planetary hour (Hora)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-6 rounded-2xl bg-surface-low/90 p-6 shadow-xl backdrop-blur-xl md:p-8 lg:col-span-7">
              <div>
                <span className="font-serif text-[22px] text-primary">Sanctuary Reservation Form</span>
                <p className="text-xs text-on-surface-variant">Enter your planetary coordinates in the consultation portal. Fees are shared privately.</p>
              </div>
              <div className="space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Select Reading Discipline</span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {READINGS.map(([title, note], i) => (
                    <div key={title} className={`rounded-xl p-3.5 ${i === 0 ? "bg-primary-container text-on-primary" : "bg-surface-container text-on-surface"}`}>
                      <span className="block text-sm font-semibold">{title}</span>
                      <span className="text-xs opacity-90">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
              <BookConsultationButton className="inline-flex w-full items-center justify-center rounded-full bg-primary-container py-3 text-sm font-bold text-on-primary shadow-[0_0_24px_rgba(229,195,120,0.4)] hover:brightness-95">
                Open Consultation Calendar
              </BookConsultationButton>
            </div>
          </div>
        </div>
      </section>

      <AboutMantraCta />
    </div>
  );
}
