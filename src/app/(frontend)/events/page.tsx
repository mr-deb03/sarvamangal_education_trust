import Link from "next/link";

import { RegisterEntry } from "@/components/home/CampRegister";
import { FinalCta } from "@/components/home/FinalCta";
import { UpcomingCamps } from "@/components/home/UpcomingCamps";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCauses, getEventTimeline, getSiteSettings } from "@/lib/cms";
import type { CampEvent } from "@/lib/cms/types";
import { breadcrumbJsonLd, eventJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Camp register: our free camps since 2016",
  description:
    "Free health camps, blood drives, notebook distribution and seminars run by Sarvamangal Education Trust since 2016, with dates, places and photos.",
  path: ROUTES.events,
});

/** Past camps grouped by year, newest year first. */
function byYear(events: CampEvent[]) {
  const years = new Map<string, CampEvent[]>();
  for (const e of events) {
    const year = e.startDate.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), e]);
  }
  return [...years.entries()];
}

/**
 * The full camp register: what's coming up, then every past camp grouped by
 * year, with the year standing in the margin as you read down it.
 */
export default async function EventsPage() {
  const [timeline, settings, causes] = await Promise.all([getEventTimeline(), getSiteSettings(), getCauses()]);
  const years = byYear(timeline.past);
  const firstYear = timeline.past.at(-1)?.startDate.slice(0, 4);

  return (
    <>
      <section aria-labelledby="events-title" className="bg-paper-2">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, { label: "Camp register" }]} />
          <p className="eyebrow mt-6 text-crimson">The camp register</p>
          <h1 id="events-title" className="mt-3 max-w-3xl text-[2.4rem] leading-[1.05] font-semibold sm:text-6xl">
            Written down, camp by camp
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Since our first exam-anxiety seminar in Bhandup in 2016, we’ve written our camps up here: when each one
            happened, where, and who it served. {timeline.total} camps so far
            {firstYear ? `, ${firstYear} to today` : ""}.
          </p>

          {causes.length > 0 ? (
            <nav aria-label="Camps by cause" className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {causes.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={ROUTES.cause(c.slug)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[0.95rem] font-semibold text-ink ring-1 ring-line transition-colors hover:ring-ink/30"
                    >
                      {c.title}
                      <span className="text-sm font-normal text-ink-muted tabular-nums">
                        {timeline.countByCause[c.slug] ?? 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </section>

      <UpcomingCamps events={timeline.upcoming} settings={settings} />

      <section aria-label="Past camps" className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:gap-16 lg:px-8">
          {years.map(([year, events]) => (
            <section key={year} aria-labelledby={`year-${year}`} className="defer-render grid gap-5 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-3">
                <div className="lg:sticky lg:top-28">
                  <h2 id={`year-${year}`} className="font-display text-5xl leading-none font-semibold text-ink lg:text-7xl">
                    {year}
                  </h2>
                  <p className="mt-2 text-ink-muted">
                    {events.length} {events.length === 1 ? "camp" : "camps"}
                  </p>
                </div>
              </div>
              <div className="register overflow-hidden rounded-[1.25rem] bg-white shadow-[0_30px_60px_-45px_rgb(23_25_59/0.4)] ring-1 ring-line lg:col-span-9">
                <ol>
                  {events.map((e) => (
                    <RegisterEntry key={e.id} event={e} />
                  ))}
                </ol>
              </div>
            </section>
          ))}
        </div>
      </section>

      <FinalCta donateUrl={settings.donateUrl} timeline={timeline} />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: ROUTES.home },
            { name: "Camp register", path: ROUTES.events },
          ]),
          ...timeline.upcoming.map(eventJsonLd),
        ]}
      />
    </>
  );
}
