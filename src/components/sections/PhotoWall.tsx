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
 * the page (HeroWall) and closes it (FinalCta, ending in the empty "next camp" tile).
 */

/** Just what a tile shows (plain data, so it can cross to the browser). */
export type WallPhoto = { slug: string; title: string; startDate: string; image: ImageRef };

/** Camps that have a cover photo, in the order given. */
export function wallPhotos(events: CampEvent[]): WallPhoto[] {
  return events.flatMap((e) =>
    e.coverImage ? [{ slug: e.slug, title: e.title, startDate: e.startDate, image: e.coverImage }] : [],
  );
}

/**
 * One camp photo. Decorative to assistive tech and out of the tab order (the
 * register lists the same camps as real links); a mouse click opens the camp,
 * and hovering shows which camp it is. Low fetch priority and no prefetch: the
 * wall must never compete with the page's text, fonts or real links.
 */
export function WallTile({
  photo,
  sizes,
  wave,
  className,
  style,
  withImage = true,
}: {
  photo: WallPhoto;
  sizes: string;
  /** False: just the tile (its ink background) — the photo is added later (see HeroWall). */
  withImage?: boolean;
  /** Position in the wave-in animation; omit for tiles that never see it. */
  wave?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Link
      href={ROUTES.event(photo.slug)}
      prefetch={false}
      tabIndex={-1}
      className={cn(wave !== undefined && "wall-tile", "group/tile relative block overflow-hidden bg-ink-soft", className)}
      style={wave !== undefined ? ({ ...style, "--i": wave } as CSSProperties) : style}
    >
      {withImage ? (
        <Image
          src={photo.image.src}
          alt=""
          fill
          sizes={sizes}
          quality={70}
          fetchPriority="low"
          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover/tile:scale-[1.06]"
          style={focalStyle(photo.image)}
        />
      ) : null}
      <span className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-ink/95 via-ink/35 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100">
        <span className="text-[0.68rem] font-semibold tracking-[0.12em] text-marigold uppercase">
          {formatDate(photo.startDate, { month: "short", year: "numeric" })}
        </span>
        <span className="mt-0.5 line-clamp-2 font-display text-[0.95rem] leading-snug text-white">{photo.title}</span>
      </span>
    </Link>
  );
}
