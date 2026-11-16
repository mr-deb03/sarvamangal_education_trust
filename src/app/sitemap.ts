import type { MetadataRoute } from "next";

import { getCauses, getEvents } from "@/lib/cms";
import { ROUTES, SITE_URL } from "@/lib/site";

/**
 * Only routes that exist — never list a URL that would 404. Add each new
 * page as it ships.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, causes] = await Promise.all([getEvents(), getCauses()]);
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}${ROUTES.events}`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}${ROUTES.causes}`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}${ROUTES.about}`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}${ROUTES.volunteer}`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}${ROUTES.csr}`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}${ROUTES.contact}`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}${ROUTES.privacy}`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}${ROUTES.terms}`, changeFrequency: "yearly", priority: 0.2 },
    ...causes.map((c) => ({
      url: `${SITE_URL}${ROUTES.cause(c.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...events.map((e) => ({
      url: `${SITE_URL}${ROUTES.event(e.slug)}`,
      lastModified: e.startDate,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
