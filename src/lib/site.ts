/**
 * Static site config: things that are code, not content. Names, descriptions
 * and every piece of wording live in the CMS (see src/lib/cms/copy/defaults.ts).
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sarvamangaleducationtrust.org").replace(/\/$/, "");

/** Route paths are tied to the files in src/app — never editable. */
export const ROUTES = {
  home: "/",
  causes: "/causes",
  cause: (slug: string) => `/causes/${slug}`,
  events: "/events",
  event: (slug: string) => `/events/${slug}`,
} as const;

/** Absolute URL for a path or a CMS file ("/api/media/file/…"). */
export function absoluteUrl(src: string) {
  return /^https?:/.test(src) ? src : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}
