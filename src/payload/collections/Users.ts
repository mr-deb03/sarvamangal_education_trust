import type { CollectionConfig } from "payload";

import { adminsOnly, adminsOnlyField, adminsOrSelf, hiddenFromEditors, ROLE_OPTIONS } from "../access";

/** People who can sign in to /admin. The first one is created on the first visit, as an admin. */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Team member", plural: "Team members" },
  admin: {
    group: "Admin",
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    hidden: hiddenFromEditors,
    description: "Who can sign in. Editors run camps, photos and the homepage; admins also manage settings and the team.",
  },
  auth: true,
  access: {
    read: adminsOrSelf,
    create: adminsOnly,
    update: adminsOrSelf,
    delete: adminsOnly,
  },
  hooks: {
    beforeChange: [
      // The very first account (created on the first visit to /admin) is always an admin.
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const { totalDocs } = await req.payload.count({ collection: "users", req });
        return totalDocs === 0 ? { ...data, role: "admin" } : data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: ROLE_OPTIONS,
      // Only admins can give or change a role — editors can't promote themselves.
      access: { create: adminsOnlyField, update: adminsOnlyField },
      admin: { position: "sidebar" },
    },
  ],
};
