import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CalendarPlus,
  Check,
  HeartHandshake,
  Images,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { EventGallery } from "@/components/events/EventGallery";
import { RegisterEntry } from "@/components/home/CampRegister";
import { Ticket } from "@/components/home/UpcomingCamps";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getEvent, getEventTimeline, getEvents, getSiteSettings } from "@/lib/cms";
import { calendarHref, directionsHref, shareHref } from "@/lib/event-links";
import { formatBeneficiaries, formatDate, formatPlace } from "@/lib/format";
import { breadcrumbJsonLd, clampDescription, eventJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES, SITE_NAME } from "@/lib/site";
import { cn, donateHref, focalStyle } from "@/lib/utils";

/** Every camp in the CMS is prebuilt; camps added later render on their first visit. */
export async function generateStaticParams() {
  const events = await getEvents();
  // Cache Components needs at least one param to validate the route at build time.
  return events.length > 0 ? events.map((e) => ({ slug: e.slug })) : [{ slug: "no-camps-yet" }];
}

const longDate = (date: string) =>
  formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** The write-up's first paragraph as plain text — the description when there's no summary. */
function firstParagraph(html?: string) {
  const match = html?.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  if (!match?.[1]) return undefined;
  const text = match[1]
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return text || undefined;
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Camp not found", robots: { index: false } };

  const place = formatPlace(event);
  const lead = event.summary ?? firstParagraph(event.bodyHtml);
  const fallback = lead ?? `${event.title} by ${SITE_NAME} on ${formatDate(event.startDate)}${place ? `, ${place}` : ""}.`;
  return pageMetadata({
    title: event.seoTitle ?? `${event.title}, ${formatDate(event.startDate)}`,
    description: clampDescription(event.seoDescription ?? fallback),
    path: ROUTES.event(event.slug),
    image: event.coverImage ? { src: event.coverImage.src, alt: event.coverImage.alt } : undefined,
  });
}

/** One row of the camp-details card. */
function Detail({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 py-3 first:pt-0 last:pb-0">
      <dt className="pt-0.5 text-sm text-ink-muted">{term}</dt>
      <dd className="min-w-0 text-ink">{children}</dd>
    </div>
  );
}

/**
 * One camp: a banner of the camp's own photo with its title and the facts;
 * the write-up beside a card of details and the Donate box; then every photo
 * from the day (the page's signature — a contact sheet with a full-screen
 * viewer), and the camps either side of it in the register.
 */
