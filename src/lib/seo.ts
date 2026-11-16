import type { Metadata } from "next";

import type { CampEvent, CopyImage, Faq, Identity, SiteSettings } from "@/lib/cms/types";
import { formatPlace } from "@/lib/format";
import { ROUTES, SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * Per-page metadata. Next merges `openGraph` shallowly, so every page sets the
 * whole block through this helper rather than relying on the layout's — and
 * always with an image: the page's own, or the share photo from Site settings.
 */
export function pageMetadata({
  title,
  description,
  path,
  identity,
  absoluteTitle = false,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  identity: Identity;
  absoluteTitle?: boolean;
  /** Share image (e.g. a camp's cover photo); the site-wide one is used otherwise. */
  image?: CopyImage;
  /** "article" for a camp's write-up. */
  type?: "website" | "article";
}): Metadata {
  const share = image ?? identity.shareImage;
  const images = [
    {
      url: absoluteUrl(share.src),
      alt: share.alt,
      ...(share.width && share.height ? { width: share.width, height: share.height } : {}),
    },
  ];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_IN",
      siteName: identity.siteName,
      url: path,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      ...(identity.twitterHandle ? { site: identity.twitterHandle } : {}),
      title,
      description,
      images,
    },
  };
}

// ── JSON-LD ─────────────────────────────────────────────────────────
// Nodes cross-reference the organisation by @id instead of repeating it, and
// assert nothing the page does not also say visibly.

export const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationJsonLd(settings: SiteSettings) {
  const { contact, legal, identity } = settings;
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": ORG_ID,
    name: identity.siteName,
    ...(identity.alternateNames.length > 0 ? { alternateName: identity.alternateNames } : {}),
    url: SITE_URL,
    logo: absoluteUrl(identity.logo.src),
    image: absoluteUrl(identity.shareImage.src),
    description: identity.description,
    foundingDate: identity.foundingYear,
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
    areaServed: identity.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    knowsAbout: identity.knowsAbout,
    sameAs: settings.socials.map((s) => s.url),
  };
}

export function websiteJsonLd(identity: Identity) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: identity.siteName,
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

/** Built from the same crumbs the page shows, so the two always match (Google checks). */
export function breadcrumbJsonLd(crumbs: { label: string; href?: string }[], currentPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: `${SITE_URL}${crumb.href ?? currentPath}`,
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
