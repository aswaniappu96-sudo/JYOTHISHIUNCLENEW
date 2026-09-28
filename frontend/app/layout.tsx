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
import { getSettings } from "@/lib/api/wordpress";
import { mediaUrl } from "@/lib/api/client";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

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
  try {
    settings = await getSettings();
  } catch {
    settings = null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} antialiased`} suppressHydrationWarning>
        <UniverseBackground />
        <RashiChakraBackdrop />
        <MandalaTrail />
        {settings ? <JsonLd settings={settings} /> : null}
        <Providers>
          <div className="relative z-10">
            <Suspense fallback={<header className="fixed top-0 z-50 h-20 w-full bg-[#fffbf4]/95" />}>
              <Header logoUrl={mediaUrl(settings?.logo?.full || settings?.logo?.url || settings?.logo_url) || undefined} />
            </Suspense>
            <main className="pt-20">
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
