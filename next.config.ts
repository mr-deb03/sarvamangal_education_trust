import path from "path";
import { fileURLToPath } from "url";

import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

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
  images: {
    formats: ["image/avif", "image/webp"],
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
