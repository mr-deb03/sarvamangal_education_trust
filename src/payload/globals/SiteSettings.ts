import type { GlobalConfig } from "payload";

import { revalidateGlobal } from "../hooks/revalidate";

/** Any field left empty falls back to the website's built-in content. */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: { group: "Homepage", description: "Homepage hero, numbers, contact details and links. Empty fields use the built-in text." },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal()] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Homepage hero",
          fields: [
            { name: "heroEyebrow", label: "Small line above the headline", type: "text" },
            {
              name: "heroHeadlineLines",
              label: "Headline",
              type: "array",
              maxRows: 3,
              admin: { description: "Each line starts on a new line." },
              fields: [{ name: "line", type: "text", required: true }],
            },
            {
              name: "heroHighlightWords",
              label: "Words to underline",
              type: "array",
              admin: { description: "Words from the headline that get the red underline." },
              fields: [{ name: "word", type: "text", required: true }],
            },
            { name: "heroIntro", label: "Intro paragraph", type: "textarea", maxLength: 280 },
            {
              type: "row",
              fields: [
                { name: "heroImage", label: "Main photo", type: "upload", relationTo: "media", admin: { width: "50%" } },
                { name: "heroInsetImage", label: "Small inset photo", type: "upload", relationTo: "media", admin: { width: "50%" } },
              ],
            },
            { name: "heroInsetCaption", label: "Inset caption", type: "text" },
          ],
        },
        {
          label: "Numbers & quote",
          fields: [
            {
              name: "impactStats",
              label: "Numbers beside the register",
              type: "array",
              maxRows: 4,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "value", type: "text", required: true, admin: { width: "30%", description: "e.g. “150+”" } },
                    { name: "label", type: "text", required: true, admin: { width: "70%" } },
                  ],
                },
              ],
            },
            {
              name: "notebookQuote",
              label: "Notebook quote",
              type: "group",
              fields: [
                { name: "text", label: "Quote (Hindi/Marathi)", type: "text" },
                { name: "translation", label: "English translation", type: "text" },
                { name: "note", label: "Small note under it", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Contact & registration",
          fields: [
            {
              name: "contact",
              type: "group",
              fields: [
                { name: "addressLines", label: "Address lines", type: "array", fields: [{ name: "line", type: "text", required: true }] },
                {
                  type: "row",
                  fields: [
                    { name: "locality", label: "Area", type: "text", admin: { width: "25%" } },
                    { name: "city", type: "text", admin: { width: "25%" } },
                    { name: "state", type: "text", admin: { width: "25%" } },
                    {
                      name: "postalCode",
                      label: "PIN code",
                      type: "text",
                      admin: { width: "25%" },
                      validate: (value: string | null | undefined) =>
                        !value || /^\d{6}$/.test(value) || "Enter a 6-digit PIN code.",
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "phone", type: "text", admin: { width: "50%" } },
                    { name: "email", type: "email", admin: { width: "50%" } },
                  ],
                },
              ],
            },
            {
              name: "legal",
              label: "Registration",
              type: "group",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "registrationNo", label: "Public trust registration no.", type: "text", admin: { width: "50%" } },
                    { name: "pan", label: "PAN", type: "text", admin: { width: "50%" } },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "eightyGNo", label: "80G number", type: "text", admin: { width: "50%" } },
                    {
                      name: "eightyGDate",
                      label: "80G date",
                      type: "date",
                      admin: { width: "50%", date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" } },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Links",
          fields: [
            { name: "donateUrl", label: "Donation page URL", type: "text" },
            {
              name: "whatsappNumber",
              label: "WhatsApp number",
              type: "text",
              admin: { description: "Digits only, with country code, e.g. 918108103856." },
              validate: (value: string | null | undefined) =>
                !value || /^\d{10,15}$/.test(value) || "Digits only, with the country code.",
            },
            {
              name: "socials",
              label: "Social profiles",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "platform",
                      type: "select",
                      required: true,
                      options: [
                        { label: "Facebook", value: "facebook" },
                        { label: "Instagram", value: "instagram" },
                        { label: "X (Twitter)", value: "x" },
                        { label: "LinkedIn", value: "linkedin" },
                        { label: "YouTube", value: "youtube" },
                      ],
                      admin: { width: "30%" },
                    },
                    { name: "url", type: "text", required: true, admin: { width: "70%" } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
