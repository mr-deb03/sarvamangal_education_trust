import "server-only";

import config from "@payload-config";
import { getPayload } from "payload";

import { indiaDate } from "@/lib/format";
import type {
  Cause as PCause,
  Event as PEvent,
  FundraisingAppeal as PAppeal,
  Media as PMedia,
  SiteSetting as PSiteSettings,
} from "@/payload-types";

import { seedSettings } from "../seed/content";
import type { Appeal, CampEvent, Cause, ContentSource, ImageRef, SiteSettings } from "../types";

/**
 * Payload → site types, through the Local API (direct database access, no
 * HTTP — Payload runs inside this app). Components never see Payload shapes.
 * Called only from the `"use cache"` readers in ../index.ts.
 */

/** True when a database is configured. Otherwise the site renders seed content. */
export const isPayloadConfigured = Boolean(process.env.DATABASE_URI);

const payload = () => getPayload({ config });

type MaybeMedia = number | PMedia | null | undefined;

function toImage(media: MaybeMedia, fallbackAlt: string): ImageRef | undefined {
  if (!media || typeof media !== "object" || !media.url) return undefined;
  return {
    src: media.url,
    alt: media.alt?.trim() || fallbackAlt,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    focalPoint:
      media.focalX != null && media.focalY != null ? { x: media.focalX, y: media.focalY } : undefined,
  };
}

/** Payload stores dates as timestamps; the site works in Indian calendar dates. */
function toDate(iso: string | null | undefined) {
  return iso ? indiaDate(new Date(iso)) : undefined;
}

/** A value from the CMS, unless it's empty — then the built-in one. */
function pick<T>(value: T | null | undefined, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value;
}

function causeRef(cause: number | PCause | null | undefined) {
  return cause && typeof cause === "object" && cause.slug ? { slug: cause.slug, title: cause.title } : undefined;
}

async function siteSettings(): Promise<SiteSettings> {
  const raw = (await (await payload()).findGlobal({ slug: "site-settings", depth: 1 })) as PSiteSettings;
  const s = seedSettings;
  const c = raw.contact ?? {};
  const l = raw.legal ?? {};
  const q = raw.notebookQuote ?? {};

  return {
    hero: {
      eyebrow: pick(raw.heroEyebrow, s.hero.eyebrow),
      headlineLines: pick(raw.heroHeadlineLines?.map((h) => h.line), s.hero.headlineLines),
      highlightWords: pick(raw.heroHighlightWords?.map((h) => h.word), s.hero.highlightWords),
      intro: pick(raw.heroIntro, s.hero.intro),
      image: toImage(raw.heroImage, s.hero.image.alt) ?? s.hero.image,
      insetImage: toImage(raw.heroInsetImage, s.hero.insetImage?.alt ?? "") ?? s.hero.insetImage,
      insetCaption: pick(raw.heroInsetCaption, s.hero.insetCaption),
    },
    impactStats: pick(
      raw.impactStats?.map(({ value, label }) => ({ value, label })),
      s.impactStats,
    ),
    notebookQuote: {
      text: pick(q.text, s.notebookQuote.text),
      translation: pick(q.translation, s.notebookQuote.translation),
      note: pick(q.note, s.notebookQuote.note),
    },
    donateUrl: pick(raw.donateUrl, s.donateUrl),
    whatsappNumber: pick(raw.whatsappNumber, s.whatsappNumber),
    contact: {
      addressLines: pick(c.addressLines?.map((a) => a.line), s.contact.addressLines),
      locality: pick(c.locality, s.contact.locality),
      city: pick(c.city, s.contact.city),
      state: pick(c.state, s.contact.state),
      postalCode: pick(c.postalCode, s.contact.postalCode),
      phone: pick(c.phone, s.contact.phone),
      email: pick(c.email, s.contact.email),
    },
    legal: {
      registrationNo: pick(l.registrationNo, s.legal.registrationNo),
      pan: pick(l.pan, s.legal.pan),
      eightyGNo: pick(l.eightyGNo, s.legal.eightyGNo),
      eightyGDate: pick(toDate(l.eightyGDate), s.legal.eightyGDate),
    },
    socials: pick(
      raw.socials?.map(({ platform, url }) => ({ platform, url })),
      s.socials,
    ),
  };
}

