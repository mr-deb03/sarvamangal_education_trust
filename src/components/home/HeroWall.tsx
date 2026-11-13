"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, type CSSProperties } from "react";

import type { ImageRef } from "@/lib/cms/types";
import { formatDate } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { cn, focalStyle } from "@/lib/utils";

/** One camp photo for the wall (plain data, so it can cross to the browser). */
export type WallItem = { slug: string; title: string; startDate: string; image: ImageRef };

/**
 * The rows: which way each glides and how long one loop takes. Out of step, so
 * the wall never moves as one block. Phones show the first three rows.
 */
const ROWS = [
  { direction: "left", seconds: 70 },
  { direction: "right", seconds: 86 },
  { direction: "left", seconds: 78 },
  { direction: "right", seconds: 92 },
] as const;

/** Where the large photo sits in the second row: clear of the headline card on desktop. */
const FEATURE_AT = 3;
const TILE_SIZES = "(min-width: 1024px) 280px, (min-width: 640px) 190px, 130px";

const noSubscription = () => () => {};
const inBrowser = () => true;
const onServer = () => false;

type Tile = { kind: "camp"; item: WallItem } | { kind: "feature"; image: ImageRef };

/** Deal the camps across the rows like cards, so each row shows different ones. */
function dealRows(items: WallItem[], feature: ImageRef): Tile[][] {
  const rows: Tile[][] = ROWS.map(() => []);
  items.forEach((item, i) => rows[i % rows.length]!.push({ kind: "camp", item }));
  // Every row gets the same number of camps (repeating a short row's own), so
  // all rows are about as long and glide at the same calm pace.
  const length = Math.max(9, ...rows.map((row) => row.length));
  for (const row of rows) {
    const base = [...row];
    for (let i = 0; base.length > 0 && row.length < length; i++) row.push(base[i % base.length]!);
  }
  rows[1]!.splice(Math.min(FEATURE_AT, rows[1]!.length), 0, { kind: "feature", image: feature });
  return rows;
}

/**
 * The hero's photo wall as rows of camp photos gliding sideways — alternate
 * rows left and right, each at its own slow pace — behind the headline card.
 *
 * The server sends one copy of each row (a complete, still wall for search
 * engines and slow connections); in the browser a second copy is added so the
 * loop is seamless, and only then does a row start to move. A row pauses under
 * the mouse; nothing moves for visitors who turn off motion.
 */
export function HeroWall({ items, feature }: { items: WallItem[]; feature: ImageRef }) {
  const ready = useSyncExternalStore(noSubscription, inBrowser, onServer);
  const rows = dealRows(items, feature);

  return (
    <div
      aria-hidden
      className="flex h-[18rem] flex-col gap-[3px] overflow-hidden sm:h-[27rem] lg:absolute lg:inset-0 lg:h-auto"
    >
      {rows.map((row, r) => (
        <div
          key={r}
          className={cn("hero-row min-h-0 flex-1 overflow-hidden", r === 3 && "hidden sm:block")}
          data-direction={ROWS[r]!.direction}
          data-ready={ready || undefined}
          style={{ "--row-duration": `${ROWS[r]!.seconds}s` } as CSSProperties}
        >
          <div className="hero-track flex h-full w-max">
            {(ready ? [0, 1] : [0]).map((copy) => (
              <div key={copy} className="flex h-full shrink-0 gap-[3px] pr-[3px]">
                {row.map((tile, t) =>
                  tile.kind === "feature" ? (
                    <FeatureTile key={`f-${copy}`} image={tile.image} first={copy === 0} />
                  ) : (
                    <CampTile key={`${copy}-${t}`} item={tile.item} wave={copy === 0 ? r * 9 + t : undefined} />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The trust's chosen hero photo, twice as wide as a camp tile. Preloaded: it's the first thing seen. */
function FeatureTile({ image, first }: { image: ImageRef; first: boolean }) {
  return (
    <div className={cn("relative aspect-[8/3] h-full shrink-0 overflow-hidden bg-ink-soft", first && "wall-tile")}>
      <Image
        src={image.src}
        alt=""
        fill
        preload={first}
        quality={75}
        sizes="(min-width: 1024px) 560px, (min-width: 640px) 380px, 260px"
        placeholder={image.blurDataURL ? "blur" : "empty"}
        blurDataURL={image.blurDataURL}
        className="object-cover"
        style={focalStyle(image)}
      />
    </div>
  );
}

/** One camp's photo; hovering shows which camp, clicking opens its page. */
function CampTile({ item, wave }: { item: WallItem; wave?: number }) {
  return (
    <Link
      href={ROUTES.event(item.slug)}
      tabIndex={-1}
      className={cn("group/tile relative block aspect-[4/3] h-full shrink-0 overflow-hidden bg-ink-soft", wave !== undefined && "wall-tile")}
      style={wave !== undefined ? ({ "--i": wave } as CSSProperties) : undefined}
    >
      <Image
        src={item.image.src}
        alt=""
        fill
        sizes={TILE_SIZES}
        quality={70}
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover/tile:scale-[1.06]"
        style={focalStyle(item.image)}
      />
      <span className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-ink/95 via-ink/35 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100">
        <span className="text-[0.68rem] font-semibold tracking-[0.12em] text-marigold uppercase">
          {formatDate(item.startDate, { month: "short", year: "numeric" })}
        </span>
        <span className="mt-0.5 line-clamp-2 font-display text-[0.95rem] leading-snug text-white">{item.title}</span>
      </span>
    </Link>
  );
}
