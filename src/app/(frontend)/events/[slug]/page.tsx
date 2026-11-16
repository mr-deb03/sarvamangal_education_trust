import { ArrowLeft, ArrowRight, CalendarDays, Check, HeartHandshake, MapPin, MessageCircle, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RegisterList } from "@/components/events/RegisterList";
import { Ticket } from "@/components/events/UpcomingCamps";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCopy, getEvent, getEventTimeline, getEvents, getSiteSettings } from "@/lib/cms";
import { shareHref } from "@/lib/event-links";
import { fill, formatBeneficiaries, formatDate, formatPlace } from "@/lib/format";
import { breadcrumbJsonLd, clampDescription, eventJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";
import { donateHref, focalStyle } from "@/lib/utils";

/** Every camp in the CMS is prebuilt; camps added later render on their first visit. */
export async function generateStaticParams() {
  const events = await getEvents();
  // Cache Components needs at least one param to validate the route at build time.
  return events.length > 0 ? events.map((e) => ({ slug: e.slug })) : [{ slug: "no-camps-yet" }];
}

const longDate = (date: string) =>
  formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [event, { identity }, copy] = await Promise.all([getEvent(slug), getSiteSettings(), getCopy()]);
  const text = copy.pages.event;
  if (!event) return { title: text.notFoundTitle, robots: { index: false } };

  const place = formatPlace(event);
  const date = formatDate(event.startDate);
  const fallback = [
    fill(text.metaDescription, { title: event.title, siteName: identity.siteName, date, place: place ? `, ${place}` : "" }),
    event.summary,
  ]
    .filter(Boolean)
    .join(" ");
  return pageMetadata({
    title: event.seoTitle ?? fill(text.metaTitle, { title: event.title, date }),
    description: clampDescription(event.seoDescription ?? fallback),
    path: ROUTES.event(event.slug),
    identity,
    image: event.coverImage,
    type: "article",
  });
}

/**
 * The page itself is a static frame; the camp, which depends on the URL, renders
 * inside <Suspense>. Known camps are still prerendered in full (generateStaticParams);
 * on a client navigation the frame shows at once while the rest streams in.
 */
export default function EventPage({ params }: PageProps<"/events/[slug]">) {
  return (
    <Suspense fallback={<CampSkeleton />}>
      <Camp params={params} />
    </Suspense>
  );
}

/** Roughly the camp header's shape, so nothing jumps when the camp arrives. */
function CampSkeleton() {
  return (
    <div aria-hidden className="bg-paper-2">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pb-14">
        <div className="h-11 w-56 animate-pulse rounded bg-line/70" />
        <div className="mt-6 h-12 max-w-2xl animate-pulse rounded bg-line/70 sm:h-16" />
        <div className="mt-6 h-6 w-80 max-w-full animate-pulse rounded bg-line/70" />
      </div>
    </div>
  );
}

/**
 * One camp: the cover photo, when and where, who it served, the write-up and
 * any photos — then one way to help keep the next one free, and the camps on
 * either side of it in the register.
 */
