/**
 * Fixed choices shared by the Payload config and the website's types.
 * Dependency-free (like ./tags.ts) so both sides can import it; each list is
 * the single source for its type, so the admin options and the site never drift.
 */

export const LIVE_ICON_OPTIONS = [
  { label: "Pouch / school kit", value: "pouch" },
  { label: "Notebook", value: "notebook" },
  { label: "Blood drop", value: "blood" },
  { label: "Stethoscope (health)", value: "health" },
  { label: "People", value: "people" },
  { label: "Plant (environment)", value: "tree" },
  { label: "Graduation cap (students)", value: "school" },
  { label: "Heart (care)", value: "heart" },
] as const;

export type LiveIcon = (typeof LIVE_ICON_OPTIONS)[number]["value"];

export const SOCIAL_PLATFORM_OPTIONS = [
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "X (Twitter)", value: "x" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "YouTube", value: "youtube" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORM_OPTIONS)[number]["value"];
