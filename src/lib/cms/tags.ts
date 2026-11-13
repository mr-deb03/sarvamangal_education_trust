/**
 * Cache tags for CMS content. Each `"use cache"` reader in `./index.ts` tags
 * its result with one of these; Payload's save hooks (src/payload/hooks)
 * expire them. Dependency-free so the Payload config can import it.
 */
export const CMS_TAGS = {
  all: "cms",
  siteSettings: "siteSettings",
  cause: "cause",
  event: "event",
  testimonial: "testimonial",
  supporter: "supporter",
  donationTier: "donationTier",
  faq: "faq",
  appeal: "appeal",
  liveUpdates: "liveUpdates",
} as const;

export type CmsTag = (typeof CMS_TAGS)[keyof typeof CMS_TAGS];