async function Camp({ params }: { params: PageProps<"/events/[slug]">["params"] }) {
  const { slug } = await params;
  const [event, settings, timeline, events, copy] = await Promise.all([
    getEvent(slug),
    getSiteSettings(),
    getEventTimeline(),
    getEvents(),
    getCopy(),
  ]);
  if (!event) notFound();

  const text = copy.pages.event;
  const upcoming = timeline.upcoming.some((e) => e.slug === event.slug);
  // Register order (newest first): the previous entry is the newer camp, the next the older one.
  const index = events.findIndex((e) => e.slug === event.slug);
  const newer = index > 0 ? events[index - 1] : undefined;
  const older = index >= 0 ? events[index + 1] : undefined;
  // "More camps" is the register: camps that have happened, not ones still to come.
  const sameCause = timeline.past.filter((e) => e.slug !== event.slug && e.cause?.slug === event.cause?.slug).slice(0, 4);
  const place = formatPlace(event);
  const causeName = event.cause?.title.toLowerCase() ?? "";
  const crumbs = [
    { label: copy.labels.common.home, href: ROUTES.home },
    { label: copy.pages.events.breadcrumb, href: ROUTES.events },
    { label: event.title },
  ];

  return (
    <>
      <article aria-labelledby="camp-title">
        <header className="bg-paper-2">
          <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pb-14">
            <Breadcrumbs items={crumbs} label={copy.labels.accessibility.breadcrumb} />
            {event.cause ? (
              <Link
                href={ROUTES.cause(event.cause.slug)}
                className="eyebrow mt-6 inline-flex min-h-11 items-center text-crimson hover:underline"
              >
                {event.cause.title}
              </Link>
            ) : null}
            <h1 id="camp-title" className="mt-1 max-w-4xl text-[2.2rem] leading-[1.06] font-semibold sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-ink-soft">
              <li className="flex items-center gap-2">
                <CalendarDays aria-hidden className="size-[1.1rem] text-crimson" />
                <time dateTime={event.startDate}>
                  {event.endDate && event.endDate !== event.startDate
                    ? fill(text.dateRange, { start: longDate(event.startDate), end: longDate(event.endDate) })
                    : longDate(event.startDate)}
                </time>
                {event.timeLabel ? <span className="text-ink-muted">· {event.timeLabel}</span> : null}
              </li>
              {place ? (
                <li className="flex items-center gap-2">
                  <MapPin aria-hidden className="size-[1.1rem] text-crimson" />
                  {event.venue ? `${event.venue}, ${place}` : place}
                </li>
              ) : null}
              {event.beneficiaries ? (
                <li className="flex items-center gap-2 font-semibold text-crimson">
                  <Users aria-hidden className="size-[1.1rem]" />
                  {formatBeneficiaries(event.beneficiaries)}
                </li>
              ) : null}
            </ul>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-14">
          <div className="min-w-0 lg:col-span-8">
            {event.coverImage ? (
              <figure className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-paper-2 shadow-[0_40px_70px_-45px_rgb(23_25_59/0.45)]">
                <Image
                  src={event.coverImage.src}
                  alt={event.coverImage.alt}
                  fill
                  preload
                  quality={80}
                  sizes="(min-width: 1280px) 820px, (min-width: 1024px) 64vw, 100vw"
                  className="object-cover"
                  style={focalStyle(event.coverImage)}
                />
              </figure>
            ) : null}

            {upcoming ? (
              <div className="mt-10">
                <Ticket event={event} settings={settings} copy={copy} headingLevel={2} />
              </div>
            ) : null}

            {event.summary ? (
              <p className="mt-10 font-display text-[1.4rem] leading-snug text-ink sm:text-[1.6rem]">{event.summary}</p>
            ) : null}

            {event.bodyHtml ? (
              // Written by the trust's team in /admin (rich text), rendered to HTML on the server.
              <div className="prose-camp mt-8" dangerouslySetInnerHTML={{ __html: event.bodyHtml }} />
            ) : null}

            {!upcoming && event.highlights && event.highlights.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">{text.highlightsTitle}</h2>
                <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {event.highlights.map((item, i) => (
                    <li key={`${item}-${i}`} className="flex items-start gap-2 font-semibold text-ink">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-crimson" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {event.partners && event.partners.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">{text.partnersTitle}</h2>
                <p className="mt-3 text-ink-soft">{event.partners.join(" · ")}</p>
              </div>
            ) : null}

            {event.gallery && event.gallery.length > 0 ? (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold">{text.galleryTitle}</h2>
                <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {event.gallery.map((photo, i) => (
                    <li key={`${photo.src}-${i}`} className="relative aspect-square overflow-hidden rounded-xl bg-paper-2">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
                        quality={75}
                        className="object-cover"
                        style={focalStyle(photo)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* One way to help, beside the story on desktop and after it on phones. */}
          <aside aria-label={text.helpLabel} className="lg:col-span-4">
            <div className="on-ink rounded-[1.5rem] p-6 sm:p-7 lg:sticky lg:top-28">
              <p className="eyebrow text-marigold">{text.helpEyebrow}</p>
              <p className="mt-3 font-display text-2xl leading-snug text-white">{text.helpText}</p>
              <ButtonLink
                href={donateHref(settings.donateUrl, { cause: event.cause?.slug })}
                variant="marigold"
                size="lg"
                className="mt-6 w-full"
              >
                <HeartHandshake aria-hidden />
                {text.helpDonate}
              </ButtonLink>
              <p className="mt-3 text-sm text-ink-200">{text.helpNote}</p>
              <a
                href={shareHref(event, { messages: copy.labels.messages, siteName: settings.identity.siteName })}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-white hover:text-marigold"
              >
                <MessageCircle aria-hidden className="size-5 text-marigold" />
                {text.share}
              </a>
            </div>
          </aside>
        </div>
      </article>

      <nav aria-label={text.moreLabel} className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-16">
          {sameCause.length > 0 && event.cause ? (
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-2xl font-semibold sm:text-3xl">{fill(text.moreInCause, { cause: causeName })}</h2>
                <Link
                  href={ROUTES.cause(event.cause.slug)}
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-crimson hover:underline"
                >
                  {fill(text.allInCause, { cause: causeName })}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
              <RegisterList events={sameCause} className="mt-6 shadow-none" />
            </div>
          ) : null}

          <div className="grid content-start gap-3 lg:col-span-4">
            {newer ? (
              <Link href={ROUTES.event(newer.slug)} className="group rounded-2xl p-5 ring-1 ring-line transition-colors hover:bg-paper-2">
                <span className="eyebrow flex items-center gap-1.5 text-ink-muted">
                  <ArrowLeft aria-hidden className="size-4" /> {text.newer}
                </span>
                <span className="mt-2 block font-display text-lg leading-snug text-ink group-hover:text-crimson">
                  {newer.title}
                </span>
                <span className="text-sm text-ink-muted">{formatDate(newer.startDate)}</span>
              </Link>
            ) : null}
            {older ? (
              <Link href={ROUTES.event(older.slug)} className="group rounded-2xl p-5 ring-1 ring-line transition-colors hover:bg-paper-2">
                <span className="eyebrow flex items-center gap-1.5 text-ink-muted">
                  {text.older} <ArrowRight aria-hidden className="size-4" />
                </span>
                <span className="mt-2 block font-display text-lg leading-snug text-ink group-hover:text-crimson">
                  {older.title}
                </span>
                <span className="text-sm text-ink-muted">{formatDate(older.startDate)}</span>
              </Link>
            ) : null}
            <Link href={ROUTES.events} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-crimson hover:underline">
              {text.wholeRegister}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </nav>

      <JsonLd data={[eventJsonLd(event), breadcrumbJsonLd(crumbs, ROUTES.event(event.slug))]} />
    </>
  );
}
