import type { CollectionConfig } from "payload";

import { slugField } from "../fields";
import { revalidateCollection } from "../hooks/revalidate";

export const Events: CollectionConfig = {
  slug: "events",
  labels: { singular: "Event", plural: "Events & camps" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "startDate", "cause", "city"],
    description: "Every camp and drive. Future dates show as “Coming up” on the homepage; past ones go into the register.",
  },
  defaultSort: "-startDate",
  access: { read: () => true },
  hooks: revalidateCollection(),
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 90,
      admin: { description: "Plain and specific, e.g. “Free Orthopedic Checkup Camp”. The date shows separately." },
    },
    slugField("title", "/events/"),
    {
      type: "tabs",
      tabs: [
        {
          label: "Details",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "startDate",
                  label: "Date",
                  type: "date",
                  required: true,
                  admin: { width: "33%", date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" } },
                },
                {
                  name: "endDate",
                  label: "End date",
                  type: "date",
                  admin: {
                    width: "33%",
                    date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
                    description: "Only for camps over several days.",
                  },
                  validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
                    const start = siblingData?.startDate;
                    if (!value || !start) return true;
                    return new Date(value as string) >= new Date(start as string) || "End date can’t be before the date.";
                  },
                },
                {
                  name: "timeLabel",
                  label: "Time",
                  type: "text",
                  admin: { width: "33%", description: "Optional, e.g. “9 am – 1 pm”." },
                },
              ],
            },
            {
              name: "cause",
              type: "relationship",
              relationTo: "causes",
              required: true,
            },
            {
              name: "summary",
              type: "textarea",
              maxLength: 220,
              admin: { description: "One or two sentences. Shown on cards and as the Google description." },
            },
            { name: "body", label: "Full write-up", type: "richText" },
          ],
        },
        {
          label: "Place",
          fields: [
            { name: "venue", type: "text", admin: { description: "e.g. “R.R. Education Trust Hall, MHADA Colony”" } },
            {
              type: "row",
              fields: [
                { name: "locality", label: "Area", type: "text", admin: { width: "33%", description: "e.g. “Bhandup West”" } },
                { name: "city", type: "text", admin: { width: "33%", description: "e.g. “Mumbai”" } },
                { name: "state", type: "text", required: true, defaultValue: "Maharashtra", admin: { width: "33%" } },
              ],
            },
          ],
        },
        {
          label: "Impact",
          fields: [
            {
              name: "beneficiaries",
              label: "People served",
              type: "group",
              admin: { description: "Shown on the register, e.g. “70 patients”." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "count", label: "How many", type: "number", min: 1, admin: { width: "33%" } },
                    { name: "label", label: "Who", type: "text", admin: { width: "33%", description: "“patients”, “children”, “volunteers”…" } },
                    { name: "approximate", label: "Show as “200+”", type: "checkbox", admin: { width: "33%" } },
                  ],
                },
              ],
            },
            {
              name: "partners",
              type: "array",
              labels: { singular: "Partner", plural: "Partners" },
              admin: { description: "Clinics, hospitals, schools or companies that ran the camp with us." },
              fields: [{ name: "name", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Photos",
          fields: [
            { name: "coverImage", label: "Cover photo", type: "upload", relationTo: "media", required: true },
            { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seoTitle",
              label: "Google title",
              type: "text",
              maxLength: 70,
              admin: { description: "Optional. Defaults to the event title. Keep under 60 characters." },
            },
            {
              name: "seoDescription",
              label: "Google description",
              type: "textarea",
              maxLength: 170,
              admin: { description: "Optional. Defaults to the summary. Keep under 160 characters." },
            },
          ],
        },
      ],
    },
  ],
};
