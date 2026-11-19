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
  description:
    "The events, camp, causes, cause, about, volunteer, CSR, contact and not-found pages: titles for Google, headings and buttons.",
  defaults: defaultCopy.pages,
  tabLabels: { about: "About page", volunteer: "Volunteer page", csr: "CSR page", contact: "Contact page" },
});

export const PolicyText = copyGlobal({
  slug: COPY_GLOBALS.policies,
  label: "Policies",
  description:
    "The privacy policy and terms & conditions, section by section. In a section's text: a blank line starts a new paragraph, a line starting “- ” is a bullet point, **double stars** make words bold.",
  defaults: defaultCopy.policies,
  tabLabels: { privacy: "Privacy policy", terms: "Terms & conditions" },
});

export const FormText = copyGlobal({
  slug: COPY_GLOBALS.forms,
  label: "Forms",
  description: "The volunteer, CSR and contact forms: labels, hints, what to fix, and the thank-you notes.",
  defaults: defaultCopy.forms,
  tabLabels: { common: "All forms", errors: "What to fix", volunteer: "Volunteer form", csr: "CSR form", contact: "Contact form" },
});

export const LabelsText = copyGlobal({
  slug: COPY_GLOBALS.labels,
  label: "Buttons & labels",
  description: "Short labels used across the site, WhatsApp and calendar messages, and screen-reader labels.",
  defaults: defaultCopy.labels,
});

export const copyGlobals = [SiteLayoutText, HomepageText, PageText, PolicyText, FormText, LabelsText];
