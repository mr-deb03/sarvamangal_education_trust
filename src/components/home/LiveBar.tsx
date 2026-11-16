import type { EventTimeline, LiveUpdates, SiteCopy } from "@/lib/cms/types";
import { fill, formatDate } from "@/lib/format";

import { LiveTicker, type TickerItem } from "./LiveTicker";

/**
 * Builds the live ticker: the trust's running totals from /admin first, then
 * two items that keep themselves current from the register — the latest camp
 * and how many camps are on the register. (No next-camp item — owner's call;
 * upcoming camps have their own section.)
 */
export function LiveBar({ live, timeline, copy }: { live: LiveUpdates; timeline: EventTimeline; copy: SiteCopy }) {
  const text = copy.labels.ticker;
  const latest = timeline.past[0];
  const done = timeline.past.length;

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
            text: fill(text.latestCamp, {
              title: latest.title,
              date: formatDate(latest.startDate, { day: "numeric", month: "short", year: "numeric" }),
            }),
          },
        ]
      : []),
    ...(done > 0
      ? [
          {
            key: "register",
            icon: "register" as const,
            figure: done.toLocaleString("en-IN"),
            text: timeline.firstYear ? fill(text.campsSince, { year: timeline.firstYear }) : text.campsTotal,
          },
        ]
      : []),
  ];

  return (
    <LiveTicker
      items={items}
      text={{
        live: text.live,
        label: copy.labels.accessibility.liveUpdates,
        updated: live.updatedAt
          ? fill(text.updated, { date: formatDate(live.updatedAt, { day: "numeric", month: "short" }) })
          : undefined,
      }}
    />
  );
}
