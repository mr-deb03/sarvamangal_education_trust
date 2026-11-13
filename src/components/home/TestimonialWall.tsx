"use client";

import { useSyncExternalStore, type CSSProperties } from "react";

import type { Testimonial } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

import { TestimonialCard } from "./TestimonialCard";

/**
 * Columns of the wall: direction and seconds per loop, a little out of step so
 * the wall never moves as one block. Tablets show two columns, desktop three.
 */
const COLUMNS = [
  { direction: "up", seconds: 44, className: undefined },
  { direction: "down", seconds: 52, className: undefined },
  { direction: "up", seconds: 48, className: "hidden lg:block" },
] as const;

/** Tablet width and up, with motion allowed — the only place the wall runs. */
const QUERY = "(min-width: 640px) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}
const wallWanted = () => window.matchMedia(QUERY).matches;
const notOnServer = () => false;

/** Each column starts at a different testimonial and holds at least three cards. */
function columnCards(items: { t: Testimonial; tone?: string }[], column: number) {
  const start = column % items.length;
  const rotated = [...items.slice(start), ...items.slice(0, start)];
  const cards = [...rotated];
  while (cards.length < 3) cards.push(...rotated);
  return cards;
}

/**
 * The moving testimonial wall, built in the browser and only where it shows
 * (tablet and up, motion allowed). The server sends the testimonials once —
 * in the still list beside it — so the page carries no repeated copies, and
 * phones never build the wall at all. The frame is server-rendered at its
 * full height, so nothing shifts when the cards arrive.
 */
export function TestimonialWall({ items }: { items: { t: Testimonial; tone?: string }[] }) {
  const show = useSyncExternalStore(subscribe, wallWanted, notOnServer);

  return (
    <div
      aria-hidden
      className="voices-wall mt-12 hidden h-[40rem] gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_9%,black_91%,transparent)] motion-reduce:hidden sm:grid sm:grid-cols-2 lg:mt-14 lg:h-[44rem] lg:grid-cols-3 lg:gap-5"
    >
      {show
        ? COLUMNS.map((column, c) => {
            const cards = columnCards(items, c);
            return (
              <div key={c} className={cn("voices-col", column.className)}>
                <div
                  className="voices-track flex flex-col"
                  data-direction={column.direction}
                  style={{ "--voices-duration": `${column.seconds}s` } as CSSProperties}
                >
                  {/* Two identical copies: the track slides by one copy, so the loop is seamless. */}
                  {[0, 1].map((copy) => (
                    <ul key={copy} className="flex flex-col gap-4 pb-4 lg:gap-5 lg:pb-5">
                      {cards.map(({ t, tone }, i) => (
                        <li key={`${copy}-${i}-${t.id}`}>
                          <TestimonialCard t={t} tone={tone} />
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
}
