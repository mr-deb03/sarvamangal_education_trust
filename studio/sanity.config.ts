import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes, SINGLETON_TYPES } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "your-project-id";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineConfig({
  name: "sarvamangal",
  title: "Sarvamangal Education Trust",
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
            S.divider(),
            S.documentTypeListItem("event").title("Events & camps"),
            S.documentTypeListItem("cause").title("Causes"),
            S.divider(),
            S.documentTypeListItem("donationTier").title("Donation amounts"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("supporter").title("Supporters"),
            S.documentTypeListItem("faq").title("FAQs"),
          ]),
    }),
    visionTool({ defaultApiVersion: "2025-10-01" }),
  ],

  schema: { types: schemaTypes },

  document: {
    // Site settings is a single document: no "create new", no delete/duplicate.
    newDocumentOptions: (prev) => prev.filter((t) => !SINGLETON_TYPES.has(t.templateId)),
    actions: (prev, ctx) =>
      SINGLETON_TYPES.has(ctx.schemaType)
        ? prev.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : prev,
  },
});
