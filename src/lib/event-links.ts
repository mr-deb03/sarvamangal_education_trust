import type { CampEvent } from "@/lib/cms/types";
import { formatDate, formatPlace } from "@/lib/format";
import { ROUTES, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Links that help people act on an upcoming camp: save it, find it, pass it on.
 * Pure functions of the event — no clock — so they're safe in any render.
 */

const DAY = 86_400_000;
const compact = (date: string) => date.replaceAll("-", "");
const nextDay = (date: string) => new Date(Date.parse(`${date}T00:00:00Z`) + DAY).toISOString().slice(0, 10);

/** Where shared and saved links point: the camp's own page. */
export const upcomingUrl = (e: CampEvent) => `${SITE_URL}${ROUTES.event(e.slug)}`;

/** "Venue, Area, City, State" — what a maps search or calendar needs. */
export function eventAddress(e: CampEvent) {
  return [e.venue, e.locality, e.city, e.state].filter(Boolean).join(", ");
}

/** Where people will find it on the page: "Venue, Area, City, State". */
export function eventPlace(e: CampEvent) {
  return e.venue ? `${e.venue}, ${formatPlace(e)}` : formatPlace(e);
}

/** "Sun, 23 Nov" — or "Sat, 22 Nov – Sun, 23 Nov" for camps over several days. */
export function eventDayLabel(e: CampEvent) {
  const opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" };
  const start = formatDate(e.startDate, opts);
  return e.endDate && e.endDate !== e.startDate ? `${start} – ${formatDate(e.endDate, opts)}` : start;
}

/** Google Calendar "add event" link. All-day, because the time is free text ("9 am – 1 pm"). */
export function calendarHref(e: CampEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${compact(e.startDate)}/${compact(nextDay(e.endDate ?? e.startDate))}`,
    ctz: "Asia/Kolkata",
    location: eventAddress(e),
    details: [
      `Organised by ${SITE_NAME}. Entry is free.`,
      e.timeLabel ? `Time: ${e.timeLabel}` : null,
      e.summary ?? null,
      upcomingUrl(e),
    ]
      .filter(Boolean)
      .join("\n\n"),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Google Maps search for the venue, when there's more to go on than the state. */
export function directionsHref(e: CampEvent) {
  if (!e.venue && !e.locality && !e.city) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventAddress(e))}`;
}

/** A WhatsApp message anyone can forward to family or a building group. */
export function shareHref(e: CampEvent) {
  const when = [eventDayLabel(e), e.timeLabel].filter(Boolean).join(", ");
  const text = `${e.title} — ${when}, at ${eventPlace(e)}. Entry is free. Organised by ${SITE_NAME}.\n${upcomingUrl(e)}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
