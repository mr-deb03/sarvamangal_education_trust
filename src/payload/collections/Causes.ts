import type { CollectionConfig } from "payload";

import { orderField, slugField } from "../fields";
import { revalidateCollection } from "../hooks/revalidate";

export const Causes: CollectionConfig = {
  slug: "causes",
  labels: { singular: "Cause", plural: "Causes" },
  admin: { group: "Content", useAsTitle: "title", defaultColumns: ["title", "tagline", "order"] },
  defaultSort: "order",
  access: { read: () => true },
  hooks: revalidateCollection(),
  fields: [
    { name: "title", type: "text", required: true },
    slugField("title", "/causes/"),
    {
      name: "tagline",
      type: "text",
      required: true,
      maxLength: 48,
      admin: { description: "A short promise, e.g. “Care that comes to you”." },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      maxLength: 200,
      admin: { description: "Two sentences for the homepage card." },
    },
    { name: "image", label: "Card photo", type: "upload", relationTo: "media", required: true },
    orderField,
  ],
};
