import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { CauseGrid } from "@/components/causes/CauseGrid";
import { Voices } from "@/components/home/Voices";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LangText } from "@/components/ui/LangText";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrustFacts } from "@/components/ui/TrustFacts";
import { getCauses, getCopy, getEventTimeline, getSiteSettings, getSupporters, getTestimonials } from "@/lib/cms";
import { fill } from "@/lib/format";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [{ identity }, copy] = await Promise.all([getSiteSettings(), getCopy()]);
  const text = copy.pages.about;
  return pageMetadata({
    title: text.metaTitle,
    description: fill(text.metaDescription, { siteName: identity.siteName, foundingYear: identity.foundingYear }),
    path: ROUTES.about,
    identity,
  });
}

/**
 * Who the trust is: the name and what it stands for (the page's signature — the
 * Devanagari name, large), the numbers, the four causes, the registration details
 * donors check, and the supporters. Text: Website text → Page text → About page.
 */
export default async function AboutPage() {
  const [settings, causes, timeline, testimonials, supporters, copy] = await Promise.all([
    getSiteSettings(),
    getCauses(),
    getEventTimeline(),
    getTestimonials(),
    getSupporters(),
    getCopy(),
  ]);
  const text = copy.pages.about;
  const vars = { siteName: settings.identity.siteName, foundingYear: settings.identity.foundingYear };
  const crumbs = [{ label: copy.labels.common.home, href: ROUTES.home }, { label: text.breadcrumb }];

  return (
    <>
      <PageHeader
        id="about-title"
        crumbs={crumbs}
        breadcrumbLabel={copy.labels.accessibility.breadcrumb}
        eyebrow={text.eyebrow}
        title={fill(text.title, vars)}
        intro={fill(text.intro, vars)}
        image={{ ...text.image, caption: text.imageCaption }}
      />

      <section aria-labelledby="believe-title" className="py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-5">
            <p lang="hi" className="font-display text-[4.5rem] leading-none text-crimson sm:text-[6.5rem]">
              {text.name.hindi}
            </p>
            <p className="mt-4 font-display text-2xl text-ink sm:text-3xl">
              <LangText text={text.name.meaning} />
            </p>
          </div>

          <div className="max-w-2xl lg:col-span-7">
            <p className="eyebrow text-crimson">{text.believe.eyebrow}</p>
            <h2 id="believe-title" className="mt-3 text-[2rem] font-semibold tracking-[-0.015em] sm:text-5xl">
              {text.believe.title}
            </h2>
            <div className="mt-5 space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              <p>{fill(text.believe.text, vars)}</p>
              <blockquote className="border-l-[3px] border-crimson pl-5 font-display text-[1.4rem] leading-snug text-ink sm:text-2xl">
                {text.believe.quote}
              </blockquote>
              <p>{text.believe.closing}</p>
            </div>
          </div>
        </div>

        {settings.impactStats.length > 0 ? (
          <div className="mx-auto mt-14 max-w-7xl px-4 sm:mt-20 sm:px-6 lg:px-8">
            <h2 className="sr-only">{text.numbers.title}</h2>
            <dl className="grid gap-px overflow-hidden rounded-[1.5rem] bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
              {settings.impactStats.map((s) => (
                // Label first for screen readers, number first on screen.
                <div key={s.label} className="flex flex-col-reverse justify-end bg-paper-2 p-6 sm:p-8">
                  <dt className="mt-2 text-ink-soft">{s.label}</dt>
                  <dd className="font-display text-5xl text-crimson tabular-nums">{s.value}</dd>
                </div>
              ))}
              <div className="flex flex-col-reverse justify-end bg-paper-2 p-6 sm:p-8">
                <dt className="mt-2 text-ink-soft">{text.numbers.registerStat}</dt>
                <dd className="font-display text-5xl text-crimson tabular-nums">{timeline.total}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>

      <CauseGrid causes={causes} countByCause={timeline.countByCause} copy={copy} />

      <section aria-labelledby="accountable-title" className="defer-render py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-crimson">{text.accountable.eyebrow}</p>
            <h2 id="accountable-title" className="mt-3 text-[2rem] font-semibold tracking-[-0.015em] sm:text-5xl">
              {text.accountable.title}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">{text.accountable.text}</p>
            <TrustFacts legal={settings.legal} labels={copy.labels.trust} className="mt-8" />
            <ButtonLink href={ROUTES.events} variant="secondary" className="mt-8">
              {text.accountable.cta}
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="border-t border-line">
        <Voices testimonials={testimonials} supporters={supporters} copy={copy} />
      </div>

      <FinalCta settings={settings} timeline={timeline} copy={copy} />

      <JsonLd data={[breadcrumbJsonLd(crumbs, ROUTES.about)]} />
    </>
  );
}
