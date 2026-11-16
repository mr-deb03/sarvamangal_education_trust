import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Mukta } from "next/font/google";
import { Suspense } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileDonateBar } from "@/components/layout/MobileDonateBar";
import { WhatsAppChat } from "@/components/layout/WhatsAppChat";
import { Analytics } from "@/components/seo/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCauses, getCopy, getSiteSettings } from "@/lib/cms";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE_URL, absoluteUrl } from "@/lib/site";

import "./globals.css";

/**
 * Fonts (owner's choice, Nov 2026): Fraunces for headings and titles, Inter for
 * everything else. Mukta draws the large Hindi type in the Give section only
 * (`.hindi-type`), only once that section is near; see globals.css for why it isn't in the main stacks.
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

/** The Give section's Hindi quote and watermark — fetched when that section renders, so not preloaded. */
const hindi = Mukta({
  subsets: ["devanagari"],
  weight: ["400"],
  variable: "--font-mukta",
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { identity } = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: identity.homeTitle, template: `%s · ${identity.siteName}` },
    description: identity.description,
    applicationName: identity.siteName,
    category: "nonprofit",
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: identity.siteName,
      images: [{ url: absoluteUrl(identity.shareImage.src), alt: identity.shareImage.alt }],
    },
    twitter: { card: "summary_large_image", ...(identity.twitterHandle ? { site: identity.twitterHandle } : {}) },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff", // matches the white header
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, causes, copy] = await Promise.all([getSiteSettings(), getCauses(), getCopy()]);
  const { layout, labels } = copy;

  return (
    <html lang="en-IN" className={`${fraunces.variable} ${inter.variable} ${hindi.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {layout.skipToContent}
        </a>
        <Header settings={settings} causes={causes} copy={copy} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} causes={causes} copy={copy} />
        {/* It reads the route to re-check the page's Donate sections; keeps the rest of the layout static. */}
        <Suspense fallback={null}>
          <MobileDonateBar donateUrl={settings.donateUrl} label={layout.donateBar} />
        </Suspense>
        <WhatsAppChat
          number={settings.whatsappNumber}
          text={{ ...layout.whatsapp, button: labels.accessibility.whatsappButton, close: labels.accessibility.whatsappClose }}
        />
        <JsonLd data={[organizationJsonLd(settings), websiteJsonLd(settings.identity)]} />
        <Analytics />
      </body>
    </html>
  );
}
