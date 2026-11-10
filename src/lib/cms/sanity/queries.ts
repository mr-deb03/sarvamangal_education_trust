/**
 * GROQ queries. Field names here must match `studio/schemaTypes/*`.
 * Projections return raw Sanity shapes; `source.ts` maps them to site types.
 */

const image = /* groq */ `{
  alt,
  crop,
  hotspot,
  "asset": asset->{ _id, metadata { lqip, dimensions { width, height } } }
}`;

const causeRef = /* groq */ `{ "slug": slug.current, title }`;

export const SITE_SETTINGS_QUERY = /* groq */ `*[_type == "siteSettings"][0]{
  heroEyebrow,
  heroHeadlineLines,
  heroHighlightWords,
  heroIntro,
  "heroImage": heroImage${image},
  "heroInsetImage": heroInsetImage${image},
  heroInsetCaption,
  impactStats[]{ value, label },
  notebookQuote{ text, translation, note },
  donateUrl,
  whatsappNumber,
  contact{ addressLines, locality, city, state, postalCode, phone, email },
  legal{ registrationNo, pan, eightyGNo, eightyGDate },
  socials[]{ platform, url }
}`;

export const CAUSES_QUERY = /* groq */ `*[_type == "cause" && defined(slug.current)] | order(order asc){
  "slug": slug.current,
  title,
  tagline,
  summary,
  order,
  "image": image${image}
}`;

export const EVENTS_QUERY = /* groq */ `*[_type == "event" && defined(slug.current) && defined(startDate)] | order(startDate desc){
  _id,
  "slug": slug.current,
  title,
  startDate,
  endDate,
  timeLabel,
  "cause": cause->${causeRef},
  venue,
  locality,
  city,
  state,
  summary,
  "coverImage": coverImage${image},
  beneficiaries{ count, label, approximate },
  partners
}`;

export const TESTIMONIALS_QUERY = /* groq */ `*[_type == "testimonial"] | order(order asc){
  _id,
  quote,
  name,
  role,
  supporterSince,
  "causeSlug": cause->slug.current
}`;

export const SUPPORTERS_QUERY = /* groq */ `*[_type == "supporter"] | order(order asc){
  _id,
  name,
  url,
  "logo": logo${image}
}`;

export const DONATION_TIERS_QUERY = /* groq */ `*[_type == "donationTier"] | order(order asc){
  _id,
  amount,
  title,
  outcome,
  "causeSlug": cause->slug.current
}`;

export const FAQS_QUERY = /* groq */ `*[_type == "faq"] | order(order asc){
  _id,
  question,
  answer
}`;
