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
};

export type HomePageData = {
  settings: SiteSettings;
  causes: Cause[];
  timeline: EventTimeline;
  testimonials: Testimonial[];
  supporters: Supporter[];
  donationTiers: DonationTier[];
  faqs: Faq[];
};
