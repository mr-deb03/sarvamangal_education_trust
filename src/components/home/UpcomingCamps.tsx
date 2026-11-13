import { CalendarPlus, Check, Clock, HandHelping, HeartHandshake, MapPin, MessageCircle, Navigation } from "lucide-react";
import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { CampEvent, SiteSettings } from "@/lib/cms/types";
import { calendarHref, directionsHref, eventDayLabel, eventPlace, shareHref } from "@/lib/event-links";
import { formatDate } from "@/lib/format";
import { cn, donateHref, focalStyle, whatsappHref } from "@/lib/utils";

import { Countdown } from "./Countdown";

const MORE_ON_PAGE = 4;
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * Upcoming camps, each as a free-entry ticket: the stub carries the date and a
 * live countdown; the body says what's there and gives each visitor one tap —
 * save it, find it, send it to someone, volunteer, or fund it.
 * Rendered only while something is coming up.
 */
export function UpcomingCamps({ events, settings }: { events: CampEvent[]; settings: SiteSettings }) {
  const [next, ...more] = events;
  if (!next) return null;

  return (
    <section id="coming-up" aria-labelledby="coming-up-title" className="scroll-mt-20 bg-paper-2 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          id="coming-up-title"
          eyebrow="Coming up"
          title={events.length === 1 ? "Our next free camp" : "Our next free camps"}
        >
          Entry is free. Come along, send the details to someone who needs them, or help us run it.
        </SectionIntro>

        <Reveal className="mt-10 lg:mt-12">
          <Ticket event={next} settings={settings} />
        </Reveal>

        {more.length > 0 ? (
          <div className="mt-14">
            <h3 className="eyebrow font-sans text-ink-muted">Also coming up</h3>
            <ul className="mt-5 grid gap-5 md:grid-cols-2">
              {more.slice(0, MORE_ON_PAGE).map((event, i) => (
                <Reveal as="li" key={event.id} delayMs={i * 90}>
                  <MiniTicket event={event} />
                </Reveal>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** The soonest camp, in full. */
function Ticket({ event, settings }: { event: CampEvent; settings: SiteSettings }) {
  const directions = directionsHref(event);
  const volunteerHref = whatsappHref(
    settings.whatsappNumber,
    `Hi! I’d like to volunteer at ${event.title} on ${eventDayLabel(event)}.`,
  );
  const titleId = `camp-${event.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_70px_-45px_rgb(23_25_59/0.45)] ring-1 ring-line",
        event.coverImage
          ? "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)_15.5rem]"
          : "lg:grid-cols-[minmax(0,1fr)_15.5rem]",
      )}
    >
      {/* Phones: the stub is the ticket's header. Desktop: it's on the right, behind the perforation. */}
      <Stub event={event} className="lg:order-3" />

      {event.coverImage ? (
        <div className="relative aspect-[16/9] bg-paper-2 lg:order-1 lg:aspect-auto lg:min-h-[27rem]">
          <Image
            src={event.coverImage.src}
            alt={event.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            quality={75}
            className="object-cover"
            style={focalStyle(event.coverImage)}
          />
        </div>
      ) : null}

      <div className="flex flex-col p-6 sm:p-8 lg:order-2 lg:p-10">
        {event.cause ? <p className="eyebrow text-crimson">{event.cause.title}</p> : null}
        <h3 id={titleId} className="mt-2 text-[1.9rem] leading-[1.1] font-semibold sm:text-[2.3rem]">
          {event.title}
        </h3>

        <ul className="mt-4 space-y-2 text-ink-soft">
          {event.timeLabel ? (
            <li className="flex items-start gap-2.5">
              <Clock aria-hidden className="mt-1 size-[1.1rem] shrink-0 text-crimson" />
              {event.timeLabel}
            </li>
          ) : null}
          <li className="flex items-start gap-2.5">
            <MapPin aria-hidden className="mt-1 size-[1.1rem] shrink-0 text-crimson" />
            <span>
              {eventPlace(event)}
              {directions ? (
                <>
                  {" · "}
                  <a
                    href={directions}
                    {...external}
                    className="inline-flex items-center gap-1 font-semibold text-crimson underline decoration-crimson/35 underline-offset-4 hover:decoration-crimson"
                  >
                    Directions
                    <Navigation aria-hidden className="size-3.5" />
                  </a>
                </>
              ) : null}
            </span>
          </li>
        </ul>

        {event.summary ? <p className="mt-5 leading-relaxed text-ink-muted">{event.summary}</p> : null}

        {event.highlights && event.highlights.length > 0 ? (
          <div className="mt-6">
            <p className="eyebrow text-ink-muted">At the camp</p>
            <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {event.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 font-semibold text-ink">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-crimson" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-auto pt-8">
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={donateHref(settings.donateUrl, { cause: event.cause?.slug })}>
              <HeartHandshake aria-hidden />
              Help fund this camp
            </ButtonLink>
            <ButtonLink href={volunteerHref} variant="secondary" {...external}>
              <HandHelping aria-hidden />
              Volunteer at this camp
            </ButtonLink>
          </div>
          <a
            href={shareHref(event)}
            {...external}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.98rem] text-ink-soft transition-colors hover:text-crimson"
          >
            <MessageCircle aria-hidden className="size-5 text-crimson" />
            <span>
              Know someone who should come?{" "}
              <span className="font-semibold text-crimson underline decoration-crimson/35 underline-offset-4">
                Send them the details on WhatsApp
              </span>
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}

/** "22", or "19–20" for a camp over several days in one month (else the first day). */
function dayRange({ startDate, endDate }: CampEvent) {
  const day = formatDate(startDate, { day: "numeric" });
  const sameMonth = !endDate || endDate.slice(0, 7) === startDate.slice(0, 7);
  return endDate && endDate !== startDate && sameMonth ? `${day}–${formatDate(endDate, { day: "numeric" })}` : day;
}

const isRange = (e: CampEvent) => dayRange(e).includes("–");

/**
 * The tear-off stub: weekday, the day in large figures, month and year, the
 * live countdown, and "Add to calendar". The two paper-coloured circles are the
 * ticket's notches, sitting on the perforation.
 */
function Stub({ event, className }: { event: CampEvent; className?: string }) {
  const { startDate, endDate } = event;
  const sameMonth = !endDate || endDate.slice(0, 7) === startDate.slice(0, 7);

  return (
    <div
      className={cn(
        "relative flex items-center justify-between gap-5 bg-crimson px-6 py-5 text-white [--focus-ring:white] sm:px-8",
        "border-b-2 border-dashed border-white/40 lg:flex-col lg:items-start lg:justify-center lg:border-b-0 lg:border-l-2 lg:px-8 lg:py-10",
        className,
      )}
    >
      <span aria-hidden className="absolute -bottom-3 -left-3 size-6 rounded-full bg-paper-2 lg:-top-3 lg:bottom-auto" />
      <span aria-hidden className="absolute -right-3 -bottom-3 size-6 rounded-full bg-paper-2 lg:right-auto lg:-left-3" />

      <time dateTime={startDate} className="block">
        <span className="eyebrow block text-white/80">{formatDate(startDate, { weekday: "long" })}</span>
        <span
          className={cn(
            "mt-1 block font-display leading-[0.95] font-semibold whitespace-nowrap lining-nums",
            isRange(event) ? "text-[3rem] sm:text-5xl lg:text-[3.6rem]" : "text-[3.6rem] sm:text-6xl lg:text-[5.25rem]",
          )}
        >
          {dayRange(event)}
        </span>
        <span className="mt-1 block text-lg font-semibold">
          {formatDate(startDate, { month: "long", year: "numeric" })}
        </span>
        {endDate && !sameMonth ? (
          <span className="block text-sm text-white/80">to {formatDate(endDate)}</span>
        ) : null}
      </time>

      <div className="flex flex-col items-end gap-2.5 text-right lg:mt-7 lg:items-start lg:text-left">
        <span className="flex min-h-7 items-center">
          <Countdown start={startDate} end={endDate} />
        </span>
        <p className="eyebrow text-marigold-soft">Entry free</p>
        <a
          href={calendarHref(event)}
          {...external}
          className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
        >
          <CalendarPlus aria-hidden className="size-4" />
          Add to calendar
        </a>
      </div>
    </div>
  );
}

/** Later camps: a smaller ticket with the date stub on the left. */
function MiniTicket({ event }: { event: CampEvent }) {
  const directions = directionsHref(event);
  const link = "inline-flex min-h-11 items-center gap-1.5 font-semibold text-crimson hover:underline";

  return (
    <article className="grid h-full grid-cols-[5.75rem_1fr] overflow-hidden rounded-2xl bg-white shadow-[0_24px_44px_-34px_rgb(23_25_59/0.45)] ring-1 ring-line sm:grid-cols-[7rem_1fr]">
      <div className="relative flex flex-col items-center justify-center border-r-2 border-dashed border-white/40 bg-crimson px-2 py-5 text-center text-white">
        <span aria-hidden className="absolute -top-3 -right-3 size-6 rounded-full bg-paper-2" />
        <span aria-hidden className="absolute -right-3 -bottom-3 size-6 rounded-full bg-paper-2" />
        <time dateTime={event.startDate}>
          <span className="eyebrow block text-[0.7rem] text-white/80">
            {formatDate(event.startDate, { weekday: "short" })}
          </span>
          <span
            className={cn(
              "block font-display leading-none font-semibold whitespace-nowrap lining-nums",
              isRange(event) ? "text-[1.6rem] sm:text-[1.9rem]" : "text-[2.6rem]",
            )}
          >
            {dayRange(event)}
          </span>
          <span className="block text-sm font-semibold">{formatDate(event.startDate, { month: "short" })}</span>
        </time>
      </div>

      <div className="flex flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {event.cause ? <p className="eyebrow text-[0.72rem] text-crimson">{event.cause.title}</p> : null}
          <Countdown start={event.startDate} end={event.endDate} className="px-2.5 py-0.5 text-xs" />
        </div>
        <h4 className="mt-1.5 text-xl leading-snug font-semibold">{event.title}</h4>
        <p className="mt-1.5 text-[0.95rem] leading-snug text-ink-muted">
          {[event.timeLabel, eventPlace(event)].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-auto flex flex-wrap gap-x-5 pt-2 text-[0.95rem]">
          <a href={calendarHref(event)} {...external} className={link}>
            <CalendarPlus aria-hidden className="size-4" />
            Add to calendar
          </a>
          {directions ? (
            <a href={directions} {...external} className={link}>
              <Navigation aria-hidden className="size-4" />
              Directions
            </a>
          ) : null}
          <a href={shareHref(event)} {...external} className={link}>
            <MessageCircle aria-hidden className="size-4" />
            Send on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
