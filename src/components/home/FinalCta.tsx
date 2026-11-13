import { HeartHandshake, Plus } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { CampEvent, EventTimeline } from "@/lib/cms/types";
import { formatDate } from "@/lib/format";
import { ROUTES } from "@/lib/site";

import { WallTile, wallPhotos } from "./PhotoWall";

/** Photos in the strip: 3 on phones, 5 on tablets, 8 on desktop — then the empty "next" tile. */
const STRIP = 8;
const stripVisibility = (i: number) => (i >= 5 ? "hidden lg:block" : i >= 3 ? "hidden sm:block" : undefined);

/**
 * Closing ask. The photo wall returns as one row of the latest camps, ending
 * in an empty tile: the next camp, which the visitor's gift makes possible.
 */
export function FinalCta({ donateUrl, timeline }: { donateUrl: string; timeline: EventTimeline }) {
  const recent = wallPhotos(timeline.past).slice(0, STRIP);

  return (
    <section
      aria-labelledby="final-title"
      className="relative overflow-hidden bg-linear-to-b from-crimson to-crimson-deep text-white [--focus-ring:white]"
    >
      {recent.length > 0 ? (
        // Row-reversed: the "next" tile sits at the far right, the newest camp beside it.
        <Reveal className="flex flex-row-reverse gap-[3px] border-b-[3px] border-crimson-deep bg-crimson-deep">
          <NextTile next={timeline.upcoming[0]} />
          {recent.map((photo, i) => (
            <div key={photo.event.slug} aria-hidden className={`aspect-square flex-1 ${stripVisibility(i) ?? ""}`}>
              <WallTile photo={photo} index={i} animated={false} sizes="(min-width: 1024px) 11vw, (min-width: 640px) 17vw, 25vw" className="size-full" />
            </div>
          ))}
        </Reveal>
      ) : null}

      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-24">
        <p className="eyebrow text-marigold-soft">The next page of the register</p>
        <h2 id="final-title" className="mt-3 text-4xl font-semibold text-white sm:text-6xl">
          The next camp is already being planned.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
          A child’s new notebook. An elder’s long-overdue check-up. It starts with someone deciding to help.
          Help us keep it free.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href={donateUrl} variant="white" size="lg">
            <HeartHandshake aria-hidden />
            Donate now
          </ButtonLink>
          <ButtonLink href={ROUTES.volunteer} variant="outline-light" size="lg">
            Volunteer with us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** The empty slot at the end of the wall: the next camp, announced or not. */
function NextTile({ next }: { next?: CampEvent }) {
  return (
    <div className="flex aspect-square flex-1 flex-col items-center justify-center gap-1 bg-crimson p-2 text-center outline-2 -outline-offset-[10px] outline-white/40 outline-dashed sm:gap-1.5">
      <Plus aria-hidden className="size-6 text-marigold sm:size-8" />
      <span className="eyebrow text-[0.62rem] text-white sm:text-[0.72rem]">{next ? "Coming up" : "Next camp"}</span>
      <span className="hidden max-w-[11rem] text-[0.85rem] leading-snug text-white/80 sm:block">
        {next ? `${next.title}, ${formatDate(next.startDate, { day: "numeric", month: "short" })}` : "Date being fixed"}
      </span>
    </div>
  );
}
