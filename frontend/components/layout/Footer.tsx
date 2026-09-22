import Link from "next/link";

export function Footer({
  text,
  address,
  phone,
  instagram,
  facebook,
  youtube,
  logoUrl,
}: {
  text?: string;
  address?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  logoUrl?: string;
}) {
  return (
    <footer className="relative z-10 mt-12 w-full bg-surface-lowest/90 pb-8 pt-16 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Sacred Gayatri Invocation</span>
          <blockquote className="max-w-3xl font-serif text-xl italic text-on-surface md:text-2xl">
            ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥
          </blockquote>
          <p className="mt-2 text-sm text-on-surface-variant">
            May divine cosmic luminescence awaken intuitive consciousness across planetary realms.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-4">
          <div className="space-y-3">
            {logoUrl && !logoUrl.includes("placeholder") ? (
              <div className="flex h-16 items-center overflow-hidden">
                <img
                  src={logoUrl}
                  alt="JyothishiUncle"
                  className="h-[320%] w-auto max-w-none shrink-0 object-contain brightness-125"
                />
              </div>
            ) : (
              <p className="font-serif text-xl text-primary">JyothishiUncle</p>
            )}
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {text || "Transmitting unbroken Surya Siddhanta precision and ancestral guidance to conscious souls worldwide."}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-primary">Celestial Portals</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link className="hover:text-primary" href="/">Home</Link></li>
              <li><Link className="hover:text-primary" href="/services">Pooja</Link></li>
              <li><Link className="hover:text-primary" href="/services#products">Products</Link></li>
              <li><Link className="hover:text-primary" href="/astrologers">Astrologers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-primary">Sacred Knowledge</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link className="hover:text-primary" href="/blog">Articles</Link></li>
              <li><Link className="hover:text-primary" href="/religious-travel">Travel</Link></li>
              <li><Link className="hover:text-primary" href="/about">About</Link></li>
              <li><Link className="hover:text-primary" href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-primary">Sanctuary</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>{address || "Muscat, Oman"}</li>
              {phone ? <li>{phone}</li> : null}
              <li><Link className="hover:text-primary" href="/privacy-policy">Privacy</Link></li>
              <li><Link className="hover:text-primary" href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-outline-variant/30 pt-6 text-center text-xs text-on-surface-variant sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} JyothishiUncle. All sacred geometries reserved.</p>
          <div className="flex gap-4 text-sm text-primary">
            {instagram ? <a href={instagram} target="_blank" rel="noreferrer">Instagram</a> : null}
            {facebook ? <a href={facebook} target="_blank" rel="noreferrer">Facebook</a> : null}
            {youtube ? <a href={youtube} target="_blank" rel="noreferrer">YouTube</a> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
