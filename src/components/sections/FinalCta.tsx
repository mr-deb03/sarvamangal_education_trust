import { HeartHandshake, Plus } from "lucide-react";

import { WallTile, wallPhotos } from "@/components/sections/PhotoWall";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import type { CampEvent, EventTimeline, SiteCopy, SiteSettings } from "@/lib/cms/types";
import { formatDate } from "@/lib/format";
import { isExternal, linkOrWhatsapp } from "@/lib/utils";

/** Photos in the strip: 3 on phones, 5 on tablets, 8 on desktop — then the empty "next" tile. */
const STRIP = 8;
const stripVisibility = (i: number) => (i >= 5 ? "hidden lg:block" : i >= 3 ? "hidden sm:block" : undefined);

type Text = SiteCopy["home"]["finalCta"];

/**
 * Closing ask. The photo wall returns as one row of the latest camps, ending
 * in an empty tile: the next camp, which the visitor's gift makes possible.
 */
export function FinalCta({ settings, timeline, copy }: { settings: SiteSettings; timeline: EventTimeline; copy: SiteCopy }) {
  const text = copy.home.finalCta;
  const recent = wallPhotos(timeline.past).slice(0, STRIP);
  const volunteerHref = linkOrWhatsapp(
    text.volunteerLink,
    settings.whatsappNumber,
    copy.home.involved.volunteer.whatsappMessage,
  );

  return (
    <section
      aria-labelledby="final-title"
      data-donate-zone
      className="defer-render relative overflow-hidden bg-linear-to-b from-crimson to-crimson-deep text-white [--focus-ring:white]"
    >
      {recent.length > 0 ? (
        // Row-reversed: the "next" tile sits at the far right, the newest camp beside it.
        <Reveal className="flex flex-row-reverse gap-[3px] border-b-[3px] border-crimson-deep bg-crimson-deep">
          <NextTile next={timeline.upcoming[0]} text={text} />
          {recent.map((photo, i) => (
            <div key={photo.slug} aria-hidden className={`aspect-square flex-1 ${stripVisibility(i) ?? ""}`}>
              <WallTile
                photo={photo}
                sizes="(min-width: 1024px) 11vw, (min-width: 640px) 17vw, 25vw"
                className="size-full"
              />
            </div>
          ))}
        </Reveal>
      ) : null}

      <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:py-24">
        <p className="eyebrow text-marigold-soft">{text.eyebrow}</p>
        <h2 id="final-title" className="mt-3 text-4xl font-semibold text-white sm:text-6xl">
          {text.title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">{text.text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href={settings.donateUrl} variant="white" size="lg">
            <HeartHandshake aria-hidden />
            {text.donate}
          </ButtonLink>
          <ButtonLink
            href={volunteerHref}
            variant="outline-light"
            size="lg"
            {...(isExternal(volunteerHref) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {text.volunteer}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** The empty slot at the end of the wall: the next camp, announced or not. */
function NextTile({ next, text }: { next?: CampEvent; text: Text }) {
  return (
    <div className="flex aspect-square flex-1 flex-col items-center justify-center gap-1 bg-crimson p-2 text-center outline-2 -outline-offset-[10px] outline-white/40 outline-dashed sm:gap-1.5">
      <Plus aria-hidden className="size-6 text-marigold sm:size-8" />
      <span className="eyebrow text-[0.62rem] text-white sm:text-[0.72rem]">{next ? text.nextComingUp : text.nextCamp}</span>
      <span className="hidden max-w-[11rem] text-[0.85rem] leading-snug text-white/90 sm:block">
        {next ? `${next.title}, ${formatDate(next.startDate, { day: "numeric", month: "short" })}` : text.dateBeingFixed}
      </span>
    </div>
  );
}
