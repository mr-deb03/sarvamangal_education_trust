import { ArrowRight, Check, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { CampEvent, EventTimeline, ImpactStat } from "@/lib/cms/types";
import { formatBeneficiaries, formatDate, formatPlace } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { cn, whatsappHref } from "@/lib/utils";

const PAST_ON_PAGE = 6;

/**
 * The camp register — the landing page's signature.
 *
 * Events from the CMS written into a school exercise book: blue ruled lines,
 * a red margin, the date in the margin. Upcoming camps sit on a dashed,
 * tinted row marked "Coming up", because they are not done yet.
 */
export function CampRegister({
  timeline,
  stats,
  whatsappNumber,
}: {
  timeline: EventTimeline;
  stats: ImpactStat[];
  whatsappNumber: string;
}) {
  const past = timeline.past.slice(0, PAST_ON_PAGE);
  const notifyHref = whatsappHref(
    whatsappNumber,
    "Hi! Please let me know when the next Sarvamangal camp is announced.",
  );

  return (
    <section id="register" aria-labelledby="register-title" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionIntro id="register-title" eyebrow="The camp register" title="Written down, camp by camp">
              Since our first exam-anxiety seminar in Bhandup in 2016, we’ve written our camps up here: when
              each one happened, where, and who it served.
            </SectionIntro>

            {stats.length > 0 ? (
              <dl className="mt-10 grid gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-1">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse border-l-2 border-crimson pl-4">
                    <dt className="mt-1 text-[0.95rem] leading-snug text-ink-muted">{s.label}</dt>
                    <dd className="font-display text-[2.6rem] leading-none font-semibold text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <ButtonLink href={ROUTES.events} variant="secondary" className="mt-10">
              Browse all {timeline.total} write-ups
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
        </div>

        <Reveal className="lg:col-span-8">
          <div className="notebook overflow-hidden rounded-[1.25rem] shadow-[0_40px_70px_-40px_rgb(23_25_59/0.45)] ring-1 ring-line">
            <div className="grid grid-cols-[var(--margin-w)_1fr] border-b-2 border-ruling">
              <p className="eyebrow py-4 pr-3 text-right text-[0.7rem] text-pencil sm:pr-5">Date</p>
              <p className="flex items-baseline justify-between gap-4 py-4 pr-4 pl-4 sm:pr-6 sm:pl-6">
                <span className="eyebrow text-[0.7rem] text-pencil">Camp · place · people served</span>
              </p>
            </div>

            <ol>
              {timeline.upcoming.length > 0 ? (
                timeline.upcoming.slice(0, 2).map((e) => <Entry key={e.id} event={e} upcoming />)
              ) : (
                <li className="grid grid-cols-[var(--margin-w)_1fr] border-b border-dashed border-ruling bg-marigold-soft/30">
                  <p className="py-5 pr-3 text-right font-semibold text-pencil sm:pr-5">Next</p>
                  <div className="py-5 pr-4 pl-4 sm:pr-6 sm:pl-6">
                    <p className="leading-snug font-semibold text-ink-soft">Next camp: date being fixed</p>
                    <p className="mt-1 text-[0.95rem] text-ink-muted">
                      Want to know when it’s announced?{" "}
                      <a
                        href={notifyHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-crimson underline decoration-crimson/40 underline-offset-4 hover:decoration-crimson"
                      >
                        <MessageCircle aria-hidden className="size-4" />
                        Message us on WhatsApp
                      </a>
                    </p>
                  </div>
                </li>
              )}
              {past.map((e) => (
                <Entry key={e.id} event={e} />
              ))}
            </ol>

            <div aria-hidden className="notebook-blank h-[5.5rem]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Entry({ event, upcoming = false }: { event: CampEvent; upcoming?: boolean }) {
  return (
    <li
      className={cn(
        "group relative grid grid-cols-[var(--margin-w)_1fr] border-b border-ruling transition-colors hover:bg-paper-2/70",
        upcoming && "border-dashed bg-marigold-soft/30",
      )}
    >
      <p className={cn("py-5 pr-3 text-right leading-tight tabular-nums sm:pr-5", upcoming ? "text-pencil" : "text-ink")}>
        <time dateTime={event.startDate}>
          <span className="block font-semibold sm:text-[1.05rem]">{formatDate(event.startDate, { day: "numeric", month: "short" })}</span>
          <span className="block text-sm text-ink-muted">{event.startDate.slice(0, 4)}</span>
        </time>
      </p>

      <div className="flex items-center gap-4 py-5 pr-4 pl-4 sm:pr-5 sm:pl-6">
        <div className="min-w-0 flex-1">
          {upcoming ? (
            <p className="eyebrow text-[0.7rem] text-crimson">Coming up</p>
          ) : null}
          <h3 className="text-lg leading-snug font-semibold sm:text-xl">
            <Link
              href={ROUTES.event(event.slug)}
              className="after:absolute after:inset-0 group-hover:text-crimson"
            >
              {event.title}
            </Link>
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden className="size-3.5" />
              {formatPlace(event)}
            </span>
            {event.cause ? (
              <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-semibold tracking-wide text-ink-soft ring-1 ring-line">
                {event.cause.title}
              </span>
            ) : null}
          </p>
          {event.beneficiaries ? (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson">
              <Check aria-hidden className="size-4" />
              {formatBeneficiaries(event.beneficiaries)}
            </p>
          ) : null}
        </div>

        {event.coverImage ? (
          <div className="relative hidden h-[4.5rem] w-24 shrink-0 overflow-hidden rounded-md bg-paper-2 shadow-[0_6px_14px_-6px_rgb(23_25_59/0.5)] ring-[3px] ring-white sm:block md:h-20 md:w-28">
            <Image
              src={event.coverImage.src}
              alt=""
              fill
              sizes="112px"
              quality={70}
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}