async function causes(): Promise<Cause[]> {
  const { docs } = await (await payload()).find({ collection: "causes", depth: 1, pagination: false, sort: "order" });
  return docs.flatMap((c) => {
    const image = toImage(c.image, `${c.title} — Sarvamangal Education Trust`);
    return image && c.slug
      ? [{ slug: c.slug, title: c.title, tagline: c.tagline, summary: c.summary, image, order: c.order ?? 10 }]
      : [];
  });
}

function toEvent(e: PEvent): CampEvent | null {
  const startDate = toDate(e.startDate);
  if (!e.slug || !startDate) return null;
  const b = e.beneficiaries;
  return {
    id: String(e.id),
    slug: e.slug,
    title: e.title,
    startDate,
    endDate: toDate(e.endDate),
    timeLabel: e.timeLabel ?? undefined,
    cause: causeRef(e.cause),
    venue: e.venue ?? undefined,
    locality: e.locality ?? undefined,
    city: e.city ?? undefined,
    state: e.state,
    summary: e.summary ?? undefined,
    coverImage: toImage(e.coverImage, `${e.title} — Sarvamangal Education Trust`),
    beneficiaries: b?.count ? { count: b.count, label: b.label || "people", approximate: Boolean(b.approximate) } : undefined,
    partners: e.partners?.map((p) => p.name).filter(Boolean),
  };
}

async function events(): Promise<CampEvent[]> {
  const { docs } = await (await payload()).find({
    collection: "events",
    depth: 1,
    pagination: false,
    sort: "-startDate",
  });
  return docs.map(toEvent).filter((e): e is CampEvent => e !== null);
}

async function testimonials() {
  const { docs } = await (await payload()).find({ collection: "testimonials", depth: 1, pagination: false, sort: "order" });
  return docs.map((t) => ({
    id: String(t.id),
    quote: t.quote,
    name: t.name,
    role: t.role ?? "",
    supporterSince: t.supporterSince ?? undefined,
    causeSlug: causeRef(t.cause)?.slug,
  }));
}

async function supporters() {
  const { docs } = await (await payload()).find({ collection: "supporters", depth: 1, pagination: false, sort: "order" });
  return docs.map((s) => ({
    id: String(s.id),
    name: s.name,
    url: s.url ?? undefined,
    logo: toImage(s.logo, `${s.name} logo`),
  }));
}

async function donationTiers() {
  const { docs } = await (await payload()).find({ collection: "donation-tiers", depth: 1, pagination: false, sort: "order" });
  return docs.map((t) => ({
    id: String(t.id),
    amount: t.amount ?? null,
    title: t.title,
    outcome: t.outcome,
    causeSlug: causeRef(t.cause)?.slug,
  }));
}

async function faqs() {
  const { docs } = await (await payload()).find({ collection: "faqs", depth: 0, pagination: false, sort: "order" });
  return docs.map((f) => ({ id: String(f.id), question: f.question, answer: f.answer }));
}

async function appeal(): Promise<Appeal | null> {
  // depth 2: the cause's own photo is the fallback image.
  const raw = (await (await payload()).findGlobal({ slug: "fundraising-appeal", depth: 2 })) as PAppeal;
  if (!raw.enabled || !raw.title) return null;

  const measure = raw.measure === "items" ? "items" : "money";
  const itemLabel = raw.itemLabel?.trim() || undefined;
  const goal = raw.goalAmount || undefined;
  const soFar = raw.raisedAmount ?? 0;
  // Nothing honest to show: an item count with no name, or no goal and nothing so far.
  if ((measure === "items" && !itemLabel) || (!goal && soFar <= 0)) return null;

  const cause = raw.cause && typeof raw.cause === "object" ? raw.cause : null;
  return {
    title: raw.title,
    description: raw.description?.trim() || undefined,
    measure,
    itemLabel,
    soFar,
    atLeast: Boolean(raw.atLeast),
    goal,
    donors: raw.donorCount ?? undefined,
    endDate: toDate(raw.endDate),
    cause: causeRef(cause),
    image: toImage(raw.image, raw.title) ?? (cause ? toImage(cause.image, cause.title) : undefined),
  };
}

export const payloadSource: ContentSource = {
  siteSettings,
  causes,
  events,
  testimonials,
  supporters,
  donationTiers,
  faqs,
  appeal,
};
