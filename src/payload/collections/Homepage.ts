import type { CollectionConfig } from "payload";

import { adminsOnly, anyone, hiddenFromEditors, signedIn } from "../access";

import { orderField } from "../fields";
import { revalidateCollection } from "../hooks/revalidate";

/** Smaller collections that only feed the homepage. */

export const DonationTiers: CollectionConfig = {
  slug: "donation-tiers",
  labels: { singular: "Donation amount", plural: "Donation amounts" },
  admin: { group: "Homepage", useAsTitle: "title", defaultColumns: ["amount", "title", "order"], hidden: hiddenFromEditors },
  defaultSort: "order",
  access: { read: anyone, readVersions: signedIn, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  versions: { maxPerDoc: 25 },
  hooks: revalidateCollection(),
  fields: [
    {
      name: "amount",
      label: "Amount (₹)",
      type: "number",
      min: 1,
      admin: { description: "Leave empty for a “choose your own amount” option." },
    },
    { name: "title", type: "text", required: true, maxLength: 40, admin: { description: "e.g. “A free check-up”" } },
    {
      name: "outcome",
      label: "What it does",
      type: "textarea",
      required: true,
      maxLength: 140,
      admin: { description: "Only promise what the accounts can show." },
    },
    { name: "cause", type: "relationship", relationTo: "causes" },
    orderField,
  ],
};

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  admin: { group: "Homepage", useAsTitle: "name", defaultColumns: ["name", "role", "supporterSince"] },
  defaultSort: "order",
  access: { read: anyone, readVersions: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { maxPerDoc: 25 },
  hooks: revalidateCollection(),
  fields: [
    { name: "quote", type: "textarea", required: true, maxLength: 600 },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
        { name: "role", type: "text", admin: { width: "50%", description: "e.g. “Co-founder, SITH Company”" } },
      ],
    },
    { name: "supporterSince", label: "Supporter since (year)", type: "number", min: 2015, max: 2100 },
    { name: "cause", type: "relationship", relationTo: "causes" },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "A clear photo of the person's face — square works best. Without one, their initials show.",
      },
    },
    orderField,
  ],
};

export const Supporters: CollectionConfig = {
  slug: "supporters",
  labels: { singular: "Supporter", plural: "Supporters" },
  admin: { group: "Homepage", useAsTitle: "name", defaultColumns: ["name", "url", "order"] },
  defaultSort: "order",
  access: { read: anyone, readVersions: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { maxPerDoc: 25 },
  hooks: revalidateCollection(),
  fields: [
    { name: "name", type: "text", required: true },
    { name: "url", label: "Website", type: "text", admin: { description: "Full address, e.g. https://sith.co.in" } },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Square logo with a transparent background works best." },
    },
    orderField,
  ],
};

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: { group: "Homepage", useAsTitle: "question", defaultColumns: ["question", "order"] },
  defaultSort: "order",
  access: { read: anyone, readVersions: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { maxPerDoc: 25 },
  hooks: revalidateCollection(),
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    orderField,
  ],
};
