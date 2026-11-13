import type { EventTimeline, LiveUpdates } from "@/lib/cms/types";
import { formatDate } from "@/lib/format";

import { LiveTicker, type TickerItem } from "./LiveTicker";

/**
 * Builds the live ticker: the trust's running totals from /admin first, then
 * two items that keep themselves current from the register — the latest camp
 * and how many camps are on the register. (No next-camp item — owner's call;
 * upcoming camps have their own section.)
 */
export function LiveBar({ live, timeline }: { live: LiveUpdates; timeline: EventTimeline }) {
  const latest = timeline.past[0];
  const firstYear = timeline.past.at(-1)?.startDate.slice(0, 4);

  const items: TickerItem[] = [
    ...live.counters.map((c, i) => ({
      key: `total-${i}`,
      icon: c.icon,
      figure: `${c.value.toLocaleString("en-IN")}${c.plus ? "+" : ""}`,
      text: c.label,
    })),
    ...(latest
      ? [
          {
            key: "latest",
            icon: "check" as const,
            text: `Latest camp: ${latest.title}, ${formatDate(latest.startDate, { day: "numeric", month: "short", year: "numeric" })}`,
          },
        ]
      : []),
    ...(timeline.total > 0
      ? [
          {
            key: "register",
            icon: "register" as const,
            figure: String(timeline.total),
            text: `camps on the register${firstYear ? ` since ${firstYear}` : ""}`,
          },
        ]
      : []),
  ];

  return (
    <LiveTicker
      items={items}
      updated={live.updatedAt ? formatDate(live.updatedAt, { day: "numeric", month: "short" }) : undefined}
    />
  );
}
