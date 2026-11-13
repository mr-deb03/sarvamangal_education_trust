/**
 * Loads the site's original content into Payload: the old site's 35 events (photos
 * downloaded from the WordPress uploads), the four causes, testimonials,
 * supporters with logos, donation amounts, FAQs and site settings.
 *
 *   npm run seed         create what's missing, leave existing records alone
 *   npm run seed:force   also overwrite existing records with the seed values
 *
 * (`payload run` swallows --flags, so "force" is passed as a plain word.)
 *
 * Records are matched by slug / name / question, so re-running never duplicates.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import {
  seedCauses,
  seedDonationTiers,
  seedFaqs,
  seedSettings,
  seedSupporters,
  seedTestimonials,
} from "../lib/cms/seed/content";
import { seedEvents } from "../lib/cms/seed/events";
import type { ImageRef } from "../lib/cms/types";

const force = process.argv.slice(2).includes("force");
/** The site's public/ folder, where the seed's local photos and logos live. */
const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public");
const context = { disableRevalidate: true };
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Calendar date → noon UTC, which is the same day everywhere in India. */
const noon = (date: string) => `${date}T12:00:00.000Z`;

const stats = { created: 0, updated: 0, skipped: 0, failed: 0 };

async function uploadImage(payload: Payload, image: ImageRef, name: string): Promise<number | null> {
  const ext = (path.extname(new URL(image.src, "http://local").pathname) || ".jpg").toLowerCase();
  const filename = `${name}${ext}`;
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) return existing.docs[0].id;

  let data: Buffer;
  try {
    if (/^https?:/.test(image.src)) {
      const res = await fetch(image.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = Buffer.from(await res.arrayBuffer());
    } else {
      data = await fs.readFile(path.join(publicDir, image.src));
    }
  } catch (err) {
    console.warn(`  ! could not load ${image.src}: ${(err as Error).message}`);
    return null;
  }

  const doc = await payload.create({
    collection: "media",
    data: { alt: image.alt },
    file: { data, mimetype: MIME[ext] ?? "image/jpeg", name: filename, size: data.length },
    context,
  });
  return doc.id;
}

/** Create, or (with force) update, the first doc matching `where`. Returns its id. */
async function upsert(
  payload: Payload,
  collection: "causes" | "events" | "testimonials" | "supporters" | "donation-tiers" | "faqs",
  where: Record<string, { equals: string }>,
  data: Record<string, unknown>,
  label: string,
): Promise<number | null> {
  try {
    const found = await payload.find({ collection, where, limit: 1, depth: 0 });
    const existing = found.docs[0];
    if (existing && !force) {
      stats.skipped++;
      return existing.id;
    }
    const doc = existing
      ? await payload.update({ collection, id: existing.id, data: data as never, context, depth: 0 })
      : await payload.create({ collection, data: data as never, context, depth: 0 });
    if (existing) stats.updated++;
    else stats.created++;
    return doc.id;
  } catch (err) {
    stats.failed++;
    console.warn(`  ! ${collection} “${label}”: ${(err as Error).message}`);
    return null;
  }
}

