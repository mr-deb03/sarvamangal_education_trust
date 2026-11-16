"use client";

import { HeartHandshake } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonClasses } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";

/**
 * Phone-only Donate bar. It stays out of the way while a section with its own
 * Donate button is on screen — anything marked `data-donate-zone` (the hero,
 * the Give section, the closing ask) — so there is never a second Donate
 * button stacked on top of the first. Pages without zones show it once the
 * visitor has scrolled past the first screen.
 */
export function MobileDonateBar({ donateUrl, label }: { donateUrl: string; label: string }) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const zones = [...document.querySelectorAll<HTMLElement>("[data-donate-zone]")];

    if (zones.length === 0) {
      const update = () => setVisible(window.scrollY > window.innerHeight * 0.8);
      update();
      window.addEventListener("scroll", update, { passive: true });
      return () => window.removeEventListener("scroll", update);
    }

    const onScreen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        setVisible(onScreen.size === 0);
      },
      // A zone counts once it's clearly on screen, not when a sliver shows at the bottom.
      { rootMargin: "0px 0px -20% 0px" },
    );
    zones.forEach((zone) => io.observe(zone));
    return () => io.disconnect();
  }, [pathname]);

  // Lets other fixed buttons (the WhatsApp chat) step out of the bar's way.
  useEffect(() => {
    document.documentElement.dataset.donateBar = visible ? "shown" : "hidden";
  }, [visible]);

  return (
    // `inert` while hidden: out of the tab order and the accessibility tree in one go.
    <div
      inert={!visible}
      className={cn(
        // Fades rather than slides: an opacity change can never register as a layout shift.
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 pt-3 transition-[opacity,visibility] duration-300 ease-out md:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <a href={donateUrl} className={cn(buttonClasses("primary", "md"), "w-full")}>
        <HeartHandshake aria-hidden />
        {label}
      </a>
    </div>
  );
}
