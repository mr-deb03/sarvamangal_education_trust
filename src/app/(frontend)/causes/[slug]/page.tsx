import { ArrowRight, HeartHandshake } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RegisterList } from "@/components/events/RegisterList";
import { UpcomingCamps } from "@/components/events/UpcomingCamps";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCause, getCauses, getCopy, getEventTimeline, getSiteSettings } from "@/lib/cms";
import { fill, plural } from "@/lib/format";
import { breadcrumbJsonLd, clampDescription, eventJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";
import { donateHref, focalStyle } from "@/lib/utils";

export async function generateStaticParams() {
  const causes = await getCauses();
  return causes.length > 0 ? causes.map((c) => ({ slug: c.slug })) : [{ slug: "no-causes-yet" }];
}

export async function generateMetadata({ params }: PageProps<"/causes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [cause, { identity }, copy] = await Promise.all([getCause(slug), getSiteSettings(), getCopy()]);
  const text = copy.pages.cause;
  if (!cause) return { title: text.notFoundTitle, robots: { index: false } };
  return pageMetadata({
    title: fill(text.metaTitle, { cause: cause.title, tagline: cause.tagline.toLowerCase() }),
    description: clampDescription(cause.summary),
    path: ROUTES.cause(cause.slug),
    identity,
    image: cause.image,
  });
}

/** A static frame; the cause (it depends on the URL) renders inside <Suspense>. See the camp page. */
export default function CausePage({ params }: PageProps<"/causes/[slug]">) {
  return (
    <Suspense fallback={<div aria-hidden className="on-ink min-h-[28rem] sm:min-h-[34rem] lg:min-h-[40rem]" />}>
      <CauseContent params={params} />
    </Suspense>
  );
}

/**
 * One cause: what it is, its camps (coming up, then the register), and a way
 * to give to it. The other causes sit at the foot of the page.
 */
async function CauseContent({ params }: { params: PageProps<"/causes/[slug]">["params"] }) {
  const { slug } = await params;
  const [cause, causes, timeline, settings, copy] = await Promise.all([
    getCause(slug),
    getCauses(),
    getEventTimeline(),
    getSiteSettings(),
    getCopy(),
  ]);
  if (!cause) notFound();

  const text = copy.pages.cause;
  const upcoming = timeline.upcoming.filter((e) => e.cause?.slug === cause.slug);
  const past = timeline.past.filter((e) => e.cause?.slug === cause.slug);
  const firstYear = past.at(-1)?.startDate.slice(0, 4);
  const others = causes.filter((c) => c.slug !== cause.slug);
  const crumbs = [
    { label: copy.labels.common.home, href: ROUTES.home },
    { label: copy.pages.causes.breadcrumb, href: ROUTES.causes },
    { label: cause.title },
  ];

  return (
    <>
      <section aria-labelledby="cause-title" className="on-ink relative isolate overflow-hidden">
        <Image
          src={cause.image.src}
          alt={cause.image.alt}
          fill
          preload
          quality={80}
          sizes="100vw"
          className="-z-10 object-cover"
          style={focalStyle(cause.image)}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/75 to-ink/40" />
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-8 lg:pb-20">
          <Breadcrumbs tone="dark" items={crumbs} label={copy.labels.accessibility.breadcrumb} />
          <div className="mt-16 max-w-2xl sm:mt-24 lg:mt-32">
            <p className="eyebrow text-marigold">{cause.tagline}</p>
            <h1 id="cause-title" className="mt-3 text-5xl leading-none font-semibold text-white sm:text-7xl">
              {cause.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-200 sm:text-lg">{cause.summary}</p>
            <p className="mt-5 font-semibold text-white">
              {plural(past.length, text.campCount)}
              {firstYear ? fill(text.since, { year: firstYear }) : null}
              {upcoming.length > 0 ? fill(text.comingUp, { n: upcoming.length }) : null}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={donateHref(settings.donateUrl, { cause: cause.slug })} variant="marigold" size="lg">
                <HeartHandshake aria-hidden />
                {fill(text.give, { cause: cause.title.toLowerCase() })}
              </ButtonLink>
              {past.length > 0 ? (
                <ButtonLink href="#camps" variant="outline-light" size="lg">
                  {text.seeCamps}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <UpcomingCamps events={upcoming} settings={settings} copy={copy} />

      {past.length > 0 ? (
        <section id="camps" aria-labelledby="camps-title" className="scroll-mt-20 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 id="camps-title" className="text-3xl font-semibold sm:text-4xl">
              {fill(text.campsTitle, { cause: cause.title })}
            </h2>
            <RegisterList events={past} className="mt-6" />
          </div>
        </section>
      ) : null}

      {others.length > 0 ? (
        <nav aria-label={text.othersLabel} className="defer-render bg-paper-2">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">{text.othersTitle}</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={ROUTES.cause(c.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-shadow hover:shadow-[0_24px_44px_-30px_rgb(23_25_59/0.45)]"
                  >
                    <span className="relative block aspect-[16/9] bg-paper-2">
                      <Image
                        src={c.image.src}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        quality={75}
                        className="object-cover"
                        style={focalStyle(c.image)}
                      />
                    </span>
                    <span className="flex flex-1 items-center justify-between gap-3 p-5">
                      <span>
                        <span className="block font-display text-xl font-semibold text-ink group-hover:text-crimson">
                          {c.title}
                        </span>
                        <span className="text-sm text-ink-muted">{c.tagline}</span>
                      </span>
                      <ArrowRight aria-hidden className="size-5 shrink-0 text-crimson" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}

      <JsonLd data={[breadcrumbJsonLd(crumbs, ROUTES.cause(cause.slug)), ...upcoming.map(eventJsonLd)]} />
    </>
  );
}
