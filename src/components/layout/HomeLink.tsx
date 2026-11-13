"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

import { ROUTES } from "@/lib/site";

/**
 * The logo's link: always lands on the top of the homepage.
 *
 * - On the homepage: scrolls smoothly back to the top (and clears any
 *   "#register"-style hash) — unless the visitor prefers reduced motion.
 * - Anywhere else: a full page load of the homepage. The in-app navigation
 *   showed nothing for about a second while it fetched the page, then landed
 *   part-way down (it scrolls the page section, not the window, into view), so
 *   clicking the logo felt broken. A plain load shows the browser's own
 *   progress straight away and always opens at the top.
 *
 * Modified clicks (new tab, new window) behave as usual.
 */
export function HomeLink({ onClick, ...props }: Omit<ComponentProps<typeof Link>, "href" | "prefetch">) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (pathname !== ROUTES.home) {
      window.location.assign(ROUTES.home);
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    if (window.location.hash) window.history.replaceState(window.history.state, "", ROUTES.home);
  }

  return <Link href={ROUTES.home} prefetch={false} onClick={handleClick} {...props} />;
}
