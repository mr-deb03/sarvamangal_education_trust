import { Check, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { CampEvent } from "@/lib/cms/types";
import { formatBeneficiaries, formatDate, formatPlace } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/** One camp in the register: date in the margin, title, place, cause, people served. */
export function RegisterEntry({ event, className }: { event: CampEvent; className?: string }) {
  return (
    <li
      className={cn(
        "group relative grid grid-cols-[var(--margin-w)_1fr] border-b border-line transition-colors last:border-b-0 hover:bg-paper-2/70",
        className,
      )}
    >
      <p className="py-5 pr-3 text-right leading-tight text-ink tabular-nums sm:pr-5">
        <time dateTime={event.startDate}>
          <span className="block font-semibold sm:text-[1.05rem]">{formatDate(event.startDate, { day: "numeric", month: "short" })}</span>
          <span className="block text-sm text-ink-muted">{event.startDate.slice(0, 4)}</span>
        </time>
      </p>

      <div className="flex items-center gap-4 py-5 pr-4 pl-4 sm:pr-5 sm:pl-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg leading-snug font-semibold sm:text-xl">
            <Link
              href={ROUTES.event(event.slug)}
              className="after:absolute after:inset-0 group-hover:text-crimson"
            >
              {event.title}
            </Link>
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden className="size-3.5" />
              {formatPlace(event)}
            </span>
            {event.cause ? (
              <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-semibold tracking-wide text-ink-soft ring-1 ring-line">
                {event.cause.title}
              </span>
            ) : null}
          </p>
          {event.beneficiaries ? (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson">
              <Check aria-hidden className="size-4" />
              {formatBeneficiaries(event.beneficiaries)}
            </p>
          ) : null}
        </div>

        {event.coverImage ? (
          <div className="relative hidden h-[4.5rem] w-24 shrink-0 overflow-hidden rounded-md bg-paper-2 shadow-[0_6px_14px_-6px_rgb(23_25_59/0.5)] ring-[3px] ring-white sm:block md:h-20 md:w-28">
            <Image
              src={event.coverImage.src}
              alt=""
              fill
              sizes="112px"
              quality={70}
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}
