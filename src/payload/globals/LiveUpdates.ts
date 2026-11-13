import type { GlobalConfig } from "payload";

import { revalidateGlobal } from "../hooks/revalidate";

/** Icons editors can pick for a counter. Keep in sync with `LiveIcon` in src/lib/cms/types.ts. */
export const LIVE_ICONS = [
  { label: "Pouch / school kit", value: "pouch" },
  { label: "Notebook", value: "notebook" },
  { label: "Blood drop", value: "blood" },
  { label: "Stethoscope (health)", value: "health" },
  { label: "People", value: "people" },
  { label: "Plant (environment)", value: "tree" },
  { label: "Graduation cap (students)", value: "school" },
  { label: "Heart (care)", value: "heart" },
] as const;

/**
 * The live ticker under the header: running totals the trust updates as they
 * grow ("1,500+ pouches given to students"). The latest camp, the next camp and
 * the number of camps on the register are added automatically from Events.
 */
export const LiveUpdates: GlobalConfig = {
  slug: "live-updates",
  label: "Live updates ticker",
  admin: {
    group: "Homepage",
    description:
      "Running totals shown in the scrolling “Live” band at the top of the homepage. Update a number and save — the site shows it straight away, with today’s date as “updated”. Latest camp, next camp and the camp count are added automatically.",
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal()] },
  fields: [
    {
      name: "counters",
      label: "Totals",
      type: "array",
      maxRows: 8,
      labels: { singular: "Total", plural: "Totals" },
      admin: { initCollapsed: false },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "value",
              label: "Number",
              type: "number",
              required: true,
              min: 0,
              admin: { width: "20%" },
            },
            {
              name: "plus",
              label: "Show as “1,500+”",
              type: "checkbox",
              defaultValue: true,
              admin: { width: "20%", style: { alignSelf: "center" } },
            },
            {
              name: "label",
              label: "What it counts",
              type: "text",
              required: true,
              maxLength: 60,
              admin: { width: "35%", description: "Shown after the number, e.g. “pouches given to students”." },
            },
            {
              name: "icon",
              type: "select",
              required: true,
              defaultValue: "heart",
              options: [...LIVE_ICONS],
              admin: { width: "25%" },
            },
          ],
        },
      ],
    },
  ],
};
