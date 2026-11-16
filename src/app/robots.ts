import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Keep preview deployments out of search results.
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;

  return {
    rules: isProduction
      ? [
          {
            userAgent: "*",
            // CMS photos live under /api/media/file/ — they appear in share previews and
            // in Event structured data, so Google must be able to fetch them. The most
            // specific rule wins, so the rest of /api/ stays blocked.
            allow: ["/", "/api/media/file/"],
            disallow: ["/api/", "/admin"],
          },
        ]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
