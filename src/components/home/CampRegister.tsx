import { ArrowRight, ArrowUp, MessageCircle } from "lucide-react";

import { RegisterList } from "@/components/events/RegisterList";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { EventTimeline, ImpactStat, SiteCopy } from "@/lib/cms/types";
import { eventDayLabel } from "@/lib/event-links";
import { fill } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { whatsappHref } from "@/lib/utils";

const PAST_ON_PAGE = 6;
/** Phones show the four latest; "Browse all" has the rest. */
const PAST_ON_PHONES = 4;

const nextRow = "grid grid-cols-[var(--margin-w)_1fr] border-b border-dashed border-line bg-marigold-soft/35";
const inlineLink =
  "inline-flex min-h-11 items-center gap-1 font-semibold text-crimson underline decoration-crimson/40 underline-offset-4 hover:decoration-crimson sm:min-h-0";

/**
 * The camp register: events from the CMS as a dated list, newest first.
 * Upcoming camps sit on a dashed, tinted row marked "Next", because they
 * are not done yet. Kept quiet — the photo wall is the page's one bold element.
 */
export function CampRegister({
  timeline,
  stats,
  whatsappNumber,
  copy,
}: {
  timeline: EventTimeline;
  stats: ImpactStat[];
  whatsappNumber: string;
  copy: SiteCopy;
}) {
  const text = copy.home.register;
  const past = timeline.past.slice(0, PAST_ON_PAGE);
  const [next] = timeline.upcoming;
  const notifyHref = whatsappHref(whatsappNumber, copy.labels.messages.notifyNextCamp);

  return (
    <section id="register" aria-labelledby="register-title" className="defer-render scroll-mt-20 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionIntro id="register-title" eyebrow={text.eyebrow} title={text.title}>
              {text.intro}
            </SectionIntro>

            {stats.length > 0 ? (
              <dl className="mt-8 grid gap-x-6 gap-y-4 sm:mt-10 sm:grid-cols-3 sm:gap-y-7 lg:grid-cols-1">
                {stats.map((s, i) => (
                  <div
                    key={`${s.label}-${i}`}
                    className="flex flex-col-reverse border-l-2 border-crimson pl-4 max-sm:flex-row-reverse max-sm:items-center max-sm:justify-end max-sm:gap-4"
                  >
                    <dt className="text-[0.95rem] leading-snug text-ink-muted sm:mt-1">{s.label}</dt>
                    <dd className="min-w-[5.25rem] shrink-0 font-display text-[2.1rem] leading-none font-semibold text-ink sm:min-w-0 sm:text-[2.6rem]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <ButtonLink href={ROUTES.events} variant="secondary" className="mt-10">
              {fill(text.browseAll, { total: timeline.past.length })}
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
        </div>

        <Reveal className="lg:col-span-8">
          <RegisterList
            events={past}
            hideFromIndex={PAST_ON_PHONES}
            className="shadow-[0_40px_70px_-45px_rgb(23_25_59/0.4)]"
            header={
              <div className="grid grid-cols-[var(--margin-w)_1fr] border-b border-line bg-paper-2/70">
                <p className="eyebrow py-4 pr-3 text-right text-[0.7rem] text-pencil sm:pr-5">{text.dateColumn}</p>
                <p className="py-4 pr-4 pl-4 sm:pr-6 sm:pl-6">
                  <span className="eyebrow text-[0.7rem] text-pencil">{text.campColumn}</span>
                </p>
              </div>
            }
            before={
              // Upcoming camps have their own section (UpcomingCamps); the register just points to it.
              next ? (
                <li className={nextRow}>
                  <p className="py-5 pr-3 text-right font-semibold text-pencil sm:pr-5">{text.nextLabel}</p>
                  <div className="py-5 pr-4 pl-4 sm:pr-6 sm:pl-6">
                    <p className="leading-snug font-semibold text-ink-soft">
                      {timeline.upcoming.length === 1
                        ? `${next.title} — ${eventDayLabel(next)}`
                        : fill(text.upcomingCount, { n: timeline.upcoming.length })}
                    </p>
                    <a href="#coming-up" className={`mt-1 text-[0.95rem] ${inlineLink}`}>
                      {timeline.upcoming.length === 1 ? text.seeDetails : text.seeDates}
                      <ArrowUp aria-hidden className="size-4" />
                    </a>
                  </div>
                </li>
              ) : (
                <li className={nextRow}>
                  <p className="py-5 pr-3 text-right font-semibold text-pencil sm:pr-5">{text.nextLabel}</p>
                  <div className="py-5 pr-4 pl-4 sm:pr-6 sm:pl-6">
                    <p className="leading-snug font-semibold text-ink-soft">{text.noDateYet}</p>
                    <p className="mt-1 text-[0.95rem] text-ink-muted">
                      {text.notifyPrompt}{" "}
                      <a href={notifyHref} target="_blank" rel="noopener noreferrer" className={inlineLink}>
                        <MessageCircle aria-hidden className="size-4" />
                        {text.notifyCta}
                      </a>
                    </p>
                  </div>
                </li>
              )
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
