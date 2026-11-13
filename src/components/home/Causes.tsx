import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionIntro } from "@/components/ui/SectionIntro";
import type { Cause } from "@/lib/cms/types";
import { ROUTES } from "@/lib/site";
import { cn, focalStyle } from "@/lib/utils";

/**
 * The four causes as edge-to-edge photographs, set in the same grid (and the
 * same thin ink seams) as the photo wall above — the wall, zoomed in.
 */
export function Causes({
  causes,
  countByCause,
  showIntro = true,
}: {
  causes: Cause[];
  countByCause: Record<string, number>;
  /** Off on /causes, where the page header already introduces them. */
  showIntro?: boolean;
}) {
  if (causes.length === 0) return null;

  return (
    <section
      id="causes"
      aria-labelledby={showIntro ? "causes-title" : undefined}
      aria-label={showIntro ? undefined : "Causes"}
      className={showIntro ? "defer-render on-ink scroll-mt-20 pt-14 sm:pt-20 lg:pt-28" : "on-ink"}
    >
      {showIntro ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro id="causes-title" eyebrow="Our causes" title="Four ways we show up" tone="dark">
            One trust, one team of volunteers, four kinds of care. Start with the one closest to your heart.
          </SectionIntro>
        </div>
      ) : null}

      {/* A 2 × 2 grid everywhere. On phones all four causes show at once (title and camp
          count); the tagline and summary appear from tablet width up. */}
      <ul className={cn("grid grid-cols-2 gap-[3px] pb-[3px]", showIntro && "mt-8 sm:mt-12 lg:mt-14")}>
        {causes.map((cause) => {
          const count = countByCause[cause.slug] ?? 0;
          return (
            <li key={cause.slug}>
              <Link
                href={ROUTES.cause(cause.slug)}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-ink-soft focus-visible:-outline-offset-[7px] sm:aspect-[4/3] lg:aspect-[16/10]"
              >
                <Image
                  src={cause.image.src}
                  alt={cause.image.alt}
                  fill
                  sizes="50vw"
                  placeholder={cause.image.blurDataURL ? "blur" : "empty"}
                  blurDataURL={cause.image.blurDataURL}
                  className="object-cover transition-transform duration-[900ms] ease-out motion-safe:group-hover:scale-[1.04]"
                  style={focalStyle(cause.image)}
                />
                <span aria-hidden className="absolute inset-0 bg-linear-to-t from-ink via-ink/45 to-ink/0" />

                <div className="relative p-3.5 sm:p-8 lg:p-11">
                  <p className="eyebrow hidden text-marigold sm:block">{cause.tagline}</p>
                  <h3 className="text-[1.45rem] leading-none font-semibold text-white sm:mt-2 sm:text-[2.4rem] lg:text-[3.2rem]">
                    {cause.title}
                  </h3>
                  <p className="mt-3 hidden max-w-md text-[1.02rem] leading-relaxed text-ink-200 sm:block">{cause.summary}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-white sm:mt-5 sm:gap-2 sm:text-base">
                    {count > 0 ? (
                      <span>
                        {count} {count === 1 ? "camp" : "camps"}
                        <span className="hidden sm:inline"> on the register</span>
                      </span>
                    ) : (
                      `See ${cause.title}`
                    )}
                    <ArrowRight
                      aria-hidden
                      className="size-4 text-marigold transition-transform duration-200 motion-safe:group-hover:translate-x-1 sm:size-5"
                    />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
