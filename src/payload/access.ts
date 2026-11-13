import type { Access, FieldAccess } from "payload";

/**
 * Two roles for the trust's team.
 *
 * - **Admin**: everything — team members, site settings, causes, donation amounts.
 * - **Editor**: the day-to-day content — camps, photos, the live ticker, the appeal,
 *   testimonials, supporters and FAQs.
 *
 * Accounts created before roles existed have no role; they keep full access
 * (treated as admins) so nobody is locked out by the upgrade.
 */
export const ROLE_OPTIONS = [
  { label: "Admin — everything, including team and settings", value: "admin" },
  { label: "Editor — camps, photos and homepage content", value: "editor" },
];

type WithRole = { role?: string | null } | null | undefined;

export function isAdmin(user: unknown): boolean {
  if (!user || typeof user !== "object") return false;
  const role = (user as WithRole)?.role;
  return role === "admin" || role == null;
}

/** Public: the website reads this content. */
export const anyone: Access = () => true;

/** Any signed-in team member. */
export const signedIn: Access = ({ req }) => Boolean(req.user);

export const adminsOnly: Access = ({ req }) => isAdmin(req.user);

/** Admins see everyone; editors see (and edit) only their own account. */
export const adminsOrSelf: Access = ({ req }) => {
  if (isAdmin(req.user)) return true;
  return req.user ? { id: { equals: req.user.id } } : false;
};

export const adminsOnlyField: FieldAccess = ({ req }) => isAdmin(req.user);

/** Visitors see published camps only; the team also sees drafts. */
export const publishedOrSignedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: "published" } };

/** Keeps admin-only sections out of an editor's sidebar. */
export const hiddenFromEditors = ({ user }: { user: unknown }) => !isAdmin(user);
