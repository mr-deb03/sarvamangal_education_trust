import { Quote } from "lucide-react";
import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { Supporter, Testimonial } from "@/lib/cms/types";

export function Voices({ testimonials, supporters }: { testimonials: Testimonial[]; supporters: Supporter[] }) {
  if (testimonials.length === 0 && supporters.length === 0) return null;

  return (
    <section aria-labelledby="voices-title" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro id="voices-title" eyebrow="Our supporters" title="Why they keep coming back">
          Some have stood with us since our very first year.
        </SectionIntro>

        {testimonials.length > 0 ? (
          <ul className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal as="li" key={t.id} delayMs={i * 100}>
                <figure className="flex h-full flex-col rounded-2xl bg-paper-2 p-6 ring-1 ring-line sm:p-7">
                  <Quote aria-hidden className="size-7 text-crimson" strokeWidth={1.5} />
                  <blockquote className="mt-4 flex-1 leading-relaxed text-ink-soft">{t.quote}</blockquote>
                  <figcaption className="mt-6 border-t border-line pt-5">
                    <p className="font-display text-lg font-semibold text-ink">{t.name}</p>
                    <p className="text-sm text-ink-muted">{t.role}</p>
                    {t.supporterSince ? (
                      <p className="mt-2 text-sm font-semibold text-crimson">Supporter since {t.supporterSince}</p>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        ) : null}

        {supporters.length > 0 ? (
          <div className="mt-14 border-t border-line pt-10">
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
