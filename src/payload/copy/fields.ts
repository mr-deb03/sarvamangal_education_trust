import type { Field, GlobalConfig, Tab } from "payload";

import { isImage } from "../../lib/cms/copy/merge";
import { anyone, signedIn } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";
import { linkHref } from "../validators";

/**
 * Admin fields for website text, generated from the built-in copy
 * (src/lib/cms/copy/defaults.ts) so the form and the site can never drift:
 *
 * - text → a text field (long text → a textarea), pre-filled with the current wording;
 * - `{ one, other }` → a pair of fields for "1 camp" / "5 camps";
 * - a list of words → a repeatable list; a list of links → label + link rows;
 * - a photo → an upload (empty keeps the built-in photo).
 *
 * Anything left empty falls back to the built-in text on the website.
 */

/** Plain labels for the keys that repeat across sections. Others are spelled out from the key. */
const LABELS: Record<string, string> = {
  eyebrow: "Small label above the title",
  title: "Heading",
  intro: "Intro text",
  text: "Text",
  cta: "Button text",
  link: "Button link",
  links: "Menu links",
  label: "Label",
  href: "Link",
  showCauses: "Show the causes menu",
  metaTitle: "Title in Google and on shared links",
  metaDescription: "Description in Google (about 155 characters)",
  breadcrumb: "Name in the breadcrumb trail",
  whatsappMessage: "WhatsApp message (typed in for the visitor)",
  one: "For 1",
  other: "For 2 or more",
  image: "Photo",
  // Sections and groups
  nav: "Header",
  footer: "Footer",
  whatsapp: "WhatsApp chat",
  comingUp: "Coming up",
  register: "Camp register",
  involved: "Get involved",
  voices: "Supporters",
  give: "Give section",
  faq: "FAQ",
  finalCta: "Closing section",
  csr: "CSR card",
  notify: "Next-camp card",
  notFound: "Page not found",
  event: "Camp page",
  events: "Events page",
  cause: "Cause page",
  accessibility: "Screen-reader labels",
  messages: "Messages & share text",
};

const TOKEN_HELP: Record<string, string> = {
  n: "the number",
  total: "the number of camps",
  year: "the year",
  firstYear: "the year of the first camp",
  foundingYear: "the founding year",
  siteName: "the trust's name",
  shortName: "the short name",
  title: "the camp's title",
  date: "the date",
  day: "the day",
  place: "the place",
  cause: "the cause",
  tagline: "the cause's tagline",
  amount: "the amount",
  goal: "the goal",
  counted: "what is counted",
  phone: "the phone number",
  platform: "the social network",
  when: "the day and time",
  time: "the time",
  start: "the first day",
  end: "the last day",
};

export function humanize(key: string) {
  if (LABELS[key]) return LABELS[key];
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function tokenHint(text: string): string | undefined {
  const tokens = [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!))];
  if (tokens.length === 0) return undefined;
  const parts = tokens.map((t) => `{${t}} = ${TOKEN_HELP[t] ?? t}`);
  return `Keep ${tokens.map((t) => `{${t}}`).join(", ")} as written — the site fills ${tokens.length === 1 ? "it" : "them"} in (${parts.join("; ")}).`;
}

