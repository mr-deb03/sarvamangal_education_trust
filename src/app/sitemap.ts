import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Only routes that exist. Phase 2 adds /about, /causes/*, /events and
 * /events/[slug] (from getEvents()) as those pages ship — never list a URL
 * that would 404.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [{ url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 }];
}
