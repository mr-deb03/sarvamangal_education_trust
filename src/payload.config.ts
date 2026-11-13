import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Causes } from "./payload/collections/Causes";
import { Events } from "./payload/collections/Events";
import { DonationTiers, Faqs, Supporters, Testimonials } from "./payload/collections/Homepage";
import { Media } from "./payload/collections/Media";
import { Users } from "./payload/collections/Users";
import { FundraisingAppeal } from "./payload/globals/FundraisingAppeal";
import { LiveUpdates } from "./payload/globals/LiveUpdates";
import { SiteSettings } from "./payload/globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * DATABASE_URI picks the database:
 *   postgres://…        → Postgres (production, and local dev with Postgres)
 *   file:./local.db     → SQLite file, for local dev without Postgres
 */
const databaseUri = process.env.DATABASE_URI ?? "";

const db = databaseUri.startsWith("file:")
  ? sqliteAdapter({ client: { url: databaseUri } })
  : postgresAdapter({
      pool: { connectionString: databaseUri },
      migrationDir: path.resolve(dirname, "migrations"),
    });

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " · Sarvamangal admin",
      icons: [{ rel: "icon", type: "image/png", url: "/brand/sarvamangal-mark.png" }],
    },
    components: {
      // Labelled "Log out" buttons: always visible in the header, and in the
      // sidebar instead of Payload's unlabelled icon.
      actions: ["/payload/components/LogoutButton#HeaderLogoutButton"],
      logout: { Button: "/payload/components/LogoutButton#LogoutButton" },
      graphics: {
        Logo: "/payload/components/AdminLogo#AdminLogo",
        Icon: "/payload/components/AdminLogo#AdminIcon",
      },
    },
    dateFormat: "d MMM yyyy",
  },
  collections: [Events, Causes, Media, DonationTiers, Testimonials, Supporters, Faqs, Users],
  globals: [SiteSettings, FundraisingAppeal, LiveUpdates],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db,
  sharp,
});
