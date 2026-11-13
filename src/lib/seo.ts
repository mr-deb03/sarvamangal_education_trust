import type { Metadata } from "next";

import type { CampEvent, Faq, SiteSettings } from "@/lib/cms/types";
import { formatPlace } from "@/lib/format";
import { FOUNDING_YEAR, ROUTES, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Per-page metadata. Next merges `openGraph` shallowly, so every page sets the
 * whole block through this helper rather than relying on the layout's.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  /** Share image (e.g. a camp's cover photo); the site-wide one is used otherwise. */
  image?: { src: string; alt: string };
}): Metadata {
  const images = image ? [{ url: image.src, alt: image.alt }] : undefined;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: "@sarvamangalorg",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

// ── JSON-LD ─────────────────────────────────────────────────────────
// Nodes cross-reference the organisation by @id instead of repeating it, and
// assert nothing the page does not also say visibly.

export const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationJsonLd(settings: SiteSettings) {
  const { contact, legal } = settings;
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": ORG_ID,
    name: SITE_NAME,
    // Both names appear on the trust's own camp banners.
    alternateName: ["Sarvamangal Foundation", "SMET"],
    url: SITE_URL,
    logo: `${SITE_URL}/brand/sarvamangal-logo.png`,
    image: `${SITE_URL}/images/children-notebook-distribution.jpg`,
    description: SITE_DESCRIPTION,
    foundingDate: String(FOUNDING_YEAR),
    email: contact.email,
    telephone: contact.phone.replace(/\s/g, ""),
    taxID: legal.pan,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.addressLines.join(", "),
      addressLocality: `${contact.locality}, ${contact.city}`,
      addressRegion: contact.state,
      ...(contact.postalCode ? { postalCode: contact.postalCode } : {}),
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "City", name: "Mumbai" },
      { "@type": "State", name: "Maharashtra" },
    ],
    knowsAbout: [
      "Free medical camps",
      "Blood donation drives",
      "Notebook distribution for schoolchildren",
      "Career guidance",
      "Exam anxiety counselling",
      "Yoga and meditation",
    ],
    sameAs: settings.socials.map((s) => s.url),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Keep a meta description within what Google shows (about 160 characters). */
export function clampDescription(text: string, max = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, clean.lastIndexOf(" ", max - 1)).replace(/[,;:—–-]$/, "")}…`;
}

export function eventJsonLd(e: CampEvent) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    url: `${SITE_URL}${ROUTES.event(e.slug)}`,
    startDate: e.startDate,
    ...(e.endDate ? { endDate: e.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    ...(e.summary ? { description: e.summary } : {}),
    ...(e.coverImage ? { image: [absoluteUrl(e.coverImage.src)] } : {}),
    location: {
      "@type": "Place",
      name: e.venue ?? formatPlace(e),
      address: {
        "@type": "PostalAddress",
        ...(e.locality ? { streetAddress: e.locality } : {}),
        ...(e.city ? { addressLocality: e.city } : {}),
        addressRegion: e.state,
        addressCountry: "IN",
      },
    },
    organizer: { "@id": ORG_ID },
  };
}

function absoluteUrl(src: string) {
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}
