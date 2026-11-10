import { defineField } from "sanity";

/** An image with required alt text — the site never renders a photo without one. */
export function imageWithAlt(name: string, title: string, options: { required?: boolean; description?: string } = {}) {
  return defineField({
    name,
    title,
    type: "image",
    description: options.description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Describe the photo",
        type: "string",
        description:
          'What a blind visitor (and Google) should know, e.g. "A doctor checks an elderly woman’s knee at the free orthopedic camp".',
        validation: (r) => r.required().max(160),
      }),
    ],
    validation: options.required ? (r) => r.required() : undefined,
  });
}

export const orderField = defineField({
  name: "order",
  title: "Display order",
  type: "number",
  description: "Lower numbers show first.",
  initialValue: 10,
});
