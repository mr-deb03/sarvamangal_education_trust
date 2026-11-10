import type { CollectionConfig } from "payload";

/** People who can sign in to /admin. The first one is created on the first visit. */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Team member", plural: "Team members" },
  admin: { group: "Admin", useAsTitle: "email", defaultColumns: ["name", "email"] },
  auth: true,
  fields: [{ name: "name", type: "text" }],
};
