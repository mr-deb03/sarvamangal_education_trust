import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
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
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      // Old WordPress uploads, used by seed content until media moves into Sanity.
      {
        protocol: "https",
        hostname: "sarvamangaleducationtrust.org",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
