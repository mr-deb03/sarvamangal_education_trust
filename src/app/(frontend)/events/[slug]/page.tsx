import { ArrowLeft, ArrowRight, CalendarDays, Check, HeartHandshake, MapPin, MessageCircle, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RegisterEntry } from "@/components/home/CampRegister";
import { Ticket } from "@/components/home/UpcomingCamps";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getEvent, getEventTimeline, getEvents, getSiteSettings } from "@/lib/cms";
import { shareHref } from "@/lib/event-links";
import { formatBeneficiaries, formatDate, formatPlace } from "@/lib/format";
import { breadcrumbJsonLd, clampDescription, eventJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES, SITE_NAME } from "@/lib/site";
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
  const event = await getEvent(slug);
  if (!event) return { title: "Camp not found", robots: { index: false } };

  const place = formatPlace(event);
  const fallback = `${event.title} by ${SITE_NAME} on ${formatDate(event.startDate)}${place ? `, ${place}` : ""}.${
    event.summary ? ` ${event.summary}` : ""
  }`;
  return pageMetadata({
    title: event.seoTitle ?? `${event.title}, ${formatDate(event.startDate)}`,
    description: clampDescription(event.seoDescription ?? fallback),
    path: ROUTES.event(event.slug),
    image: event.coverImage ? { src: event.coverImage.src, alt: event.coverImage.alt } : undefined,
  });
}

/**
 * One camp: the cover photo, when and where, who it served, the write-up and
 * any photos — then one way to help keep the next one free, and the camps on
 * either side of it in the register.
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
  const crumbs = [
    { label: "Home", href: ROUTES.home },
    { label: "Camp register", href: ROUTES.events },
    { label: event.title },
  ];

  return (
    <>
      <article aria-labelledby="camp-title">
        <header className="bg-paper-2">
          <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pb-14">
            <Breadcrumbs items={crumbs} />
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
                  {longDate(event.startDate)}
                  {event.endDate && event.endDate !== event.startDate ? ` to ${longDate(event.endDate)}` : ""}
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
                <Ticket event={event} settings={settings} />
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

            {event.partners && event.partners.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">Run together with</h2>
                <p className="mt-3 text-ink-soft">{event.partners.join(" · ")}</p>
              </div>
            ) : null}

            {event.gallery && event.gallery.length > 0 ? (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold">Photos from the camp</h2>
                <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {event.gallery.map((photo) => (
                    <li key={photo.src} className="relative aspect-square overflow-hidden rounded-xl bg-paper-2">
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
          <aside aria-label="Help" className="lg:col-span-4">
            <div className="on-ink rounded-[1.5rem] p-6 sm:p-7 lg:sticky lg:top-28">
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
              <p className="mt-3 text-sm text-ink-200">80G tax benefit · receipt by email</p>
              <a
                href={shareHref(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-white hover:text-marigold"
              >
                <MessageCircle aria-hidden className="size-5 text-marigold" />
                Share this camp on WhatsApp
              </a>
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