/** A link field: named like one, and its default is empty or looks like a path or address (not "Home link" text). */
const isLinkField = (key: string, value: string) =>
  (key === "href" || key === "link" || key.endsWith("Link")) && (value === "" || /^(\/|#|https?:|mailto:|tel:)/.test(value));
const isPlural = (v: unknown): v is { one: string; other: string } =>
  typeof v === "object" && v !== null && !Array.isArray(v) && Object.keys(v).join() === "one,other";

/** The shape of one row in a list, from its first default row (or, for empty link lists, a link). */
function rowTemplate(key: string, rows: unknown[]): unknown {
  return rows[0] ?? (key.endsWith("Links") ? { label: "", href: "" } : "");
}

function fieldFor(key: string, value: unknown): Field {
  const label = humanize(key);

  if (typeof value === "string") {
    const long = value.length > 80;
    const linkField = isLinkField(key, value);
    const description = linkField
      ? "A page on this site (/events), a section (#contact), or a full https:// address. Leave empty for the default shown in the hint."
      : tokenHint(value);
    return {
      name: key,
      label,
      type: long ? "textarea" : "text",
      defaultValue: value || undefined,
      ...(linkField ? { validate: linkHref } : {}),
      admin: { ...(description ? { description } : {}), ...(long ? { rows: 3 } : {}) },
    } as Field;
  }

  if (typeof value === "boolean") return { name: key, label, type: "checkbox", defaultValue: value };
  if (typeof value === "number") return { name: key, label, type: "number", defaultValue: value };

  if (isImage(value)) {
    return {
      name: key,
      label,
      type: "upload",
      relationTo: "media",
      admin: { description: "Leave empty to keep the built-in photo." },
    };
  }

  if (isPlural(value)) {
    return {
      name: key,
      label,
      type: "group",
      admin: { description: tokenHint(`${value.one} ${value.other}`) },
      fields: [
        {
          type: "row",
          fields: [
            { name: "one", label: LABELS.one, type: "text", defaultValue: value.one, admin: { width: "50%" } },
            { name: "other", label: LABELS.other, type: "text", defaultValue: value.other, admin: { width: "50%" } },
          ],
        },
      ],
    };
  }

  if (Array.isArray(value)) {
    const template = rowTemplate(key, value);
    if (typeof template === "string") {
      return {
        name: key,
        label,
        type: "array",
        defaultValue: value.map((v) => ({ value: v })),
        labels: { singular: "Item", plural: "Items" },
        fields: [{ name: "value", label: "Text", type: "text", required: true }],
      };
    }
    const rowFields = Object.entries(template as Record<string, unknown>).map(([k, v]) => {
      const f = fieldFor(k, v) as Field & { defaultValue?: unknown; required?: boolean };
      // Rows carry their own values; only the checkbox keeps a default.
      if (f.type !== "checkbox") delete f.defaultValue;
      if (k === "label" || k === "href") f.required = true;
      return f;
    });
    return {
      name: key,
      label,
      type: "array",
      defaultValue: value,
      labels: { singular: "Link", plural: "Links" },
      admin: { initCollapsed: false },
      fields: [{ type: "row", fields: rowFields }],
    } as Field;
  }

  if (typeof value === "object" && value !== null) {
    return { name: key, label, type: "group", fields: copyFields(value as Record<string, unknown>) };
  }

  throw new Error(`Unsupported copy value at "${key}"`);
}

/** Fields for one block of copy. */
export function copyFields(defaults: Record<string, unknown>): Field[] {
  return Object.entries(defaults).map(([key, value]) => fieldFor(key, value));
}

/**
 * A "Website text" global: each section of the copy on its own tab.
 * Editors and admins can change it (owner's call, Nov 2026).
 */
export function copyGlobal({
  slug,
  label,
  description,
  defaults,
}: {
  slug: string;
  label: string;
  description: string;
  defaults: Record<string, unknown>;
}): GlobalConfig {
  const sections = Object.entries(defaults).filter(
    ([, v]) => typeof v === "object" && v !== null && !Array.isArray(v) && !isImage(v) && !isPlural(v),
  );
  const loose = Object.entries(defaults).filter(([key]) => !sections.some(([k]) => k === key));

  const tabs: Tab[] = [
    ...sections.map(([key, value]): Tab => ({
      name: key,
      label: humanize(key),
      fields: copyFields(value as Record<string, unknown>),
    })),
    ...(loose.length > 0 ? [{ label: "Other", fields: copyFields(Object.fromEntries(loose)) }] : []),
  ];

  return {
    slug,
    label,
    admin: { group: "Website text", description },
    access: { read: anyone, readVersions: signedIn, update: signedIn },
    versions: { max: 25 },
    hooks: { afterChange: [revalidateGlobal()] },
    fields: [{ type: "tabs", tabs }],
  };
}
