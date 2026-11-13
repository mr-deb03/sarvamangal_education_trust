import {
  Backpack,
  BookOpen,
  CalendarDays,
  CircleCheck,
  Droplet,
  GraduationCap,
  HeartHandshake,
  NotebookPen,
  Sprout,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

import type { LiveIcon } from "@/lib/cms/types";

export type TickerIcon = LiveIcon | "calendar" | "check" | "register";

export type TickerItem = {
  key: string;
  icon: TickerIcon;
  /** The figure, e.g. "1,500+". */
  figure?: string;
  text: string;
};

const ICONS: Record<TickerIcon, LucideIcon> = {
  pouch: Backpack,
  notebook: BookOpen,
  blood: Droplet,
  health: Stethoscope,
  people: Users,
  tree: Sprout,
  school: GraduationCap,
  heart: HeartHandshake,
  calendar: CalendarDays,
  check: CircleCheck,
  register: NotebookPen,
};

/** Enough entries to run wider than a 1920px screen, so the loop never shows a gap. */
const MIN_ENTRIES = 8;

/**
 * The scrolling "Live" band. Screen readers get one plain list; the moving
 * track is decorative (aria-hidden) and doubled for a seamless loop. It pauses
 * on hover and stands still under reduced motion, where it becomes a
 * sideways-scrollable row. No pause button — owner's call.
 */
export function LiveTicker({ items, updated }: { items: TickerItem[]; updated?: string }) {
  if (items.length === 0) return null;

  const loop = Array.from({ length: Math.max(MIN_ENTRIES, items.length) }, (_, i) => ({
    item: items[i % items.length]!,
    repeat: i >= items.length,
  }));
  const duration = { "--ticker-duration": `${loop.length * 5}s` } as CSSProperties;

  return (
    <section aria-label="Live updates" className="on-ink relative border-b border-white/10">
      <div className="flex h-12 items-stretch">
        <p className="flex shrink-0 items-center gap-2 bg-crimson px-3 text-white sm:px-4">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-white opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-white" />
          </span>
          <span className="eyebrow text-[0.72rem] tracking-[0.16em]">Live</span>
          {updated ? <span className="hidden text-[0.8rem] text-white/80 sm:inline">· updated {updated}</span> : null}
        </p>

        <ul className="sr-only">
          {items.map((item) => (
            <li key={item.key}>{[item.figure, item.text].filter(Boolean).join(" ")}</li>
          ))}
        </ul>

        <div
          aria-hidden
          className="ticker relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)]"
        >
          <div className="ticker-track flex h-full w-max" style={duration}>
            {[0, 1].map((copy) => (
              <ul key={copy} data-copy={copy} className="flex shrink-0 items-center">
                {loop.map(({ item, repeat }, i) => {
                  const Icon = ICONS[item.icon];
                  return (
                    <li
                      key={`${item.key}-${i}`}
                      data-repeat={repeat || undefined}
                      className="flex items-center gap-2 pr-7 pl-7 whitespace-nowrap text-[0.97rem] text-ink-200 after:ml-7 after:size-1 after:rounded-full after:bg-white/25 after:content-['']"
                    >
                      <Icon className="size-4 shrink-0 text-marigold" />
                      {item.figure ? (
                        <span className="font-display text-[1.15rem] leading-none font-semibold text-marigold lining-nums">
                          {item.figure}
                        </span>
                      ) : null}
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
