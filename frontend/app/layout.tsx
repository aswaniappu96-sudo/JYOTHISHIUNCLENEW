import { Suspense } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { UniverseBackground } from "@/components/layout/UniverseBackground";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/api/wordpress";
import { mediaUrl } from "@/lib/api/client";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JyothishiUncle",
    template: "%s · JyothishiUncle",
  },
  description: "Pooja, astrology consultation, and spiritual guidance from Oman.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "JyothishiUncle",
    description: "Pooja, astrology consultation, and spiritual guidance from Oman.",
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
  try {
    settings = await getSettings();
  } catch {
    settings = null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <UniverseBackground />
        {settings ? <JsonLd settings={settings} /> : null}
        <Providers>
          <div className="relative z-10">
            <Header logoUrl={mediaUrl(settings?.logo?.full || settings?.logo?.url || settings?.logo_url) || undefined} />
            <main className="pt-24">
              <Suspense fallback={<div className="min-h-[50vh]" aria-hidden />}>{children}</Suspense>
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
