import { ArrowDown, BadgeCheck, Landmark, ReceiptText } from "lucide-react";

import { Underlined } from "@/components/ui/Underlined";
import type { DonationTier, EventTimeline, SiteSettings } from "@/lib/cms/types";
import { eventDayLabel } from "@/lib/event-links";
import { cn } from "@/lib/utils";

import { HeroGive } from "./HeroGive";
import { HeroWall, type WallItem } from "./HeroWall";
import { wallPhotos } from "./PhotoWall";

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
  const items: WallItem[] = photos.map(({ event, image }) => ({
    slug: event.slug,
    title: event.title,
    startDate: event.startDate,
    image,
  }));
  const firstYear = timeline.past.at(-1)?.startDate.slice(0, 4);
  const next = timeline.upcoming[0];

  return (
    <section aria-labelledby="hero-title" data-donate-zone className="relative bg-ink">
      <div className="relative lg:min-h-[min(calc(100svh-7.75rem),50rem)]">
        {items.length > 0 ? <HeroWall items={items} feature={hero.image} /> : null}

        {/* Desktop: the wall darkens behind the card so the photos read as depth, not noise. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[64%] bg-linear-to-r from-ink/92 via-ink/60 to-transparent lg:block"
        />

        {/* The wrapper lets the pointer through to the wall; only the card takes it. */}
        <div className="pointer-events-none relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:flex lg:min-h-[inherit] lg:items-center lg:px-8 lg:py-14">
          <div
            className={cn(
              // Phones reorder the card (headline → amounts and Donate → trust row → intro) so
              // Donate is on the first screen; wider screens keep the reading order.
              "card-lift pointer-events-auto relative flex flex-col rounded-[1.75rem] bg-white p-6 shadow-[0_50px_90px_-40px_rgb(0_0_0/0.75)] sm:p-9 lg:w-[35rem] lg:p-10",
              items.length > 0 ? "-mt-14 sm:-mt-28 lg:mt-0" : "mt-8",
            )}
          >
            <p className="eyebrow hidden text-crimson sm:block">{hero.eyebrow}</p>
            <h1
              id="hero-title"
              className="text-[2rem] leading-[1.06] font-semibold tracking-[-0.022em] sm:mt-3 sm:text-5xl lg:text-[2.75rem]"
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
            <p className="mt-4 text-base leading-relaxed text-ink-soft max-sm:order-4 max-sm:mt-5 max-sm:border-t max-sm:border-line max-sm:pt-4 sm:text-lg">
              {hero.intro}
            </p>

            <div className="mt-6 border-t border-line pt-5 max-sm:order-2 max-sm:mt-5 max-sm:border-t-0 max-sm:pt-0">
              <HeroGive tiers={tiers} donateUrl={settings.donateUrl} />
            </div>

            <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm text-ink-muted max-sm:order-3">
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
