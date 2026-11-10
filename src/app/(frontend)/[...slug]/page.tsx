import { notFound } from "next/navigation";

/**
 * Any URL no other route matches lands here, so it gets the site's own
 * not-found page (with header and footer). The website and the Payload admin
 * are separate root layouts, so there is no single app-wide not-found.
 * Phase 2 adds old WordPress slug → /events/<slug> redirects here.
 */
export default function CatchAll() {
  notFound();
}
