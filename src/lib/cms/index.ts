import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { todayInIndia } from "@/lib/format";

import { isSanityConfigured } from "./sanity/client";
import { sanitySource } from "./sanity/source";
import { seedSource } from "./seed/source";
import type { CampEvent, EventTimeline, HomePageData } from "./types";

/**
 * The only module pages and components import content from.
 *
 * Every reader is a `use cache` function tagged with its Sanity document type.
 * Publishing in Sanity fires a webhook to /api/revalidate, which calls
 * `revalidateTag(<type>, "max")`, so pages stay static until content changes.
 */

export const CMS_TAGS = {
  all: "cms",
  siteSettings: "siteSettings",
  cause: "cause",
  event: "event",
  testimonial: "testimonial",
  supporter: "supporter",
  donationTier: "donationTier",
  faq: "faq",
} as const;

const source = isSanityConfigured ? sanitySource : seedSource;

export const contentSourceName = isSanityConfigured ? "sanity" : "seed";

export async function getSiteSettings() {
  "use cache";
  cacheTag(CMS_TAGS.all, CMS_TAGS.siteSettings);
  cacheLife("max");
  return source.siteSettings();
}

export async function getCauses() {
  "use cache";
  cacheTag(CMS_TAGS.all, CMS_TAGS.cause);
  cacheLife("max");
  return source.causes();
}

/** All events, newest first. */
export async function getEvents() {
  "use cache";
  cacheTag(CMS_TAGS.all, CMS_TAGS.event);
  cacheLife("max");
  return source.events();
}

/**
 * Events split into upcoming and past around today's date in India.
 * Cached for a day (not "max") so an event moves from upcoming to past on
 * its own, without anyone republishing it.
 */
export async function getEventTimeline(): Promise<EventTimeline> {
  "use cache";
  cacheTag(CMS_TAGS.all, CMS_TAGS.event);
  cacheLife("days");

  const events = await getEvents();
  const today = todayInIndia(new Date());
  const isUpcoming = (e: CampEvent) => (e.endDate ?? e.startDate) >= today;

  const countByCause: Record<string, number> = {};
  for (const e of events) {
    if (e.cause) countByCause[e.cause.slug] = (countByCause[e.cause.slug] ?? 0) + 1;
  }

  return {
    upcoming: events.filter(isUpcoming).reverse(),
    past: events.filter((e) => !isUpcoming(e)),
    total: events.length,
    countByCause,
  };
}

export async function getTestimonials() {
  "use cache";
  cacheTag(CMS_TAGS.all, CMS_TAGS.testimonial);
  cacheLife("max");
  return source.testimonials();
}

export async function getSupporters() {
  "use cache";
  cacheTag(CMS_TAGS.all, CMS_TAGS.supporter);
  cacheLife("max");
  return source.supporters();
}

export async function getDonationTiers() {
  "use cache";
  cacheTag(CMS_TAGS.all, CMS_TAGS.donationTier);
  cacheLife("max");
  return source.donationTiers();
}

export async function getFaqs() {
  "use cache";
  cacheTag(CMS_TAGS.all, CMS_TAGS.faq);
  cacheLife("max");
  return source.faqs();
}

export async function getHomePageData(): Promise<HomePageData> {
  const [settings, causes, timeline, testimonials, supporters, donationTiers, faqs] =
    await Promise.all([
      getSiteSettings(),
      getCauses(),
      getEventTimeline(),
      getTestimonials(),
      getSupporters(),
      getDonationTiers(),
      getFaqs(),
    ]);
  return { settings, causes, timeline, testimonials, supporters, donationTiers, faqs };
}

export type * from "./types";
