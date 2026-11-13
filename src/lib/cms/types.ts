/**
 * Content types the website renders.
 *
 * These are the site's own shapes, not Payload's. Both content sources
 * (`payload/source.ts` and `seed/source.ts`) map into them, so components
 * never see a Payload document or a media relation.
 */

export type ImageRef = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Tiny base64 preview, when the source provides one. */
  blurDataURL?: string;
  /** Focal point set in the admin, in percent. Used as object-position. */
  focalPoint?: { x: number; y: number };
};

export type CauseRef = {
  slug: string;
  title: string;
};

export type Cause = CauseRef & {
  tagline: string;
  summary: string;
  image: ImageRef;
  order: number;
};

export type CampEvent = {
  id: string;
  /** Same slug as the old WordPress post, so old URLs can redirect 1:1. */
  slug: string;
  title: string;
  /** Calendar date in India, `YYYY-MM-DD`. */
  startDate: string;
  endDate?: string;
  /** Free text, e.g. "9 am – 1 pm". */
  timeLabel?: string;
  cause?: CauseRef;
  venue?: string;
  /** Neighbourhood, e.g. "Bhandup West". */
  locality?: string;
  city?: string;
  state: string;
  summary?: string;
  /** What people get at the camp ("Free BP and sugar check"). Shown while it's coming up. */
  highlights?: string[];
  /** The full write-up, rendered to HTML from the CMS's rich text. */
  bodyHtml?: string;
  gallery?: ImageRef[];
  /** Optional overrides for Google; the page falls back to title / summary. */
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: ImageRef;
  beneficiaries?: {
    count: number;
    /** What was counted: "patients", "volunteers", "children"… */
    label: string;
    /** Render as "200+" rather than an exact figure. */
    approximate?: boolean;
  };
  partners?: string[];
};

export type EventTimeline = {
  /** Soonest first. */
  upcoming: CampEvent[];
  /** Most recent first. */
  past: CampEvent[];
  total: number;
  /** Number of events per cause slug. */
  countByCause: Record<string, number>;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  supporterSince?: number;
  causeSlug?: string;
  /** The person's photo. Without one, the card shows their initials. */
  photo?: ImageRef;
};

export type Supporter = {
  id: string;
  name: string;
  url?: string;
  logo?: ImageRef;
};

export type DonationTier = {
  id: string;
  /** `null` = donor chooses the amount. */
  amount: number | null;
  title: string;
  outcome: string;
  causeSlug?: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type ImpactStat = {
  value: string;
  label: string;
};

export type SocialPlatform = "facebook" | "instagram" | "x" | "linkedin" | "youtube";

export type SiteSettings = {
  hero: {
    eyebrow: string;
    /** Each entry renders on its own line. */
    headlineLines: string[];
    /** Words inside the headline that get the crimson accent underline. */
    highlightWords: string[];
    intro: string;
    image: ImageRef;
    insetImage?: ImageRef;
    insetCaption?: string;
  };
  impactStats: ImpactStat[];
  notebookQuote: {
    text: string;
    translation: string;
    note: string;
  };
  donateUrl: string;
  /** Digits only, with country code, e.g. "918108103856". */
  whatsappNumber: string;
  contact: {
    addressLines: string[];
    locality: string;
    city: string;
    state: string;
    postalCode?: string;
    phone: string;
    email: string;
  };
  legal: {
    registrationNo: string;
    pan: string;
    eightyGNo: string;
    /** `YYYY-MM-DD` */
    eightyGDate: string;
  };
  socials: { platform: SocialPlatform; url: string }[];
};

/** The current appeal (Payload global "fundraising-appeal"). */
export type Appeal = {
  title: string;
  description?: string;
  /** What the numbers count: rupees raised, or things given out. */
  measure: "money" | "items";
  /** For "items": what the number counts, e.g. "pouches distributed". */
  itemLabel?: string;
  /** Rupees raised or things given out so far. */
  soFar: number;
  /** Show `soFar` as a minimum ("1,500+"). */
  atLeast: boolean;
  /** Optional: without a goal the appeal is open-ended (no progress bar). */
  goal?: number;
  donors?: number;
  /** `YYYY-MM-DD`; the appeal hides after this date. */
  endDate?: string;
  cause?: CauseRef;
  image?: ImageRef;
};

/** An appeal ready to render: progress worked out for today. */
export type AppealView = Appeal & {
  /** 0–100, capped. Only when there is a goal. */
  percent?: number;
  daysLeft?: number;
};

/** Icons for live-ticker totals. Keep in sync with LIVE_ICONS in src/payload/globals/LiveUpdates.ts. */
export type LiveIcon = "pouch" | "notebook" | "blood" | "health" | "people" | "tree" | "school" | "heart";

/** A running total in the live ticker, e.g. 1,500+ pouches given to students. */
export type LiveCounter = {
  value: number;
  /** Render as "1,500+". */
  plus: boolean;
  label: string;
  icon: LiveIcon;
};

export type LiveUpdates = {
  counters: LiveCounter[];
  /** `YYYY-MM-DD` (India) of the last save in /admin. */
  updatedAt?: string;
};

/** What every content backend (Payload, seed) must provide. */
export type ContentSource = {
  siteSettings(): Promise<SiteSettings>;
  causes(): Promise<Cause[]>;
  /** Newest first. */
  events(): Promise<CampEvent[]>;
  testimonials(): Promise<Testimonial[]>;
  supporters(): Promise<Supporter[]>;
  donationTiers(): Promise<DonationTier[]>;
  faqs(): Promise<Faq[]>;
  /** Null when switched off or incomplete. */
  appeal(): Promise<Appeal | null>;
  liveUpdates(): Promise<LiveUpdates>;
};

export type HomePageData = {
  settings: SiteSettings;
  causes: Cause[];
  timeline: EventTimeline;
  testimonials: Testimonial[];
  supporters: Supporter[];
  donationTiers: DonationTier[];
  faqs: Faq[];
  /** Null when there is no live appeal. */
  appeal: AppealView | null;
  liveUpdates: LiveUpdates;
};
