import { LogOut } from "lucide-react";
import Link from "next/link";

/**
 * Labelled "Log out" buttons for the admin, so the trust's volunteers can find it.
 * Payload's own logout is an unlabelled icon inside the sidebar, which starts
 * closed on laptop-size screens.
 *
 * /admin/logout is Payload's logout route (admin route + routes.logout).
 * prefetch={false}: prefetching the logout route would sign the user out.
 */
function LogoutLink({ variant }: { variant: "header" | "sidebar" }) {
  return (
    <Link
      href="/admin/logout"
      prefetch={false}
      className={`sarvamangal-logout sarvamangal-logout--${variant}`}
      title="Log out of the admin"
    >
      <LogOut aria-hidden size={variant === "header" ? 16 : 18} strokeWidth={2} />
      <span>Log out</span>
    </Link>
  );
}

/** Top-right of every admin page, next to the account icon (admin.components.actions). */
export function HeaderLogoutButton() {
  return <LogoutLink variant="header" />;
}

/** Bottom of the sidebar, replacing Payload's icon (admin.components.logout.Button). */
export function LogoutButton() {
  return <LogoutLink variant="sidebar" />;
}
