import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { imageWithAlt } from "./fields";

/**
 * Singleton (document id "siteSettings"). Any field left empty falls back to
 * the website's built-in seed value, so it can be filled in gradually.
 */
export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "hero", title: "Homepage hero", default: true },
    { name: "story", title: "Numbers & quote" },
    { name: "contact", title: "Contact & legal" },
    { name: "links", title: "Links" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", title: "Small line above the headline", type: "string", group: "hero" }),
    defineField({
      name: "heroHeadlineLines",
      title: "Headline",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "string" })],
      description: "Each item starts on a new line.",
      validation: (r) => r.max(3),
    }),
    defineField({
      name: "heroHighlightWords",
      title: "Words to underline",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "string" })],
      description: "Words from the headline that get the red underline.",
    }),
    defineField({ name: "heroIntro", title: "Intro paragraph", type: "text", rows: 3, group: "hero", validation: (r) => r.max(280) }),
    { ...imageWithAlt("heroImage", "Main photo"), group: "hero" },
    { ...imageWithAlt("heroInsetImage", "Small inset photo"), group: "hero" },
    defineField({ name: "heroInsetCaption", title: "Inset caption", type: "string", group: "hero" }),

    defineField({
      name: "impactStats",
      title: "Numbers beside the register",
      type: "array",
      group: "story",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", description: 'e.g. "150+"', validation: (r) => r.required() }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({
      name: "notebookQuote",
      title: "Notebook quote",
      type: "object",
      group: "story",
      fields: [
        defineField({ name: "text", title: "Quote (Hindi/Marathi)", type: "string" }),
        defineField({ name: "translation", title: "English translation", type: "string" }),
        defineField({ name: "note", title: "Small note under it", type: "string" }),
      ],
    }),

    defineField({
      name: "contact",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "addressLines", title: "Address lines", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "locality", title: "Area", type: "string" }),
        defineField({ name: "city", type: "string" }),
        defineField({ name: "state", type: "string" }),
        defineField({ name: "postalCode", title: "PIN code", type: "string", validation: (r) => r.regex(/^\d{6}$/, { name: "6-digit PIN" }) }),
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "email", type: "string", validation: (r) => r.email() }),
      ],
    }),
    defineField({
      name: "legal",
      title: "Registration",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "registrationNo", title: "Public trust registration no.", type: "string" }),
        defineField({ name: "pan", title: "PAN", type: "string" }),
        defineField({ name: "eightyGNo", title: "80G number", type: "string" }),
        defineField({ name: "eightyGDate", title: "80G date", type: "date" }),
      ],
    }),

    defineField({ name: "donateUrl", title: "Donation page URL", type: "url", group: "links" }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      group: "links",
      description: "Digits only, with country code, e.g. 918108103856.",
      validation: (r) => r.regex(/^\d{10,15}$/, { name: "digits only" }),
    }),
    defineField({
      name: "socials",
      title: "Social profiles",
      type: "array",
      group: "links",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: { list: ["facebook", "instagram", "x", "linkedin", "youtube"] },
              validation: (r) => r.required(),
            }),
            defineField({ name: "url", type: "url", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
