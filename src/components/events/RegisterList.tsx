import type { ReactNode } from "react";

import type { CampEvent } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

import { RegisterEntry } from "./RegisterEntry";

/** The register's ruled panel: a list of camps, date in the margin. Used on every page that lists camps. */
export function RegisterList({
  events,
  className,
  header,
  before,
  hideFromIndex,
}: {
  events: CampEvent[];
  className?: string;
  /** Column headings above the list. */
  header?: ReactNode;
  /** Rows above the camps (the homepage's "Next" row). */
  before?: ReactNode;
  /** Phones show only this many; the rest appear from tablet width. */
  hideFromIndex?: number;
}) {
  return (
    <div
      className={cn(
        "register overflow-hidden rounded-[1.25rem] bg-white shadow-[0_30px_60px_-45px_rgb(23_25_59/0.4)] ring-1 ring-line",
        className,
      )}
    >
      {header}
      <ol>
        {before}
        {events.map((e, i) => (
          <RegisterEntry
            key={e.id}
            event={e}
            className={hideFromIndex !== undefined && i >= hideFromIndex ? "max-sm:hidden" : undefined}
          />
        ))}
      </ol>
    </div>
  );
}
