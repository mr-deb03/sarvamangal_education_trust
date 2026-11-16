import { COPY_GLOBALS, defaultCopy } from "../../lib/cms/copy/defaults";

import { copyGlobal } from "./fields";

/** "Website text" in /admin: every heading, button and label on the site. */

export const SiteLayoutText = copyGlobal({
  slug: COPY_GLOBALS.layout,
  label: "Header & footer",
  description: "Menu links, footer text, the WhatsApp chat and the phone Donate bar — on every page.",
  defaults: defaultCopy.layout,
});

export const HomepageText = copyGlobal({
  slug: COPY_GLOBALS.home,
  label: "Homepage sections",
  description: "Headings, intros and buttons of each homepage section. The hero headline and photo are in Site settings.",
  defaults: defaultCopy.home,
});

export const PageText = copyGlobal({
  slug: COPY_GLOBALS.pages,
  label: "Page text",
  description: "The events, camp, causes, cause and not-found pages: titles for Google, headings and buttons.",
  defaults: defaultCopy.pages,
});

export const LabelsText = copyGlobal({
  slug: COPY_GLOBALS.labels,
  label: "Buttons & labels",
  description: "Short labels used across the site, WhatsApp and calendar messages, and screen-reader labels.",
  defaults: defaultCopy.labels,
});

export const copyGlobals = [SiteLayoutText, HomepageText, PageText, LabelsText];
