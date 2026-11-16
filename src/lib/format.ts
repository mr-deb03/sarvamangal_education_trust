import type { CampEvent, SiteSettings } from "@/lib/cms/types";

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

/** The calendar date in India for an instant, as `YYYY-MM-DD`. */
export function indiaDate(instant: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** Today's date in India. Call only inside a `use cache` scope (it reads the clock). */
export function todayInIndia(now: Date) {
  return indiaDate(now);
}

export function formatPlace(e: Pick<CampEvent, "locality" | "city" | "state">) {
  return [e.locality, e.city, e.state].filter(Boolean).join(", ");
}

export function formatBeneficiaries(b: NonNullable<CampEvent["beneficiaries"]>) {
  return `${b.count.toLocaleString("en-IN")}${b.approximate ? "+" : ""} ${b.label}`;
}

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
