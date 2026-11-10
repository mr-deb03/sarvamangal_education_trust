import type { CampEvent } from "@/lib/cms/types";

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

/** Today's date in India as `YYYY-MM-DD`. Call only inside a `use cache` scope. */
export function todayInIndia(now: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
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
