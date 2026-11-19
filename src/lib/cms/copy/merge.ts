import type { CopyImage } from "./defaults";

/**
 * Laying CMS values over the built-in copy: a value from /admin wins unless
 * it's empty, field by field, all the way down. Shapes come from the defaults,
 * so anything the CMS returns that the site doesn't know about is ignored.
 */

type Media = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** A default that stands for a photo (it is replaced by an upload in the CMS). */
export const isImage = (v: unknown): v is CopyImage => isObject(v) && typeof v.src === "string" && "alt" in v;

/** `[{ value }]` rows → strings; object rows lose Payload's row id. */
function mergeArray(fallback: unknown[], raw: unknown): unknown[] {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;
  // Payload adds an `id` to every row; the site's shapes don't have one.
  const rows = raw.filter(isObject).map((row) => Object.fromEntries(Object.entries(row).filter(([k]) => k !== "id")));
  const template = fallback[0];
  if (typeof template === "string" || rows.every((r) => Object.keys(r).length === 1 && "value" in r)) {
    const values = rows.map((r) => r.value).filter((v): v is string => typeof v === "string" && v.trim() !== "");
    return values.length > 0 ? values : fallback;
  }
  // Rows of fields (links): fill gaps from the template, drop rows left empty.
  const filled = rows
    .map((row) => (template ? mergeCopy(template, row) : row))
    .filter((row) => isObject(row) && Object.values(row).some((v) => typeof v === "string" && v.trim() !== ""));
  return filled.length > 0 ? filled : fallback;
}

function toImage(raw: unknown, fallback: CopyImage): CopyImage {
  if (!isObject(raw)) return fallback;
  const m = raw as Media;
  if (!m.url) return fallback;
  return {
    src: m.url,
    alt: m.alt?.trim() || fallback.alt,
    width: m.width ?? undefined,
    height: m.height ?? undefined,
  };
}

export function mergeCopy<T>(fallback: T, raw: unknown): T {
  if (typeof fallback === "string") {
    return (typeof raw === "string" && raw.trim() !== "" ? raw : fallback) as T;
  }
  if (typeof fallback === "number" || typeof fallback === "boolean") {
    return (typeof raw === typeof fallback ? raw : fallback) as T;
  }
  if (Array.isArray(fallback)) return mergeArray(fallback, raw) as T;
  if (isImage(fallback)) return toImage(raw, fallback) as T;
  if (isObject(fallback)) {
    const source = isObject(raw) ? raw : {};
    return Object.fromEntries(Object.entries(fallback).map(([key, value]) => [key, mergeCopy(value, source[key])])) as T;
  }
  return fallback;
}
