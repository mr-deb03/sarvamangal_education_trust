"use client";

import { useEffect, useRef } from "react";

/**
 * Marks its parent element with `data-near` once it comes within a screen or so
 * of the viewport. CSS keyed on that attribute can then start work only when
 * it's about to be seen — e.g. the Give section's Hindi web font (`.hindi-type`),
 * which would otherwise download with the page.
 */
export function WhenNear({ margin = "800px" }: { margin?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    if (!("IntersectionObserver" in window)) {
      parent.dataset.near = "";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        parent.dataset.near = "";
        io.disconnect();
      },
      { rootMargin: `${margin} 0px` },
    );
    io.observe(parent);
    return () => io.disconnect();
  }, [margin]);

  return <span ref={ref} hidden />;
}
