import { ArrowRight } from "lucide-react";

import { Causes } from "@/components/home/Causes";
import { FinalCta } from "@/components/home/FinalCta";
import { Voices } from "@/components/home/Voices";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrustFacts } from "@/components/ui/TrustFacts";
import { getCauses, getEventTimeline, getSiteSettings, getSupporters, getTestimonials } from "@/lib/cms";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { FOUNDING_YEAR, ROUTES, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About us",
  description:
    "Sarvamangal Education Trust is a Mumbai public charitable trust, set up in 2015, running free camps for health, education, society and spirituality.",
  path: ROUTES.about,
});

/**
 * Who the trust is: the name and what it stands for (the page's signature — the
 * Devanagari name, large), the numbers, the four causes, the registration details
 * donors check, and the supporters.
 */
export default async function AboutPage() {
  const [settings, causes, timeline, testimonials, supporters] = await Promise.all([
    getSiteSettings(),
    getCauses(),
    getEventTimeline(),
    getTestimonials(),
    getSupporters(),
  ]);

  return (
    <>
      <PageHeader
        id="about-title"
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "About us" }]}
        eyebrow="About us"
        title={`Wellbeing for all, since ${FOUNDING_YEAR}`}
        intro={`${SITE_NAME} is a Mumbai public charitable trust committed to lasting, positive change in the lives of the people most in need.`}
        image={{
          src: "/images/sarvamangal-free-health-checkup-camp-bhandup.jpg",
          alt: "Doctors see patients under the Sarvamangal Education Trust banner at a free health check-up camp in Bhandup West",
          width: 1280,
          height: 853,
          caption: "Free health check-up camp with Nidan Clinic, Bhandup West, 8 June 2025",
        }}
      />

      <section aria-labelledby="believe-title" className="py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-5">
            <p lang="hi" className="font-display text-[4.5rem] leading-none text-crimson sm:text-[6.5rem]">
              सर्वमंगल
            </p>
            <p className="mt-4 font-display text-2xl text-ink sm:text-3xl">
              <span lang="hi-Latn">Sarvamangal</span> means “wellbeing for all”.
            </p>
          </div>

          <div className="max-w-2xl lg:col-span-7">
            <p className="eyebrow text-crimson">What we believe</p>
            <h2 id="believe-title" className="mt-3 text-[2rem] font-semibold tracking-[-0.015em] sm:text-5xl">
              Compassion, equity and opportunity
            </h2>
            <div className="mt-5 space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              <p>
                We were set up in {FOUNDING_YEAR} with that vision, and we work across communities to support
                education, healthcare, society and spiritual growth. Our volunteers run free health camps, blood
                drives, notebook distributions, coding classes and career seminars across Maharashtra.
              </p>
              <blockquote className="border-l-[3px] border-crimson pl-5 font-display text-[1.4rem] leading-snug text-ink sm:text-2xl">
                We believe in the power of synergy — where every act of kindness turns into a chain reaction of
                positivity.
              </blockquote>
              <p>
                Everything we run is free for the people who come. It is paid for by our donors and supporters, and
                run by our volunteers.
              </p>
            </div>
          </div>
        </div>

        {settings.impactStats.length > 0 ? (
          <div className="mx-auto mt-14 max-w-7xl px-4 sm:mt-20 sm:px-6 lg:px-8">
            <h2 className="sr-only">Our work in numbers</h2>
            <dl className="grid gap-px overflow-hidden rounded-[1.5rem] bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
              {settings.impactStats.map((s) => (
                // Label first for screen readers, number first on screen.
                <div key={s.label} className="flex flex-col-reverse justify-end bg-paper-2 p-6 sm:p-8">
                  <dt className="mt-2 text-ink-soft">{s.label}</dt>
                  <dd className="font-display text-5xl text-crimson tabular-nums">{s.value}</dd>
                </div>
              ))}
              <div className="flex flex-col-reverse justify-end bg-paper-2 p-6 sm:p-8">
                <dt className="mt-2 text-ink-soft">camps you can read about in our online register</dt>
                <dd className="font-display text-5xl text-crimson tabular-nums">{timeline.total}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>

      <Causes causes={causes} countByCause={timeline.countByCause} />

      <section aria-labelledby="accountable-title" className="defer-render py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-crimson">Registered and accountable</p>
            <h2 id="accountable-title" className="mt-3 text-[2rem] font-semibold tracking-[-0.015em] sm:text-5xl">
              A registered trust, on the record
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              We are a registered public charitable trust. Every donation gets a receipt with our registration and 80G
              details, sent by email. Our camps are written up in a public register — when, where and who they
              served — and donors can ask us for a report on how their gifts were used.
            </p>
            <TrustFacts legal={settings.legal} className="mt-8" />
            <ButtonLink href={ROUTES.events} variant="secondary" className="mt-8">
              See the camp register
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="border-t border-line">
        <Voices testimonials={testimonials} supporters={supporters} />
      </div>

      <FinalCta donateUrl={settings.donateUrl} timeline={timeline} />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: ROUTES.home },
            { name: "About us", path: ROUTES.about },
          ]),
        ]}
      />
    </>
  );
}
