import { revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

import { CMS_TAGS, type CmsTag } from "@/lib/cms/tags";

/**
 * Saving in /admin refreshes the matching cached content on the website.
 * The admin and the site are one Next.js app, so this expires the cache tags
 * directly — no webhook.
 *
 * `expire: 0`: editors expect their change on the next page load. Scripts
 * (the seed) pass `context.disableRevalidate`; outside a Next.js request
 * there is no cache to refresh anyway.
 */

const BY_COLLECTION: Record<string, CmsTag[]> = {
  events: [CMS_TAGS.event],
  // Cause titles also appear on events, donation amounts and testimonials.
  causes: [CMS_TAGS.all],
  // Photos appear everywhere.
  media: [CMS_TAGS.all],
  testimonials: [CMS_TAGS.testimonial],
  supporters: [CMS_TAGS.supporter],
  "donation-tiers": [CMS_TAGS.donationTier],
  faqs: [CMS_TAGS.faq],
};

const BY_GLOBAL: Record<string, CmsTag[]> = {
  "site-settings": [CMS_TAGS.siteSettings],
};

function refresh(tags: CmsTag[] | undefined) {
  for (const tag of tags ?? [CMS_TAGS.all]) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // Not inside a Next.js request (e.g. `payload run`): nothing to refresh.
    }
  }
}

export function revalidateCollection(): {
  afterChange: CollectionAfterChangeHook[];
  afterDelete: CollectionAfterDeleteHook[];
} {
  return {
    afterChange: [
      ({ doc, req, collection }) => {
        if (!req.context.disableRevalidate) refresh(BY_COLLECTION[collection.slug]);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc, req, collection }) => {
        if (!req.context.disableRevalidate) refresh(BY_COLLECTION[collection.slug]);
        return doc;
      },
    ],
  };
}

export function revalidateGlobal(): GlobalAfterChangeHook {
  return ({ doc, req, global }) => {
    if (!req.context.disableRevalidate) refresh(BY_GLOBAL[global.slug]);
    return doc;
  };
}
