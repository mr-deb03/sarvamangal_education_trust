"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & {
  as?: "div" | "ul" | "li";
  /** Stagger siblings, e.g. index × 90. */
  delayMs?: number;
};

/**
 * Fades its content up the first time it scrolls into view.
 *
 * Visible by default: the server HTML has no hidden state, so crawlers and
 * no-JS readers see everything. Each instance hides itself only after React
 * has hydrated it, and only if it starts below the fold — so a hot reload,
 * client navigation or re-mount can never leave a section blank.
 */
export function Reveal({ as = "div", delayMs, style, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen

    el.dataset.revealState = "hidden";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.revealState = "shown";
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (el.dataset.revealState === "hidden") el.dataset.revealState = "shown";
    };
  }, []);

  const Tag = as as ElementType;
  const merged = delayMs ? ({ ...style, "--reveal-delay": `${delayMs}ms` } as CSSProperties) : style;
  return <Tag ref={ref} data-reveal="" style={merged} {...rest} />;
}
