import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";

import { CMS_TAGS } from "@/lib/cms";

/**
 * Sanity webhook → refresh cached content.
 *
 * Configure in sanity.io/manage → API → Webhooks:
 *   URL        https://<site>/api/revalidate
 *   Trigger    create, update, delete
 *   Projection {_type}
 *   Header     Authorization: Bearer <SANITY_REVALIDATE_SECRET>
 *
 * Revalidates the document's type tag (e.g. "event"), or everything if the
 * type is unknown. "max" = stale-while-revalidate: the next visitor triggers
 * the refresh and the one after sees the new content.
 */

const KNOWN_TAGS = new Set<string>(Object.values(CMS_TAGS));

function sameSecret(given: string, expected: string) {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ revalidated: false, message: "SANITY_REVALIDATE_SECRET is not set." }, { status: 500 });
  }

  const auth = request.headers.get("authorization") ?? "";
  const given = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  if (!sameSecret(given, secret)) {
    return Response.json({ revalidated: false, message: "Invalid secret." }, { status: 401 });
  }

  let type: unknown;
  try {
    ({ _type: type } = (await request.json()) as { _type?: unknown });
  } catch {
    // No body: fall through and refresh everything.
  }

  const tags = typeof type === "string" && KNOWN_TAGS.has(type) ? [type] : [CMS_TAGS.all];
  for (const tag of tags) revalidateTag(tag, "max");

  return Response.json({ revalidated: true, tags });
}
