import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Mukta } from "next/font/google";

import { Analytics } from "@/components/seo/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileDonateBar } from "@/components/layout/MobileDonateBar";
import { WhatsAppChat } from "@/components/layout/WhatsAppChat";
import { getCauses, getSiteSettings } from "@/lib/cms";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

/**
 * Fonts (owner's choice, Nov 2026): Fraunces for headings and titles, Inter for
 * everything else. Neither has Devanagari, so both stacks end in Mukta, which
 * only draws Hindi text and the ₹ sign (see globals.css).
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Hindi only (and ₹) — loaded when such text is on screen, so not preloaded. */
const hindi = Mukta({
  subsets: ["devanagari"],
  weight: ["400"],
  variable: "--font-hindi",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Mumbai NGO for health & education`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "nonprofit",
  openGraph: { type: "website", locale: "en_IN", siteName: SITE_NAME },
  twitter: { card: "summary_large_image", site: "@sarvamangalorg" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#ffffff", // matches the white header
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, causes] = await Promise.all([getSiteSettings(), getCauses()]);

  return (
    <html lang="en-IN" className={`${fraunces.variable} ${inter.variable} ${hindi.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Header causes={causes} donateUrl={settings.donateUrl} phone={settings.contact.phone} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} causes={causes} />
        <MobileDonateBar donateUrl={settings.donateUrl} />
        <WhatsAppChat number={settings.whatsappNumber} />
        <JsonLd data={[organizationJsonLd(settings), websiteJsonLd()]} />
        <Analytics />
      </body>
    </html>
  );
}
