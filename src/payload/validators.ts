/** Field validators shared by collections and globals. */

/** Optional absolute https:// address. Anything else would break links (or the page) on the site. */
export function httpsUrl(value: string | null | undefined): true | string {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || "Use the full address, starting with https://";
  } catch {
    return "Use the full address, starting with https://";
  }
}

/** Optional link: an internal path ("/events"), a full https:// address, mailto: or tel:. */
export function linkHref(value: string | null | undefined): true | string {
  if (!value) return true;
  if (/^\/(?!\/)/.test(value) || /^#/.test(value) || /^(mailto|tel):/.test(value)) return true;
  return httpsUrl(value);
}
