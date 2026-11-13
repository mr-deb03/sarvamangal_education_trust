import path from "path";
import { fileURLToPath } from "url";

import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

import { seedEvents } from "./src/lib/cms/seed/events";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    root: path.resolve(dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  /**
   * Old WordPress addresses → the new pages, permanently (308), so their search
   * rankings carry over. Camp posts lived at /<slug>/ and kept their slugs here;
   * the seed list is exactly the old site's posts. New camps never had an old URL.
   */
  async redirects() {
    return [
      ...seedEvents.map((e) => ({ source: `/${e.slug}`, destination: `/events/${e.slug}`, permanent: true })),
      { source: "/recent-events-sarvamangal-education-trust", destination: "/events", permanent: true },
      ...["health", "education", "society", "spirituality"].map((slug) => ({
        source: `/${slug}`,
        destination: `/causes/${slug}`,
        permanent: true,
      })),
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Fewer candidate widths = shorter srcset lists in the HTML. Nothing on the site
    // is drawn wider than 1920px or smaller than 32px.
    deviceSizes: [640, 750, 828, 1080, 1280, 1920],
    imageSizes: [32, 64, 128, 256, 384],
    // Next 16 requires an allowlist. Keep in sync with `quality` props.
    qualities: [70, 75, 80],
    // Our own assets, and photos uploaded through Payload (served by this app).
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/brand/**" }, { pathname: "/api/media/file/**" }],
    remotePatterns: [
      // Old WordPress uploads, used by seed content and the seed script until the old site is retired.
      {
        protocol: "https",
        hostname: "sarvamangaleducationtrust.org",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