export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const [event, settings, timeline, events] = await Promise.all([
    getEvent(slug),
    getSiteSettings(),
    getEventTimeline(),
    getEvents(),
  ]);
  if (!event) notFound();

  const upcoming = timeline.upcoming.some((e) => e.slug === event.slug);
  // Register order (newest first): the previous entry is the newer camp, the next the older one.
  const index = events.findIndex((e) => e.slug === event.slug);
  const newer = index > 0 ? events[index - 1] : undefined;
  const older = index >= 0 ? events[index + 1] : undefined;
  const sameCause = events.filter((e) => e.slug !== event.slug && e.cause?.slug === event.cause?.slug).slice(0, 4);
  const place = formatPlace(event);
  const where = event.venue ? `${event.venue}, ${place}` : place;
  const directions = directionsHref(event);
  const photos = event.gallery ?? [];
  const cover = event.coverImage;
  const when = `${longDate(event.startDate)}${
    event.endDate && event.endDate !== event.startDate ? ` to ${longDate(event.endDate)}` : ""
  }`;
  const crumbs = [
    { label: "Home", href: ROUTES.home },
    { label: "Camp register", href: ROUTES.events },
    { label: event.title },
  ];

  return (
    <>
      <article aria-labelledby="camp-title">
        {/* The banner: the camp's own photo, its title and the facts. */}
        <header className="relative isolate overflow-hidden bg-ink">
          {cover ? (
            <>
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                preload
                quality={75}
                sizes="100vw"
                className="-z-20 object-cover"
                style={focalStyle(cover)}
              />
              {/* Dark at the top for the breadcrumbs, and at the foot for the title. */}
              <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/90 via-ink/55 to-transparent" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[80%] bg-gradient-to-t from-ink via-ink/75 to-transparent" />
            </>
          ) : null}
          <div
            className={cn(
              "mx-auto flex max-w-7xl flex-col px-4 pt-4 pb-8 sm:px-6 sm:pt-6 lg:px-8 lg:pb-12",
              cover ? "min-h-[28rem] sm:min-h-[34rem] lg:min-h-[40rem]" : "min-h-[18rem]",
            )}
          >
            <Breadcrumbs tone="dark" items={crumbs} />
            <div className="mt-auto pt-16">
              {event.cause ? (
                <Link
                  href={ROUTES.cause(event.cause.slug)}
                  className="eyebrow inline-flex min-h-11 items-center text-marigold hover:underline"
                >
                  {event.cause.title}
                </Link>
              ) : null}
              <h1
                id="camp-title"
                className="max-w-4xl text-[2.3rem] leading-[1.04] font-semibold text-balance text-white sm:text-5xl lg:text-[4.25rem]"
              >
                {event.title}
              </h1>

              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-white/90">
                <li className="flex items-center gap-2">
                  <CalendarDays aria-hidden className="size-[1.1rem] shrink-0 text-marigold" />
                  <time dateTime={event.startDate}>{formatDate(event.startDate)}</time>
                </li>
                {place ? (
                  <li className="flex items-center gap-2">
                    <MapPin aria-hidden className="size-[1.1rem] shrink-0 text-marigold" />
                    {place}
                  </li>
                ) : null}
                {event.beneficiaries ? (
                  <li className="flex items-center gap-2 font-semibold text-white">
                    <Users aria-hidden className="size-[1.1rem] shrink-0 text-marigold" />
                    {formatBeneficiaries(event.beneficiaries)}
                  </li>
                ) : null}
              </ul>

              {photos.length > 0 ? (
                <a
                  href="#photos"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-5 font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/20"
                >
                  <Images aria-hidden className="size-5 text-marigold" />
                  See all {photos.length} photos
                </a>
              ) : null}
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-14">
          <div className="min-w-0 lg:col-span-8">
            {upcoming ? (
              <div className="mb-10">
                <Ticket event={event} settings={settings} />
              </div>
            ) : null}

            {event.summary ? (
              <p className="font-display text-[1.3rem] leading-snug text-ink sm:text-[1.45rem]">{event.summary}</p>
            ) : null}

            {event.bodyHtml ? (
              // Written by the trust's team in /admin (rich text), rendered to HTML on the server.
              <div
                className={cn("prose-camp max-w-3xl", event.summary ? "mt-6" : "prose-lead")}
                dangerouslySetInnerHTML={{ __html: event.bodyHtml }}
              />
            ) : null}

            {!upcoming && event.highlights && event.highlights.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">At the camp</h2>
                <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {event.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-semibold text-ink">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-crimson" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {photos.length > 0 ? (
              <section id="photos" aria-labelledby="photos-title" className="mt-12 scroll-mt-24 first:mt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 id="photos-title" className="text-2xl font-semibold sm:text-3xl">
                    Photos from the camp
                  </h2>
                  <p className="text-sm text-ink-muted tabular-nums">{photos.length} photos · tap one to enlarge</p>
                </div>
                <div className="mt-5">
                  <EventGallery photos={photos} title={event.title} />
                </div>
              </section>
            ) : null}
          </div>

          <aside aria-label="Camp details and how to help" className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-28">
              <section aria-labelledby="details-title" className="rounded-[1.5rem] bg-white p-6 ring-1 ring-line sm:p-7">
                <h2 id="details-title" className="text-xl font-semibold">
                  Camp details
                </h2>
                <dl className="mt-4 divide-y divide-line">
                  <Detail term="When">
                    <time dateTime={event.startDate}>{when}</time>
                    {event.timeLabel ? <span className="block text-ink-muted">{event.timeLabel}</span> : null}
                  </Detail>
                  {where ? (
                    <Detail term="Where">
                      {where}
                      {directions ? (
                        <a
                          href={directions}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex min-h-11 items-center gap-1 font-semibold text-crimson hover:underline"
                        >
                          Get directions
                          <ArrowUpRight aria-hidden className="size-4" />
                        </a>
                      ) : null}
                    </Detail>
                  ) : null}
                  {event.cause ? (
                    <Detail term="Cause">
                      <Link href={ROUTES.cause(event.cause.slug)} className="font-semibold text-crimson hover:underline">
                        {event.cause.title}
                      </Link>
                    </Detail>
                  ) : null}
                  {event.beneficiaries ? (
                    <Detail term={upcoming ? "Expected" : "People served"}>
                      {formatBeneficiaries(event.beneficiaries)}
                    </Detail>
                  ) : null}
                  {event.partners && event.partners.length > 0 ? (
                    <Detail term="Run with">{event.partners.join(", ")}</Detail>
                  ) : null}
                </dl>

                <div className="mt-5 flex flex-col gap-1 border-t border-line pt-4">
                  {upcoming ? (
                    <a
                      href={calendarHref(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink-soft hover:text-crimson"
                    >
                      <CalendarPlus aria-hidden className="size-5 text-crimson" />
                      Add to calendar
                    </a>
                  ) : null}
                  <a
                    href={shareHref(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink-soft hover:text-crimson"
                  >
                    <MessageCircle aria-hidden className="size-5 text-crimson" />
                    Share this camp on WhatsApp
                  </a>
                </div>
              </section>

              <div className="on-ink rounded-[1.5rem] p-6 sm:p-7">
                <p className="eyebrow text-marigold">Keep the next one free</p>
                <p className="mt-3 font-display text-2xl leading-snug text-white">
                  Every camp like this is free for the people who come. Your gift pays for the next one.
                </p>
                <ButtonLink
                  href={donateHref(settings.donateUrl, { cause: event.cause?.slug })}
                  variant="marigold"
                  size="lg"
                  className="mt-6 w-full"
                >
                  <HeartHandshake aria-hidden />
                  Donate
                </ButtonLink>
                <p className="mt-3 text-sm text-ink-200">
                  80G tax benefit · receipt by email · Indian citizens living in India only
                </p>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <nav aria-label="More camps" className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-16">
          {sameCause.length > 0 && event.cause ? (
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-2xl font-semibold sm:text-3xl">More {event.cause.title.toLowerCase()} camps</h2>
                <Link
                  href={ROUTES.cause(event.cause.slug)}
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-crimson hover:underline"
                >
                  All {event.cause.title.toLowerCase()} camps
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
              <div className="register mt-6 overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-line">
                <ol>
                  {sameCause.map((e) => (
                    <RegisterEntry key={e.id} event={e} />
                  ))}
                </ol>
              </div>
            </div>
          ) : null}

          <div className="grid content-start gap-3 lg:col-span-4">
            {newer ? (
              <Link
                href={ROUTES.event(newer.slug)}
                className="group rounded-2xl p-5 ring-1 ring-line transition-colors hover:bg-paper-2"
              >
                <span className="eyebrow flex items-center gap-1.5 text-ink-muted">
                  <ArrowLeft aria-hidden className="size-4" /> Newer camp
                </span>
                <span className="mt-2 block font-display text-lg leading-snug text-ink group-hover:text-crimson">
                  {newer.title}
                </span>
                <span className="text-sm text-ink-muted">{formatDate(newer.startDate)}</span>
              </Link>
            ) : null}
            {older ? (
              <Link
                href={ROUTES.event(older.slug)}
                className="group rounded-2xl p-5 ring-1 ring-line transition-colors hover:bg-paper-2"
              >
                <span className="eyebrow flex items-center gap-1.5 text-ink-muted">
                  Older camp <ArrowRight aria-hidden className="size-4" />
                </span>
                <span className="mt-2 block font-display text-lg leading-snug text-ink group-hover:text-crimson">
                  {older.title}
                </span>
                <span className="text-sm text-ink-muted">{formatDate(older.startDate)}</span>
              </Link>
            ) : null}
            <Link
              href={ROUTES.events}
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-crimson hover:underline"
            >
              The whole camp register
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </nav>

      <JsonLd
        data={[
          eventJsonLd(event),
          breadcrumbJsonLd([
            { name: "Home", path: ROUTES.home },
            { name: "Camp register", path: ROUTES.events },
            { name: event.title, path: ROUTES.event(event.slug) },
          ]),
        ]}
      />
    </>
  );
}