async function seed(payload: Payload) {
  console.log("Causes…");
  const causeIds: Record<string, number> = {};
  for (const c of seedCauses) {
    const image = await uploadImage(payload, c.image, `cause-${c.slug}`);
    const id = await upsert(
      payload,
      "causes",
      { slug: { equals: c.slug } },
      { title: c.title, slug: c.slug, tagline: c.tagline, summary: c.summary, order: c.order, image },
      c.title,
    );
    if (id) causeIds[c.slug] = id;
  }

  console.log(`Events (${seedEvents.length}, downloading photos from the old site)…`);
  for (const e of seedEvents) {
    const cover = e.coverImage ? await uploadImage(payload, e.coverImage, `event-${e.slug}`) : null;
    if (!cover) {
      stats.failed++;
      console.warn(`  ! skipped “${e.title}” (${e.startDate}): no cover photo`);
      continue;
    }
    await upsert(
      payload,
      "events",
      { slug: { equals: e.slug } },
      {
        title: e.title,
        slug: e.slug,
        startDate: noon(e.startDate),
        endDate: e.endDate ? noon(e.endDate) : null,
        timeLabel: e.timeLabel ?? null,
        cause: e.cause ? causeIds[e.cause.slug] : null,
        summary: e.summary ?? null,
        venue: e.venue ?? null,
        locality: e.locality ?? null,
        city: e.city ?? null,
        state: e.state,
        beneficiaries: e.beneficiaries
          ? { count: e.beneficiaries.count, label: e.beneficiaries.label, approximate: Boolean(e.beneficiaries.approximate) }
          : {},
        partners: (e.partners ?? []).map((name) => ({ name })),
        coverImage: cover,
        _status: "published",
      },
      e.title,
    );
  }

  console.log("Testimonials, supporters, donation amounts, FAQs…");
  for (const [i, t] of seedTestimonials.entries()) {
    const photo = t.photo ? await uploadImage(payload, t.photo, `testimonial-${t.id.replace(/^seed-/, "")}`) : null;
    await upsert(
      payload,
      "testimonials",
      { name: { equals: t.name } },
      {
        quote: t.quote,
        name: t.name,
        role: t.role,
        supporterSince: t.supporterSince ?? null,
        cause: t.causeSlug ? causeIds[t.causeSlug] : null,
        photo,
        order: (i + 1) * 10,
      },
      t.name,
    );
  }
  for (const [i, s] of seedSupporters.entries()) {
    const logo = s.logo ? await uploadImage(payload, s.logo, `supporter-${s.id.replace(/^seed-/, "")}`) : null;
    await upsert(
      payload,
      "supporters",
      { name: { equals: s.name } },
      { name: s.name, url: s.url ?? null, logo, order: (i + 1) * 10 },
      s.name,
    );
  }
  for (const [i, t] of seedDonationTiers.entries()) {
    await upsert(
      payload,
      "donation-tiers",
      { title: { equals: t.title } },
      {
        amount: t.amount,
        title: t.title,
        outcome: t.outcome,
        cause: t.causeSlug ? causeIds[t.causeSlug] : null,
        order: (i + 1) * 10,
      },
      t.title,
    );
  }
  for (const [i, f] of seedFaqs.entries()) {
    await upsert(
      payload,
      "faqs",
      { question: { equals: f.question } },
      { question: f.question, answer: f.answer, order: (i + 1) * 10 },
      f.question,
    );
  }

  console.log("Site settings…");
  const current = await payload.findGlobal({ slug: "site-settings", depth: 0 });
  if (current.heroIntro && !force) {
    stats.skipped++;
  } else {
    const s = seedSettings;
    const heroImage = await uploadImage(payload, s.hero.image, "hero-children-notebooks");
    const heroInsetImage = s.hero.insetImage
      ? await uploadImage(payload, s.hero.insetImage, "hero-orthopedic-camp")
      : null;
    await payload.updateGlobal({
      slug: "site-settings",
      context,
      data: {
        heroEyebrow: s.hero.eyebrow,
        heroHeadlineLines: s.hero.headlineLines.map((line) => ({ line })),
        heroHighlightWords: s.hero.highlightWords.map((word) => ({ word })),
        heroIntro: s.hero.intro,
        heroImage,
        heroInsetImage,
        heroInsetCaption: s.hero.insetCaption ?? null,
        impactStats: s.impactStats,
        notebookQuote: s.notebookQuote,
        donateUrl: s.donateUrl,
        whatsappNumber: s.whatsappNumber,
        contact: { ...s.contact, addressLines: s.contact.addressLines.map((line) => ({ line })) },
        legal: { ...s.legal, eightyGDate: noon(s.legal.eightyGDate) },
        socials: s.socials,
      },
    });
    stats.updated++;
  }
}

const payload = await getPayload({ config });
try {
  await seed(payload);
  console.log(
    `\nDone: ${stats.created} created, ${stats.updated} updated, ${stats.skipped} already there, ${stats.failed} failed.` +
      (force ? "" : "\nExisting records were left alone; run `npm run seed:force` to overwrite them."),
  );
} finally {
  await payload.destroy();
}
process.exit(stats.failed > 0 ? 1 : 0);
