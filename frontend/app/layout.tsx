import { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageLoading } from "@/components/layout/PageLoading";
import { MandalaTrail } from "@/components/layout/MandalaTrail";
import { UniverseBackground } from "@/components/layout/UniverseBackground";
import { RashiChakraBackdrop } from "@/components/home/RashiChakraWatermark";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAstrologers, getServices, getSettings, settleApi } from "@/lib/api/wordpress";
import { mediaUrl } from "@/lib/api/client";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const INDIC_FONTS =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Kannada:wght@400;600;700&family=Noto+Sans+Malayalam:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&family=Noto+Serif+Devanagari:wght@500;600&display=swap";

export const metadata: Metadata = {
  title: {
    default: "JyothishiUncle",
    template: "%s · JyothishiUncle",
  },
  description: "Pooja, astrology consultation, and spiritual guidance worldwide.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "JyothishiUncle",
    description: "Pooja, astrology consultation, and spiritual guidance worldwide.",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  let services: Awaited<ReturnType<typeof getServices>> = [];
  let astrologers: Awaited<ReturnType<typeof getAstrologers>> = [];
  try {
    [settings, services, astrologers] = await Promise.all([
      getSettings(),
      settleApi(getServices(), []),
      settleApi(getAstrologers(), []),
    ]);
  } catch {
    settings = null;
    services = [];
    astrologers = [];
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={INDIC_FONTS} rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("ju_theme");if(t==="dark")document.documentElement.classList.add("dark");var l=localStorage.getItem("ju_lang");if(l){document.documentElement.lang=l;document.documentElement.dataset.lang=l;}}catch(e){}`,
          }}
        />
      </head>
      <body className={`${jakarta.variable} antialiased`} suppressHydrationWarning>
        <UniverseBackground />
        <RashiChakraBackdrop />
        <MandalaTrail />
        {settings ? <JsonLd settings={settings} /> : null}
        <Providers>
          <div className="relative z-10">
            <Suspense fallback={<header className="fixed top-0 z-50 h-[10.5rem] w-full bg-surface-lowest/95" />}>
              <Header
                logoUrl={mediaUrl(settings?.logo?.full || settings?.logo?.url || settings?.logo_url) || undefined}
                services={services}
                astrologers={astrologers}
                phone={settings?.phone_number}
                whatsapp={settings?.whatsapp_number}
                instagram={settings?.social_instagram}
                facebook={settings?.social_facebook}
                youtube={settings?.social_youtube}
              />
            </Suspense>
            <main className="ju-main pt-[10.5rem]">
              <Suspense fallback={<PageLoading message="Opening page…" />}>{children}</Suspense>
            </main>
            <Footer
              text={settings?.footer_text}
              address={settings?.address}
              phone={settings?.phone_number}
              instagram={settings?.social_instagram}
              facebook={settings?.social_facebook}
              youtube={settings?.social_youtube}
              logoUrl={mediaUrl(settings?.logo?.full || settings?.logo?.url || settings?.logo_url) || undefined}
            />
          </div>
          {settings ? (
            <WhatsAppButton
              number={settings.whatsapp_number}
              message="Hello, I would like to know more about JyothishiUncle services."
            />
          ) : null}
        </Providers>
      </body>
    </html>
  );
}
