import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { todayInIndia } from "@/lib/format";

import { isPayloadConfigured, payloadSource } from "./payload/source";
import { seedSource } from "./seed/source";
import { CMS_TAGS } from "./tags";
import type { AppealView, CampEvent, EventTimeline, HomePageData } from "./types";

/**
 * The only module pages and components import content from.
 *
 * Every reader is a `use cache` function tagged with its content type.
 * Saving in the Payload admin (/admin, same app) runs an afterChange hook
 * (src/payload/hooks/revalidate.ts) that expires the matching tag, so pages
 * stay static until content changes.
 */

export { CMS_TAGS };

const source = isPayloadConfigured ? payloadSource : seedSource;

export const contentSourceName = isPayloadConfigured ? "payload" : "seed";

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

/**
 * The live appeal with today's progress, or null when it is off,
 * incomplete or past its end date. Cached for a day (it reads the clock) and
 * refreshed immediately when the appeal is saved in /admin.
 */
export async function getAppeal(): Promise<AppealView | null> {
  "use cache";
  cacheTag(CMS_TAGS.all, CMS_TAGS.appeal);
  cacheLife("days");

  const appeal = await source.appeal();
  if (!appeal) return null;

  const today = todayInIndia(new Date());
  if (appeal.endDate && appeal.endDate < today) return null;

  const DAY = 86_400_000;
  return {
    ...appeal,
    percent: appeal.goal ? Math.min(100, Math.round((appeal.soFar / appeal.goal) * 100)) : undefined,
    daysLeft: appeal.endDate ? Math.round((Date.parse(appeal.endDate) - Date.parse(today)) / DAY) : undefined,
  };
}

export async function getHomePageData(): Promise<HomePageData> {
  const [settings, causes, timeline, testimonials, supporters, donationTiers, faqs, appeal] =
    await Promise.all([
      getSiteSettings(),
      getCauses(),
      getEventTimeline(),
      getTestimonials(),
      getSupporters(),
      getDonationTiers(),
      getFaqs(),
      getAppeal(),
    ]);
  return { settings, causes, timeline, testimonials, supporters, donationTiers, faqs, appeal };
}

export type * from "./types";
