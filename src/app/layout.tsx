import type { Metadata, Viewport } from "next";
import { Eczar, Mukta } from "next/font/google";

import { Analytics } from "@/components/seo/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileDonateBar } from "@/components/layout/MobileDonateBar";
import { getCauses, getSiteSettings } from "@/lib/cms";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

/** Display: Eczar — Latin + Devanagari, by Indian type designer Vaibhav Singh. */
const eczar = Eczar({
  subsets: ["latin", "devanagari"],
  variable: "--font-eczar",
  display: "swap",
});

/** Body: Mukta (Ek Type). Devanagari subset also carries the ₹ sign. */
const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "600"],
  variable: "--font-mukta",
  display: "swap",
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
    <html lang="en-IN" className={`${eczar.variable} ${mukta.variable}`}>
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
        <JsonLd data={[organizationJsonLd(settings), websiteJsonLd()]} />
        <Analytics />
      </body>
    </html>
  );
}
