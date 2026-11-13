import { ArrowDown, BadgeCheck, Landmark, ReceiptText } from "lucide-react";
import Image from "next/image";

import { Underlined } from "@/components/ui/Underlined";
import type { DonationTier, EventTimeline, SiteSettings } from "@/lib/cms/types";
import { eventDayLabel } from "@/lib/event-links";
import { cn, focalStyle } from "@/lib/utils";

import { HeroGive } from "./HeroGive";
import { fillWall, WallTile, wallPhotos } from "./PhotoWall";

/** Tiles in the wall: 4×3 on phones, 6×4 on tablets, 9×4 on desktop, minus the 2×2 photo. */
const TILES = 32;
const tileVisibility = (i: number) => (i >= 20 ? "hidden lg:block" : i >= 8 ? "hidden sm:block" : undefined);

/**
 * Opening section: a wall of photos from every camp on the register, with the
 * headline and the giving box on a card in front of it.
 */
export function Hero({
  settings,
  timeline,
  tiers,
}: {
  settings: SiteSettings;
  timeline: EventTimeline;
  tiers: DonationTier[];
}) {
  const { hero } = settings;
  // Camps that have happened, newest first — the wall shows what was done, not what's planned.
  const photos = wallPhotos(timeline.past);
  const tiles = fillWall(photos, TILES);
  const firstYear = timeline.past.at(-1)?.startDate.slice(0, 4);
  const next = timeline.upcoming[0];

  return (
    <section aria-labelledby="hero-title" className="relative bg-ink">
      <div className="relative lg:min-h-[min(calc(100svh-7.75rem),50rem)]">
        {tiles.length > 0 ? (
          <div
            aria-hidden
            className="grid aspect-[4/3] grid-flow-dense grid-cols-4 grid-rows-3 gap-[3px] sm:aspect-[3/2] sm:grid-cols-6 sm:grid-rows-4 lg:absolute lg:inset-0 lg:aspect-auto lg:grid-cols-9"
          >
            <div className="wall-tile relative col-span-2 col-start-2 row-span-2 row-start-1 overflow-hidden bg-ink-soft sm:col-start-3 lg:col-start-6 lg:row-start-2">
              <Image
                src={hero.image.src}
                alt=""
                fill
                preload
                quality={75}
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 34vw, 50vw"
                placeholder={hero.image.blurDataURL ? "blur" : "empty"}
                blurDataURL={hero.image.blurDataURL}
                className="object-cover"
                style={focalStyle(hero.image)}
              />
            </div>
            {tiles.map((photo, i) => (
              <WallTile
                key={`${photo.event.slug}-${i}`}
                photo={photo}
                index={i}
                sizes="(min-width: 1024px) 11vw, (min-width: 640px) 17vw, 25vw"
                className={tileVisibility(i)}
              />
            ))}
          </div>
        ) : null}

        {/* Desktop: the wall darkens behind the card so the photos read as depth, not noise. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[64%] bg-linear-to-r from-ink/92 via-ink/60 to-transparent lg:block"
        />

        {/* The wrapper lets the pointer through to the wall; only the card takes it. */}
        <div className="pointer-events-none relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:flex lg:min-h-[inherit] lg:items-center lg:px-8 lg:py-14">
          <div
            className={cn(
              "card-lift pointer-events-auto relative rounded-[1.75rem] bg-white p-6 shadow-[0_50px_90px_-40px_rgb(0_0_0/0.75)] sm:p-9 lg:w-[35rem] lg:p-10",
              tiles.length > 0 ? "-mt-14 sm:-mt-28 lg:mt-0" : "mt-8",
            )}
          >
            <p className="eyebrow text-crimson">{hero.eyebrow}</p>
            <h1
              id="hero-title"
              className="mt-3 text-[2.15rem] leading-[1.06] font-semibold tracking-[-0.022em] sm:text-5xl lg:text-[2.75rem]"
            >
              {hero.headlineLines.map((line, i) => (
                <span key={line}>
                  {/* The space keeps the lines apart in the text search engines read. */}
                  {i > 0 ? " " : null}
                  <span className="block">
                    <Underlined text={line} words={hero.highlightWords} delayMs={600 + i * 280} />
                  </span>
                </span>
              ))}
            </h1>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft sm:text-lg">{hero.intro}</p>

            <div className="mt-6 border-t border-line pt-5">
              <HeroGive tiers={tiers} donateUrl={settings.donateUrl} />
            </div>

            <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
              <li className="flex items-center gap-1.5">
                <BadgeCheck aria-hidden className="size-4 text-crimson" />
                80G tax benefit
              </li>
              <li className="flex items-center gap-1.5">
                <ReceiptText aria-hidden className="size-4 text-crimson" />
                Receipt on email
              </li>
              <li className="flex items-center gap-1.5">
                <Landmark aria-hidden className="size-4 text-crimson" />
                Registered public trust
              </li>
            </ul>
          </div>
        </div>
      </div>

      {photos.length > 0 ? (
        <div className="on-ink relative border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 text-[0.95rem] text-ink-200 sm:px-6 lg:px-8">
            <p>
              Photos from our own camps — {timeline.total} on the register
              {firstYear ? ` since ${firstYear}` : ""}.
            </p>
            {next ? (
              <a
                href="#coming-up"
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-white transition-colors hover:text-marigold"
              >
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-marigold opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-marigold" />
                </span>
                Next camp: {eventDayLabel(next)}
                {next.locality || next.city ? ` · ${next.locality ?? next.city}` : ""}
                <ArrowDown aria-hidden className="size-4" />
              </a>
            ) : (
              <a
                href="#register"
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-white transition-colors hover:text-marigold"
              >
                See the register
                <ArrowDown aria-hidden className="size-4" />
              </a>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
