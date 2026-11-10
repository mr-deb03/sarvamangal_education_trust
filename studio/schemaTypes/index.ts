import { causeType } from "./cause";
import { donationTierType, faqType, supporterType, testimonialType } from "./content";
import { eventType } from "./event";
import { siteSettingsType } from "./siteSettings";

/**
 * Keep field names in sync with the website's GROQ queries in
 * src/lib/cms/sanity/queries.ts.
 */
export const schemaTypes = [
  siteSettingsType,
  eventType,
  causeType,
  donationTierType,
  testimonialType,
  supporterType,
  faqType,
];

export const SINGLETON_TYPES = new Set(["siteSettings"]);
