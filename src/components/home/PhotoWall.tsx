import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import type { CampEvent, ImageRef } from "@/lib/cms/types";
import { formatDate } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { cn, focalStyle } from "@/lib/utils";

/**
 * The photo wall — the homepage's signature. Every tile is the cover photo of
 * a real camp from the CMS, so the wall grows as editors add camps. It opens
 * the page (Hero) and closes it (FinalCta, ending in the empty "next camp" tile).
 */

export type WallPhoto = { event: CampEvent; image: ImageRef };

/** Camps that have a cover photo, in the order given. */
export function wallPhotos(events: CampEvent[]): WallPhoto[] {
  return events.flatMap((event) => (event.coverImage ? [{ event, image: event.coverImage }] : []));
}

/** Exactly `count` photos; repeats only when the register has fewer camps than tiles. */
export function fillWall(photos: WallPhoto[], count: number): WallPhoto[] {
  if (photos.length === 0) return [];
  return Array.from({ length: count }, (_, i) => photos[i % photos.length]!);
}

/**
 * One camp photo. Decorative to assistive tech and out of the tab order (the
 * register lists the same camps as real links); a mouse click opens the camp.
 * On hover it shows which camp it is.
 */
export function WallTile({
  photo,
  index,
  sizes,
  className,
  animated = true,
}: {
  photo: WallPhoto;
  /** Position in the wave-in animation. */
  index: number;
  sizes: string;
  className?: string;
  /** Wave in on page load. Off for tiles far down the page, which never see it. */
  animated?: boolean;
}) {
  const { event, image } = photo;
  return (
    <Link
      href={ROUTES.event(event.slug)}
      tabIndex={-1}
      className={cn(animated && "wall-tile", "group/tile relative block overflow-hidden bg-ink-soft", className)}
      style={{ "--i": index } as CSSProperties}
    >
      <Image
        src={image.src}
        alt=""
        fill
        sizes={sizes}
        quality={70}
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover/tile:scale-[1.06]"
        style={focalStyle(image)}
      />
      <span className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-ink/95 via-ink/35 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100">
        <span className="text-[0.68rem] font-semibold tracking-[0.12em] text-marigold uppercase">
          {formatDate(event.startDate, { month: "short", year: "numeric" })}
        </span>
        <span className="mt-0.5 line-clamp-2 font-display text-[0.95rem] leading-snug text-white">
          {event.title}
        </span>
      </span>
    </Link>
  );
}
