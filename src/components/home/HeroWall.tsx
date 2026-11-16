"use client";

import Image from "next/image";
import { useSyncExternalStore, type CSSProperties } from "react";

import { WallTile, type WallPhoto } from "@/components/sections/PhotoWall";
import type { ImageRef } from "@/lib/cms/types";
import { cn, focalStyle } from "@/lib/utils";

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

type Tile = { kind: "camp"; photo: WallPhoto } | { kind: "feature"; image: ImageRef };

/** Deal the camps across the rows like cards, so each row shows different ones. */
function dealRows(photos: WallPhoto[], feature: ImageRef): Tile[][] {
  const rows: Tile[][] = ROWS.map(() => []);
  photos.forEach((photo, i) => rows[i % rows.length]?.push({ kind: "camp", photo }));
  // Every row gets the same number of camps (repeating a short row's own), so
  // all rows are about as long and glide at the same calm pace.
  const length = Math.max(9, ...rows.map((row) => row.length));
  for (const row of rows) {
    const base = [...row];
    for (let i = 0; base.length > 0 && row.length < length; i++) row.push(base[i % base.length]!);
  }
  const second = rows[1];
  second?.splice(Math.min(FEATURE_AT, second.length), 0, { kind: "feature", image: feature });
  return rows;
}

/**
 * The hero's photo wall as rows of camp photos gliding sideways — alternate
 * rows left and right, each at its own slow pace — behind the headline card.
 *
 * The server sends the wall's frame — one copy of each row, as ink tiles — and
 * the photos arrive once the page is interactive, waving in (they already
 * animated in from transparent). Decorative only (aria-hidden, alt=""), so
 * nothing is lost for search engines, and their downloads stay off the
 * critical path: on a phone the headline, fonts and Donate button come first.
 * A second copy of each row is added at the same moment so the loop is
 * seamless, and only then does a row start to move. A row pauses under the
 * mouse; nothing moves for visitors who turn off motion.
 */
export function HeroWall({ photos, feature }: { photos: WallPhoto[]; feature: ImageRef }) {
  const ready = useSyncExternalStore(noSubscription, inBrowser, onServer);
  const rows = dealRows(photos, feature);

  return (
    <div
      aria-hidden
      className="flex h-[18rem] flex-col gap-[3px] overflow-hidden sm:h-[27rem] lg:absolute lg:inset-0 lg:h-auto"
    >
      {rows.map((row, r) => {
        const config = ROWS[r]!;
        return (
          <div
            key={r}
            className={cn("hero-row min-h-0 flex-1 overflow-hidden", r === 3 && "hidden sm:block")}
            data-direction={config.direction}
            data-ready={ready || undefined}
            style={{ "--row-duration": `${config.seconds}s` } as CSSProperties}
          >
            <div className="hero-track flex h-full w-max">
              {(ready ? [0, 1] : [0]).map((copy) => (
                <div key={copy} className="flex h-full shrink-0 gap-[3px] pr-[3px]">
                  {row.map((tile, t) =>
                    tile.kind === "feature" ? (
                      <FeatureTile key={`f-${copy}`} image={tile.image} first={copy === 0} withImage={ready} />
                    ) : (
                      <WallTile
                        key={`${copy}-${t}`}
                        photo={tile.photo}
                        sizes={TILE_SIZES}
                        wave={copy === 0 ? r * 9 + t : undefined}
                        withImage={ready}
                        className="aspect-[4/3] h-full shrink-0"
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** The trust's chosen hero photo (Site settings), twice as wide as a camp tile. */
function FeatureTile({ image, first, withImage }: { image: ImageRef; first: boolean; withImage: boolean }) {
  return (
    <div className={cn("relative aspect-[8/3] h-full shrink-0 overflow-hidden bg-ink-soft", first && "wall-tile")}>
      {withImage ? (
        <Image
          src={image.src}
          alt=""
          fill
          loading={first ? "eager" : "lazy"}
          quality={75}
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 380px, 260px"
          className="object-cover"
          style={focalStyle(image)}
        />
      ) : null}
    </div>
  );
}
