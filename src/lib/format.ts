import type { CampEvent, Plural, SiteSettings } from "@/lib/cms/types";

type Vars = Record<string, string | number | null | undefined>;

/**
 * Fills `{tokens}` in CMS text: fill("{total} camps since {year}", { total: 35, year: 2016 }).
 * Numbers are written the Indian way (1,500). A token with no value is left out.
 */
export function fill(template: string, vars: Vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    if (value == null) return "";
    return typeof value === "number" ? value.toLocaleString("en-IN") : value;
  });
}

/** The right word form for a count, with `{n}` filled in: plural(1, { one: "{n} camp", other: "{n} camps" }). */
export function plural(n: number, forms: Plural, vars: Vars = {}) {
  return fill(n === 1 ? forms.one : forms.other, { n, ...vars });
}

/**
 * Event dates are calendar dates (`YYYY-MM-DD`) in India. Parse them as UTC
 * midnight and format in UTC so no server or browser timezone shifts the day.
 */
function asUtc(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
) {
  return new Intl.DateTimeFormat("en-IN", { ...options, timeZone: "UTC" }).format(asUtc(date));
}

/**
 * The calendar date in India for an instant, as `YYYY-MM-DD`.
 * With `new Date()`, call only inside a `use cache` scope (it reads the clock).
 */
export function indiaDate(instant: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

export function formatPlace(e: Pick<CampEvent, "locality" | "city" | "state">) {
  return [e.locality, e.city, e.state].filter(Boolean).join(", ");
}

export function formatBeneficiaries(b: NonNullable<CampEvent["beneficiaries"]>) {
  return `${b.count.toLocaleString("en-IN")}${b.approximate ? "+" : ""} ${b.label}`;
}

/** "1,500" — the figure of an amount, without the ₹ sign (see <Rupees>). */
export function formatAmount(amount: number) {
  return amount.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/** "₹1,500" as plain text (meta tags, aria labels, share text). On the page, use <Rupees>. */
export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** The trust's postal address on one line: "Shop No. 1, …, Bhandup West, Mumbai, Maharashtra 400078". */
export function formatAddress(c: SiteSettings["contact"]) {
  return [...c.addressLines, c.locality, c.city, [c.state, c.postalCode].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

/** A Google Maps search for the trust's office. */
export function officeMapHref(c: SiteSettings["contact"]) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(c))}`;
}
