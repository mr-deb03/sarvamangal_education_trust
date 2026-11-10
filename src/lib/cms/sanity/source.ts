import "server-only";

import type { SanityImageSource } from "@sanity/image-url";

import { seedSettings } from "../seed/content";
import type {
  CampEvent,
  Cause,
  ContentSource,
  DonationTier,
  Faq,
  ImageRef,
  SiteSettings,
  Supporter,
  Testimonial,
} from "../types";
import { imageBuilder, sanityClient } from "./client";
import {
  CAUSES_QUERY,
  DONATION_TIERS_QUERY,
  EVENTS_QUERY,
  FAQS_QUERY,
  SITE_SETTINGS_QUERY,
  SUPPORTERS_QUERY,
  TESTIMONIALS_QUERY,
} from "./queries";

type RawImage = {
  alt?: string;
  crop?: unknown;
  hotspot?: unknown;
  asset?: {
    _id: string;
    metadata?: { lqip?: string; dimensions?: { width: number; height: number } };
  };
} | null;

function toImage(raw: RawImage | undefined, fallbackAlt: string): ImageRef | undefined {
  if (!raw?.asset?._id) return undefined;
  const dims = raw.asset.metadata?.dimensions;
  return {
    // Crop/hotspot are applied by the builder; next/image does the resizing.
    src: imageBuilder()
      .image(raw as SanityImageSource)
      .width(2000)
      .fit("max")
      .auto("format")
      .url(),
    alt: raw.alt?.trim() || fallbackAlt,
    width: dims?.width,
    height: dims?.height,
    blurDataURL: raw.asset.metadata?.lqip,
  };
}

function fetchQuery<T>(query: string): Promise<T> {
  return sanityClient().fetch<T>(query);
}

type RawSettings = Partial<{
  heroEyebrow: string;
  heroHeadlineLines: string[];
  heroHighlightWords: string[];
  heroIntro: string;
  heroImage: RawImage;
  heroInsetImage: RawImage;
  heroInsetCaption: string;
  impactStats: SiteSettings["impactStats"];
  notebookQuote: SiteSettings["notebookQuote"];
  donateUrl: string;
  whatsappNumber: string;
  contact: SiteSettings["contact"];
  legal: SiteSettings["legal"];
  socials: SiteSettings["socials"];
}> | null;

/**
 * Any field the editors have not filled in yet falls back to the seed value,
 * so a half-finished Site Settings document never blanks out the page.
 */
async function siteSettings(): Promise<SiteSettings> {
  const raw: RawSettings = await fetchQuery(SITE_SETTINGS_QUERY);
  const s = seedSettings;
  return {
    hero: {
      eyebrow: raw?.heroEyebrow ?? s.hero.eyebrow,
      headlineLines: raw?.heroHeadlineLines?.length ? raw.heroHeadlineLines : s.hero.headlineLines,
      highlightWords: raw?.heroHighlightWords ?? s.hero.highlightWords,
      intro: raw?.heroIntro ?? s.hero.intro,
      image: toImage(raw?.heroImage, s.hero.image.alt) ?? s.hero.image,
      insetImage: toImage(raw?.heroInsetImage, s.hero.insetImage?.alt ?? "") ?? s.hero.insetImage,
      insetCaption: raw?.heroInsetCaption ?? s.hero.insetCaption,
    },
    impactStats: raw?.impactStats?.length ? raw.impactStats : s.impactStats,
    notebookQuote: raw?.notebookQuote ?? s.notebookQuote,
    donateUrl: raw?.donateUrl ?? s.donateUrl,
    whatsappNumber: raw?.whatsappNumber ?? s.whatsappNumber,
    contact: { ...s.contact, ...raw?.contact },
    legal: { ...s.legal, ...raw?.legal },
    socials: raw?.socials?.length ? raw.socials : s.socials,
  };
}

async function causes(): Promise<Cause[]> {
  const raw = await fetchQuery<
    (Omit<Cause, "image"> & { image: RawImage })[]
  >(CAUSES_QUERY);
  return raw.flatMap((c) => {
    const image = toImage(c.image, `${c.title} — Sarvamangal Education Trust`);
    return image ? [{ ...c, image }] : [];
  });
}

type RawEvent = Omit<CampEvent, "id" | "coverImage"> & {
  _id: string;
  coverImage: RawImage;
};

async function events(): Promise<CampEvent[]> {
  const raw = await fetchQuery<RawEvent[]>(EVENTS_QUERY);
  return raw.map(({ _id, coverImage, ...e }) => ({
    ...e,
    id: _id,
    coverImage: toImage(coverImage, `${e.title} — Sarvamangal Education Trust`),
    // GROQ returns null for empty fields; the site types use undefined.
    cause: e.cause ?? undefined,
    beneficiaries: e.beneficiaries?.count ? e.beneficiaries : undefined,
    partners: e.partners ?? undefined,
  }));
}

async function testimonials(): Promise<Testimonial[]> {
  const raw = await fetchQuery<(Omit<Testimonial, "id"> & { _id: string })[]>(TESTIMONIALS_QUERY);
  return raw.map(({ _id, ...t }) => ({ ...t, id: _id }));
}

async function supporters(): Promise<Supporter[]> {
  const raw = await fetchQuery<(Omit<Supporter, "id" | "logo"> & { _id: string; logo: RawImage })[]>(
    SUPPORTERS_QUERY,
  );
  return raw.map(({ _id, logo, ...s }) => ({
    ...s,
    id: _id,
    url: s.url ?? undefined,
    logo: toImage(logo, `${s.name} logo`),
  }));
}

async function donationTiers(): Promise<DonationTier[]> {
  const raw = await fetchQuery<(Omit<DonationTier, "id"> & { _id: string })[]>(DONATION_TIERS_QUERY);
  return raw.map(({ _id, ...t }) => ({ ...t, id: _id, amount: t.amount ?? null }));
}

async function faqs(): Promise<Faq[]> {
  const raw = await fetchQuery<(Omit<Faq, "id"> & { _id: string })[]>(FAQS_QUERY);
  return raw.map(({ _id, ...f }) => ({ ...f, id: _id }));
}

export const sanitySource: ContentSource = {
  siteSettings,
  causes,
  events,
  testimonials,
  supporters,
  donationTiers,
  faqs,
};
