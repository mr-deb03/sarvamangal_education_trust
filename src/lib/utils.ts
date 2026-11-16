import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Inline object-position from an admin-set focal point; undefined keeps the CSS default. */
export function focalStyle(image?: { focalPoint?: { x: number; y: number } }) {
  return image?.focalPoint ? { objectPosition: `${image.focalPoint.x}% ${image.focalPoint.y}%` } : undefined;
}

/**
 * Link to the donation app. `amount` and `cause` are passed as query params;
 * the donation app does not read them yet (see CLAUDE.md), but they are
 * harmless and let analytics attribute which tier was picked.
 */
export function donateHref(base: string, opts: { amount?: number | null; cause?: string } = {}) {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    // A malformed setting must never take the page down; the link still goes where it was set.
    return base;
  }
  if (opts.amount) url.searchParams.set("amount", String(opts.amount));
  if (opts.cause) url.searchParams.set("cause", opts.cause);
  return url.toString();
}

export function whatsappHref(number: string, text: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

/** A link that leaves the site (opens in a new tab where we link it). */
export const isExternal = (href: string) => /^https?:/.test(href);

/**
 * An editor-set link, or — while it's empty (the page doesn't exist yet) — a
 * WhatsApp chat with a ready message, so the button never leads nowhere.
 */
export function linkOrWhatsapp(link: string, number: string, message: string) {
  return link.trim() || whatsappHref(number, message);
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
