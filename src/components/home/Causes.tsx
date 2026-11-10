import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { Cause } from "@/lib/cms/types";
import { ROUTES } from "@/lib/site";

export function Causes({ causes, countByCause }: { causes: Cause[]; countByCause: Record<string, number> }) {
  if (causes.length === 0) return null;

  return (
    <section id="causes" aria-labelledby="causes-title" className="scroll-mt-20 bg-paper-2 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro id="causes-title" eyebrow="Our causes" title="Four ways we show up">
          One trust, one team of volunteers, four kinds of care. Start with the one closest to your heart.
        </SectionIntro>

        {/* Phones: a swipeable row with the next card peeking in. Wider: a grid. */}
        <Reveal as="ul" className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-14 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {causes.map((cause) => {
            const count = countByCause[cause.slug] ?? 0;
            return (
              <li key={cause.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <Link
                  href={ROUTES.cause(cause.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-[box-shadow,transform] duration-300 hover:shadow-[0_28px_50px_-28px_rgb(23_25_59/0.45)] motion-safe:hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
                    <Image
                      src={cause.image.src}
                      alt={cause.image.alt}
                      fill
                      sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
                      placeholder={cause.image.blurDataURL ? "blur" : "empty"}
                      blurDataURL={cause.image.blurDataURL}
                      className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-sm font-semibold text-crimson">{cause.tagline}</p>
                    <h3 className="mt-1 text-[1.65rem] font-semibold">{cause.title}</h3>
                    <p className="mt-2 flex-1 text-[0.98rem] leading-relaxed text-ink-muted">{cause.summary}</p>
                    <p className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                      <span className="text-sm font-semibold text-ink">
                        {count > 0 ? `${count} ${count === 1 ? "camp" : "camps"} on the register` : "See this cause"}
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="size-5 text-crimson transition-transform duration-200 motion-safe:group-hover:translate-x-1"
                      />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
