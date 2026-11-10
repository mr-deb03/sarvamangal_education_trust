"use client";

import { HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";

import { buttonClasses } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";

/**
 * Phone-only Donate bar. Slides up once the hero is out of view and tucks
 * away again near the bottom, where the closing section has its own button.
 */
export function MobileDonateBar({ donateUrl }: { donateUrl: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const pastHero = window.scrollY > window.innerHeight * 0.8;
        const nearEnd = window.scrollY + window.innerHeight > doc.scrollHeight - 900;
        setVisible(pastHero && !nearEnd);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-md transition-transform duration-300 ease-out md:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <a href={donateUrl} tabIndex={visible ? 0 : -1} className={cn(buttonClasses("primary", "md"), "w-full")}>
        <HeartHandshake aria-hidden />
        Donate now · 80G tax benefit
      </a>
    </div>
  );
}
