import "server-only";

import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";
const apiVersion = process.env.SANITY_API_VERSION ?? "2025-10-01";

/** True when Sanity env vars are present. Otherwise the site renders seed content. */
export const isSanityConfigured = Boolean(projectId);

let client: SanityClient | null = null;

export function sanityClient(): SanityClient {
  if (!projectId) {
    throw new Error("SANITY_PROJECT_ID is not set — the Sanity source should not be used.");
  }
  client ??= createClient({
    projectId,
    dataset,
    apiVersion,
    // Published content only. The CDN is fine because Next caches the result
    // and the Sanity webhook (app/api/revalidate) tells us when to refetch.
    useCdn: true,
    perspective: "published",
    token: process.env.SANITY_READ_TOKEN || undefined,
  });
  return client;
}

export function imageBuilder() {
  return createImageUrlBuilder({ projectId: projectId ?? "", dataset });
}
