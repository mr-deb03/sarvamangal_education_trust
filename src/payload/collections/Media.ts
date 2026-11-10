import path from "path";
import { fileURLToPath } from "url";

import type { CollectionConfig } from "payload";

import { revalidateCollection } from "../hooks/revalidate";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Photo", plural: "Photos & logos" },
  admin: { group: "Content", description: "Every photo and logo used on the site." },
  access: { read: () => true },
  // Photos appear everywhere, so a change refreshes all cached content.
  hooks: revalidateCollection(),
  upload: {
    // Local disk in development. For a serverless host, add a storage adapter
    // (@payloadcms/storage-s3 or storage-vercel-blob) — see CLAUDE.md.
    staticDir: path.resolve(dirname, "../../../media"),
    mimeTypes: ["image/*"],
    focalPoint: true,
    // Keep originals a sensible size; next/image does the per-device resizing.
    resizeOptions: { width: 2400, withoutEnlargement: true },
    imageSizes: [{ name: "thumbnail", width: 480 }],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      label: "Describe the photo",
      type: "text",
      required: true,
      maxLength: 160,
      admin: {
        description:
          "What a blind visitor (and Google) should know, e.g. “A doctor checks an elderly woman’s knee at the free orthopedic camp”.",
      },
    },
  ],
};
