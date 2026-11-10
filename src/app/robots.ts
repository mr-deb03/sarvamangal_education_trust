import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Keep preview deployments out of search results.
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;

  return {
    rules: isProduction ? [{ userAgent: "*", allow: "/", disallow: ["/api/"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
