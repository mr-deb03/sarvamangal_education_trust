import type { GlobalConfig } from "payload";

import { revalidateGlobal } from "../hooks/revalidate";

type Siblings = { siblingData: Record<string, unknown> };

const isFilled = (value: unknown) => value !== null && value !== undefined && value !== "";

/** Needed only when the appeal is switched on. */
function requiredWhenShown(message: string) {
  return (value: unknown, { siblingData }: Siblings) => !siblingData?.enabled || isFilled(value) || message;
}

const countsItems = (data: Record<string, unknown> | undefined) => data?.measure === "items";

/**
 * The current appeal on the homepage: money raised towards a goal, or things
 * given out (pouches, kits…). With a goal it shows a progress bar; without one
 * it shows the running total ("1,500+ pouches distributed so far").
 * Hidden unless switched on, and hides itself after the end date.
 */
export const FundraisingAppeal: GlobalConfig = {
  slug: "fundraising-appeal",
  label: "Fundraising appeal",
  admin: {
    group: "Homepage",
    description:
      "The current appeal on the homepage. Update “So far” as donations come in or as more is given out.",
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal()] },
  fields: [
    {
      name: "enabled",
      label: "Show on homepage",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "title",
      type: "text",
      maxLength: 80,
      admin: { description: "What the appeal is for, e.g. “Pouch distribution” or “Fund the next free health camp”." },
      validate: requiredWhenShown("Add a title to show the appeal."),
    },
    {
      name: "description",
      type: "textarea",
      maxLength: 280,
      admin: { description: "One or two sentences on what donations make possible." },
    },
    {
      name: "measure",
      label: "What are you counting?",
      type: "radio",
      defaultValue: "money",
      options: [
        { label: "Money raised (₹)", value: "money" },
        { label: "Things given out (pouches, kits…)", value: "items" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "raisedAmount",
          label: "So far",
          type: "number",
          min: 0,
          defaultValue: 0,
          admin: { width: "25%", description: "Rupees raised, or how many given out." },
          validate: (value: unknown, { siblingData }: Siblings) =>
            !siblingData?.enabled ||
            (typeof value === "number" && value > 0) ||
            (isFilled(value) && isFilled(siblingData.goalAmount)) ||
            "Enter the total so far (or set a goal).",
        },
        {
          name: "itemLabel",
          label: "Counted as",
          type: "text",
          maxLength: 40,
          admin: {
            width: "25%",
            description: "Shown after the number, e.g. “pouches distributed”.",
            condition: countsItems,
          },
          validate: (value: unknown, { siblingData }: Siblings) =>
            !siblingData?.enabled ||
            !countsItems(siblingData) ||
            isFilled(value) ||
            "Say what is being counted, e.g. “pouches distributed”.",
        },
        {
          name: "goalAmount",
          label: "Goal",
          type: "number",
          min: 1,
          admin: { width: "25%", description: "Optional. Leave empty for no limit (no progress bar)." },
        },
        {
          name: "donorCount",
          label: "Number of donors",
          type: "number",
          min: 0,
          admin: { width: "25%", description: "Optional." },
        },
      ],
    },
    {
      name: "atLeast",
      label: "Show “So far” as “more than” (adds a +, e.g. 1,500+)",
      type: "checkbox",
      defaultValue: false,
    },
    {
      type: "row",
      fields: [
        {
          name: "endDate",
          label: "Appeal ends",
          type: "date",
          admin: {
            width: "50%",
            date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
            description: "Optional. The appeal disappears from the homepage after this date.",
          },
        },
        {
          name: "cause",
          type: "relationship",
          relationTo: "causes",
          admin: { width: "50%", description: "Optional. Its photo is used if you don’t add one below." },
        },
      ],
    },
    {
      name: "image",
      label: "Photo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional." },
    },
  ],
};
