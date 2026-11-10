import type { ContentSource } from "../types";
import {
  seedCauses,
  seedDonationTiers,
  seedFaqs,
  seedSettings,
  seedSupporters,
  seedTestimonials,
} from "./content";
import { seedEvents } from "./events";

/** Local content used when Sanity is not configured (local dev, previews). */
export const seedSource: ContentSource = {
  siteSettings: async () => seedSettings,
  causes: async () => [...seedCauses].sort((a, b) => a.order - b.order),
  events: async () => [...seedEvents].sort((a, b) => b.startDate.localeCompare(a.startDate)),
  testimonials: async () => seedTestimonials,
  supporters: async () => seedSupporters,
  donationTiers: async () => seedDonationTiers,
  faqs: async () => seedFaqs,
};
