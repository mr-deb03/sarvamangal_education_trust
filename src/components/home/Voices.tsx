import Image from "next/image";

import { SectionIntro } from "@/components/ui/SectionIntro";
import type { Supporter, Testimonial } from "@/lib/cms/types";

import { INITIALS_STYLES, TestimonialCard } from "./TestimonialCard";
import { TestimonialWall } from "./TestimonialWall";

export function Voices({ testimonials, supporters }: { testimonials: Testimonial[]; supporters: Supporter[] }) {
  if (testimonials.length === 0 && supporters.length === 0) return null;
  // Initials colours in list order, so neighbours never share one.
  const tones = new Map(testimonials.map((t, i) => [t.id, INITIALS_STYLES[i % INITIALS_STYLES.length]!]));

  return (
    <section aria-labelledby="voices-title" className="defer-render py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro id="voices-title" eyebrow="Our supporters" title="Why they keep coming back">
          Some have stood with us since our very first year.
        </SectionIntro>

        {testimonials.length > 0 ? (
          <>
            {/* The moving wall (tablet and up, built in the browser): columns drift up and down,
                pausing under the mouse. Hidden under reduced motion. */}
            <TestimonialWall items={testimonials.map((t) => ({ t, tone: tones.get(t.id) }))} />

            {/* Each testimonial once: what screen readers read, a still swipe row on phones,
                and a still grid for visitors who turn off motion. */}
            <ul className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 motion-safe:sm:sr-only lg:grid-cols-3 lg:gap-5 [&::-webkit-scrollbar]:hidden">
              {testimonials.map((t) => (
                <li key={t.id} className="w-[86%] shrink-0 snap-start sm:w-auto">
                  <TestimonialCard t={t} tone={tones.get(t.id)} />
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {supporters.length > 0 ? (
          <div className="mt-10 border-t border-line pt-8 sm:mt-14 sm:pt-10">
            <p className="eyebrow text-center text-ink-muted">With the support of</p>
            <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {supporters.map((s) => (
                <li key={s.id}>
                  <SupporterCard supporter={s} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Logo + name. The marks are icon-only, so the name stays beside them for recognition. */
function SupporterCard({ supporter: s }: { supporter: Supporter }) {
  const body = (
    <>
      {s.logo ? (
        <span className="relative size-10 shrink-0 sm:size-12">
          {/* alt="" — the name right beside it already says who this is. */}
          <Image src={s.logo.src} alt="" fill sizes="(min-width: 640px) 48px, 40px" className="object-contain" />
        </span>
      ) : null}
      <span className="font-display text-base leading-tight font-semibold text-ink sm:text-lg">{s.name}</span>
    </>
  );
  const box = "flex h-full min-h-18 items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-line sm:min-h-20 sm:gap-4 sm:px-5 sm:py-4";

  return s.url ? (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${box} transition-shadow duration-200 hover:shadow-[0_16px_32px_-20px_rgb(23_25_59/0.45)] hover:ring-ink/20`}
    >
      {body}
    </a>
  ) : (
    <div className={box}>{body}</div>
  );
}
