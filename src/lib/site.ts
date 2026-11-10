/** Static site config: things that are code, not content. */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sarvamangaleducationtrust.org"
).replace(/\/$/, "");

export const SITE_NAME = "Sarvamangal Education Trust";

// Kept under ~160 characters so Google shows it whole.
export const SITE_DESCRIPTION =
  "Mumbai charitable trust running free medical camps, blood drives, notebook distribution and career guidance since 2015. Donate with 80G tax benefit.";

export const FOUNDING_YEAR = 2015;

export const ROUTES = {
  home: "/",
  about: "/about",
  causes: "/causes",
  cause: (slug: string) => `/causes/${slug}`,
  events: "/events",
  event: (slug: string) => `/events/${slug}`,
  blog: "/blog",
  volunteer: "/volunteer",
  csr: "/csr",
  contact: "/contact",
  privacy: "/privacy-policy",
  refunds: "/refund-policy",
  terms: "/terms",
} as const;

export const NAV_LINKS = [
  { label: "About", href: ROUTES.about },
  { label: "Causes", href: ROUTES.causes, hasCauses: true },
  { label: "Events", href: ROUTES.events },
  { label: "Blog", href: ROUTES.blog },
  { label: "Volunteer", href: ROUTES.volunteer },
] as const;
