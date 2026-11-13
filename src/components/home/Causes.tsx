import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionIntro } from "@/components/ui/SectionIntro";
import type { Cause } from "@/lib/cms/types";
import { ROUTES } from "@/lib/site";
import { focalStyle } from "@/lib/utils";

/**
 * The four causes as edge-to-edge photographs, set in the same grid (and the
 * same thin ink seams) as the photo wall above — the wall, zoomed in.
 */
export function Causes({ causes, countByCause }: { causes: Cause[]; countByCause: Record<string, number> }) {
  if (causes.length === 0) return null;

  return (
    <section id="causes" aria-labelledby="causes-title" className="on-ink scroll-mt-20 pt-14 sm:pt-20 lg:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro id="causes-title" eyebrow="Our causes" title="Four ways we show up" tone="dark">
          One trust, one team of volunteers, four kinds of care. Start with the one closest to your heart.
        </SectionIntro>
      </div>

      {/* Phones: a swipeable row with the next photo peeking in. Wider: a 2 × 2 grid. */}
      <ul className="mt-10 flex snap-x snap-mandatory scroll-px-4 gap-[3px] overflow-x-auto overscroll-x-contain pb-[3px] [scrollbar-width:none] sm:mt-12 sm:grid sm:grid-cols-2 sm:overflow-visible lg:mt-14 [&::-webkit-scrollbar]:hidden">
        {causes.map((cause) => {
          const count = countByCause[cause.slug] ?? 0;
          return (
            <li key={cause.slug} className="w-[86%] shrink-0 snap-start first:ml-4 last:mr-4 sm:w-auto sm:first:ml-0 sm:last:mr-0">
              <Link
                href={ROUTES.cause(cause.slug)}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-ink-soft focus-visible:-outline-offset-[7px] sm:aspect-[4/3] lg:aspect-[16/10]"
              >
                <Image
                  src={cause.image.src}
                  alt={cause.image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 86vw"
                  placeholder={cause.image.blurDataURL ? "blur" : "empty"}
                  blurDataURL={cause.image.blurDataURL}
                  className="object-cover transition-transform duration-[900ms] ease-out motion-safe:group-hover:scale-[1.04]"
                  style={focalStyle(cause.image)}
                />
                <span aria-hidden className="absolute inset-0 bg-linear-to-t from-ink via-ink/45 to-ink/0" />

                <div className="relative p-6 sm:p-8 lg:p-11">
                  <p className="eyebrow text-marigold">{cause.tagline}</p>
                  <h3 className="mt-2 text-[2.4rem] leading-none font-semibold text-white lg:text-[3.2rem]">
                    {cause.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[1.02rem] leading-relaxed text-ink-200">{cause.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-white">
                    {count > 0 ? `${count} ${count === 1 ? "camp" : "camps"} on the register` : `See ${cause.title}`}
                    <ArrowRight
                      aria-hidden
                      className="size-5 text-marigold transition-transform duration-200 motion-safe:group-hover:translate-x-1"
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
