import type { Metadata } from "next";
import Link from "next/link";

import { RegisterList } from "@/components/events/RegisterList";
import { UpcomingCamps } from "@/components/events/UpcomingCamps";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCauses, getCopy, getEventTimeline, getSiteSettings } from "@/lib/cms";
import type { CampEvent } from "@/lib/cms/types";
import { fill, plural } from "@/lib/format";
import { breadcrumbJsonLd, eventJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [{ identity }, copy, timeline] = await Promise.all([getSiteSettings(), getCopy(), getEventTimeline()]);
  const text = copy.pages.events;
  const firstYear = timeline.firstYear ?? identity.foundingYear;
  return pageMetadata({
    title: fill(text.metaTitle, { firstYear }),
    description: fill(text.metaDescription, { firstYear }),
    path: ROUTES.events,
    identity,
  });
}

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
  const [timeline, settings, causes, copy] = await Promise.all([
    getEventTimeline(),
    getSiteSettings(),
    getCauses(),
    getCopy(),
  ]);
  const text = copy.pages.events;
  const years = byYear(timeline.past);
  const crumbs = [{ label: copy.labels.common.home, href: ROUTES.home }, { label: text.breadcrumb }];

  return (
    <>
      <section aria-labelledby="events-title" className="bg-paper-2">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-8">
          <Breadcrumbs items={crumbs} label={copy.labels.accessibility.breadcrumb} />
          <p className="eyebrow mt-6 text-crimson">{text.eyebrow}</p>
          <h1 id="events-title" className="mt-3 max-w-3xl text-[2.4rem] leading-[1.05] font-semibold sm:text-6xl">
            {text.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {text.intro}{" "}
            {timeline.past.length > 0
              ? fill(text.countLine, { total: timeline.past.length, firstYear: timeline.firstYear })
              : null}
          </p>

          {causes.length > 0 ? (
            <nav aria-label={text.byCauseLabel} className="mt-8">
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

      <UpcomingCamps events={timeline.upcoming} settings={settings} copy={copy} />

      <section aria-label={text.pastLabel} className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:gap-16 lg:px-8">
          {years.map(([year, events]) => (
            <section key={year} aria-labelledby={`year-${year}`} className="defer-render grid gap-5 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-3">
                <div className="lg:sticky lg:top-28">
                  <h2 id={`year-${year}`} className="font-display text-5xl leading-none font-semibold text-ink lg:text-7xl">
                    {year}
                  </h2>
                  <p className="mt-2 text-ink-muted">{plural(events.length, text.yearCount)}</p>
                </div>
              </div>
              <RegisterList events={events} className="lg:col-span-9" />
            </section>
          ))}
        </div>
      </section>

      <FinalCta settings={settings} timeline={timeline} copy={copy} />

      <JsonLd data={[breadcrumbJsonLd(crumbs, ROUTES.events), ...timeline.upcoming.map(eventJsonLd)]} />
    </>
  );
}
