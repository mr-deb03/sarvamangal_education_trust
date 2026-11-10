import type { Field } from "payload";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

/**
 * URL slug, filled in from `source` when left empty. Not marked `required`
 * so the admin form doesn't block saving before the hook can fill it.
 */
export function slugField(source: string, routeHint: string): Field {
  return {
    name: "slug",
    label: "Page address",
    type: "text",
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description: `Becomes ${routeHint}<this>. Filled in from the title if left empty. Don’t change it once published — old links would break.`,
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === "string" && value.trim()) return slugify(value);
          const fromSource = data?.[source];
          return typeof fromSource === "string" ? slugify(fromSource) : value;
        },
      ],
    },
  };
}

export const orderField: Field = {
  name: "order",
  label: "Display order",
  type: "number",
  defaultValue: 10,
  admin: { position: "sidebar", description: "Lower numbers show first." },
};
