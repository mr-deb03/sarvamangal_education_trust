import { BlockquoteIcon, CreditCardIcon, HelpCircleIcon, UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { imageWithAlt, orderField } from "./fields";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: BlockquoteIcon,
  fields: [
    defineField({ name: "quote", type: "text", rows: 6, validation: (r) => r.required().max(600) }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string", description: 'e.g. "Co-founder, SITH Company"' }),
    defineField({ name: "supporterSince", title: "Supporter since (year)", type: "number", validation: (r) => r.min(2015).max(2100).integer() }),
    defineField({ name: "cause", type: "reference", to: [{ type: "cause" }] }),
    imageWithAlt("photo", "Photo"),
    orderField,
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const supporterType = defineType({
  name: "supporter",
  title: "Supporter",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", title: "Website", type: "url" }),
    imageWithAlt("logo", "Logo"),
    orderField,
  ],
  preview: { select: { title: "name", subtitle: "url", media: "logo" } },
});

export const donationTierType = defineType({
  name: "donationTier",
  title: "Donation amount",
  type: "document",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "amount",
      title: "Amount (₹)",
      type: "number",
      description: "Leave empty for a “choose your own amount” option.",
      validation: (r) => r.min(1).integer(),
    }),
    defineField({ name: "title", type: "string", description: 'e.g. "A free check-up"', validation: (r) => r.required().max(40) }),
    defineField({
      name: "outcome",
      title: "What it does",
      type: "text",
      rows: 2,
      description: "Only promise what the accounts can show.",
      validation: (r) => r.required().max(140),
    }),
    defineField({ name: "cause", type: "reference", to: [{ type: "cause" }] }),
    orderField,
  ],
  preview: {
    select: { amount: "amount", title: "title" },
    prepare: ({ amount, title }) => ({ title: amount ? `₹${amount.toLocaleString("en-IN")}` : "Any amount", subtitle: title }),
  },
});

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 5, validation: (r) => r.required() }),
    orderField,
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});
