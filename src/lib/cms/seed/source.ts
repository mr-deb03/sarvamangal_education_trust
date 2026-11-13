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

/** Built-in content used when no database is configured (DATABASE_URI empty). */
export const seedSource: ContentSource = {
  siteSettings: async () => seedSettings,
  causes: async () => [...seedCauses].sort((a, b) => a.order - b.order),
  events: async () => [...seedEvents].sort((a, b) => b.startDate.localeCompare(a.startDate)),
  testimonials: async () => seedTestimonials,
  supporters: async () => seedSupporters,
  donationTiers: async () => seedDonationTiers,
  faqs: async () => seedFaqs,
  // No built-in appeal: goals and amounts only ever come from the trust, via /admin.
  appeal: async () => null,
};
