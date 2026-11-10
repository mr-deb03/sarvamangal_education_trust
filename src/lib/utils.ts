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
  const url = new URL(base);
  if (opts.amount) url.searchParams.set("amount", String(opts.amount));
  if (opts.cause) url.searchParams.set("cause", opts.cause);
  return url.toString();
}

export function whatsappHref(number: string, text: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
