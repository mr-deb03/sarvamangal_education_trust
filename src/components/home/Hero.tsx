import { ArrowDown, BadgeCheck, Check, HeartHandshake, Landmark, ReceiptText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Underlined } from "@/components/ui/Underlined";
import type { CampEvent, SiteSettings } from "@/lib/cms/types";
import { focalStyle } from "@/lib/utils";
import { formatBeneficiaries, formatDate, formatPlace } from "@/lib/format";
import { ROUTES } from "@/lib/site";

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

export function Hero({ settings, latest }: { settings: SiteSettings; latest?: CampEvent }) {
  const { hero } = settings;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-9 px-4 pt-4 pb-16 sm:px-6 sm:pt-8 lg:grid-cols-12 lg:gap-y-12 lg:px-8 lg:pt-16 lg:pb-28">
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="rise eyebrow text-crimson">{hero.eyebrow}</p>

          <h1
            id="hero-title"
            className="mt-4 text-[2.4rem] leading-[1.05] font-semibold tracking-[-0.022em] sm:text-6xl lg:text-[2.9rem] xl:text-[3.7rem]"
          >
            {hero.headlineLines.map((line, i) => (
              <span key={line}>
                {/* The space keeps the lines apart in the text search engines read. */}
                {i > 0 ? " " : null}
                <span className="rise block" style={delay(80 + i * 140)}>
                  <Underlined text={line} words={hero.highlightWords} delayMs={700 + i * 280} />
                </span>
              </span>
            ))}
          </h1>

          <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl" style={delay(380)}>
            {hero.intro}
          </p>

          <div className="rise mt-8 flex flex-wrap gap-3" style={delay(480)}>
            <ButtonLink href={settings.donateUrl} size="lg">
              <HeartHandshake aria-hidden />
              Donate now
            </ButtonLink>
            <ButtonLink href="#register" variant="secondary" size="lg">
              See our camps
              <ArrowDown aria-hidden />
            </ButtonLink>
          </div>

          <ul className="rise mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted" style={delay(560)}>
            <li className="flex items-center gap-1.5">
              <BadgeCheck aria-hidden className="size-4 text-crimson" />
              80G tax benefit
            </li>
            <li className="flex items-center gap-1.5">
              <ReceiptText aria-hidden className="size-4 text-crimson" />
              Receipt on email
            </li>
            <li className="flex items-center gap-1.5">
              <Landmark aria-hidden className="size-4 text-crimson" />
              Registered public trust
            </li>
          </ul>
        </div>

        {/* Photo first on phones: the children's faces are the hook. */}
        <div className="relative order-first sm:mb-8 lg:order-none lg:col-span-6 lg:mb-0">
          <figure className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem] bg-paper-2 shadow-[0_40px_80px_-40px_rgb(23_25_59/0.45)] sm:aspect-[6/5] sm:rounded-[1.75rem] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              preload
              quality={80}
              sizes="(min-width: 1280px) 56vw, (min-width: 1024px) 48vw, 100vw"
              placeholder={hero.image.blurDataURL ? "blur" : "empty"}
              blurDataURL={hero.image.blurDataURL}
              className="object-cover object-[50%_40%]"
              style={focalStyle(hero.image)}
            />
          </figure>

          {hero.insetImage ? (
            <figure className="absolute -bottom-8 left-4 hidden w-[46%] max-w-[18rem] overflow-hidden rounded-2xl border-[5px] border-white bg-white shadow-[0_24px_48px_-20px_rgb(23_25_59/0.5)] sm:block lg:-bottom-10 lg:-left-10">
              <div className="relative aspect-[4/3]">
                <Image
                  src={hero.insetImage.src}
                  alt={hero.insetImage.alt}
                  fill
                  sizes="(min-width: 640px) 18rem, 46vw"
                  className="object-cover object-[30%_50%]"
                  style={focalStyle(hero.insetImage)}
                />
              </div>
              {hero.insetCaption ? (
                <figcaption className="px-2 pt-1.5 pb-1 text-sm leading-snug font-semibold text-ink-soft">
                  {hero.insetCaption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {latest ? <LatestCamp event={latest} /> : null}
        </div>
      </div>
    </section>
  );
}

function LatestCamp({ event }: { event: CampEvent }) {
  return (
    <Link
      href={ROUTES.event(event.slug)}
      className="group absolute top-4 right-4 hidden w-[17.5rem] rounded-2xl bg-white/95 p-4 shadow-[0_20px_40px_-18px_rgb(23_25_59/0.45)] ring-1 ring-line backdrop-blur transition-transform duration-300 motion-safe:hover:-translate-y-0.5 sm:block lg:-top-5 lg:-right-4"
    >
      <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-crimson uppercase">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-crimson opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-crimson" />
        </span>
        Latest from the register
      </span>
      <span className="mt-2 block font-display text-lg leading-snug text-ink group-hover:underline">
        {event.title}
      </span>
      <span className="mt-1 block text-sm text-ink-muted">
        {formatDate(event.startDate)} · {formatPlace(event)}
      </span>
      {event.beneficiaries ? (
        <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-crimson">
          <Check aria-hidden className="size-4" />
          {formatBeneficiaries(event.beneficiaries)}
        </span>
      ) : null}
    </Link>
  );
}
