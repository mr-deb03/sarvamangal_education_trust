"use client";

import { useSyncExternalStore } from "react";

import { indiaDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const DAY = 86_400_000;
const noSubscription = () => () => {};
const todayOnClient = () => indiaDate(new Date());
const nothingOnServer = () => null;

/**
 * "In 10 days" / "Tomorrow" / "Today" for an upcoming camp, worked out in the
 * visitor's browser against today's date in India. The server renders nothing
 * here (the page is static and cached), so there is no hydration mismatch and
 * the label is never stale.
 */
export function Countdown({ start, end, className }: { start: string; end?: string; className?: string }) {
  const today = useSyncExternalStore(noSubscription, todayOnClient, nothingOnServer);
  if (!today) return null;

  const days = Math.round((Date.parse(start) - Date.parse(today)) / DAY);
  const onNow = days < 0 && (end ?? start) >= today;
  const label = days > 1 ? `In ${days} days` : days === 1 ? "Tomorrow" : days === 0 ? "Today" : onNow ? "On now" : null;
  if (!label) return null;
  const live = days === 0 || onNow;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-marigold px-3 py-1 text-sm leading-none font-semibold text-ink",
        className,
      )}
    >
      {live ? (
        <span aria-hidden className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-crimson opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-crimson" />
        </span>
      ) : null}
      {label}
    </span>
  );
}
