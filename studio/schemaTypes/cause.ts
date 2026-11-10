import { HeartIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { imageWithAlt, orderField } from "./fields";

export const causeType = defineType({
  name: "cause",
  title: "Cause",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      options: { source: "title" },
      description: "Becomes /causes/<this>. Don’t change it once published.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      description: 'A short promise, e.g. "Care that comes to you".',
      validation: (r) => r.required().max(48),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      description: "Two sentences for the homepage card.",
      validation: (r) => r.required().max(200),
    }),
    imageWithAlt("image", "Card photo", { required: true }),
    orderField,
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "tagline", media: "image" } },
});
