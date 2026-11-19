"use client";

import { useRef, type ReactNode } from "react";

/**
 * Lets Escape close a menu that opens on hover or focus (WCAG 1.4.13). Marks
 * its `group` parent `data-dismissed` until the pointer or focus leaves.
 */
export function EscapeCloses({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const group = () => ref.current?.parentElement;

  return (
    <div
      ref={ref}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        group()?.setAttribute("data-dismissed", "");
      }}
      onMouseLeave={() => group()?.removeAttribute("data-dismissed")}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) group()?.removeAttribute("data-dismissed");
      }}
    >
      {children}
    </div>
  );
}
