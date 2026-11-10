import { CalendarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { imageWithAlt } from "./fields";

export const eventType = defineType({
  name: "event",
  title: "Event / camp",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "place", title: "Place" },
    { name: "impact", title: "Impact" },
    { name: "media", title: "Photos" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "details",
      description: 'Plain and specific, e.g. "Free Orthopedic Checkup Camp". The date shows separately.',
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      group: "details",
      description: "Becomes sarvamangaleducationtrust.org/events/<this>. Don’t change it once published — old links would break.",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "startDate",
      title: "Date",
      type: "date",
      group: "details",
      options: { dateFormat: "D MMM YYYY" },
      description: "Future dates show as “Coming up” on the homepage; past dates go into the register.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "date",
      group: "details",
      options: { dateFormat: "D MMM YYYY" },
      description: "Only for camps that run over several days.",
      validation: (r) =>
        r.custom((end, ctx) => {
          const start = (ctx.document as { startDate?: string } | undefined)?.startDate;
          return !end || !start || end >= start ? true : "End date can’t be before the start date.";
        }),
    }),
    defineField({
      name: "timeLabel",
      title: "Time",
      type: "string",
      group: "details",
      description: 'Optional, e.g. "9 am – 1 pm".',
    }),
    defineField({
      name: "cause",
      type: "reference",
      group: "details",
      to: [{ type: "cause" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      group: "details",
      description: "One or two sentences. Shown on cards and as the Google description.",
      validation: (r) => r.max(220),
    }),
    defineField({
      name: "body",
      title: "Full write-up",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Describe the photo", type: "string" })],
        }),
      ],
    }),

    defineField({ name: "venue", type: "string", group: "place", description: 'e.g. "R.R. Education Trust Hall, MHADA Colony"' }),
    defineField({ name: "locality", title: "Area", type: "string", group: "place", description: 'e.g. "Bhandup West"' }),
    defineField({ name: "city", type: "string", group: "place", description: 'e.g. "Mumbai"' }),
    defineField({
      name: "state",
      type: "string",
      group: "place",
      initialValue: "Maharashtra",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "beneficiaries",
      title: "People served",
      type: "object",
      group: "impact",
      description: 'Shown in handwriting on the register, e.g. "70 patients".',
      fields: [
        defineField({ name: "count", title: "How many", type: "number", validation: (r) => r.min(1).integer() }),
        defineField({ name: "label", title: "Who", type: "string", description: '"patients", "children", "volunteers"…' }),
        defineField({ name: "approximate", title: "Show as “200+”", type: "boolean", initialValue: false }),
      ],
    }),
    defineField({
      name: "partners",
      title: "Partners",
      type: "array",
      group: "impact",
      of: [defineArrayMember({ type: "string" })],
      description: "Clinics, hospitals, schools or companies that ran the camp with us.",
    }),

    { ...imageWithAlt("coverImage", "Cover photo", { required: true }), group: "media" },
    defineField({
      name: "gallery",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Describe the photo", type: "string" })],
        }),
      ],
      options: { layout: "grid" },
    }),

    defineField({
      name: "seoTitle",
      title: "Google title",
      type: "string",
      group: "seo",
      description: "Optional. Defaults to the event title. Keep under 60 characters.",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "Google description",
      type: "text",
      rows: 2,
      group: "seo",
      description: "Optional. Defaults to the summary. Keep under 160 characters.",
      validation: (r) => r.max(170),
    }),
  ],
  orderings: [
    { title: "Date, newest first", name: "dateDesc", by: [{ field: "startDate", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", date: "startDate", cause: "cause.title", media: "coverImage" },
    prepare: ({ title, date, cause, media }) => ({
      title,
      subtitle: [date, cause].filter(Boolean).join(" · "),
      media,
    }),
  },
});
