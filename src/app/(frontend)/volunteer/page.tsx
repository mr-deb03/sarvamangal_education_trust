import { ArrowRight, HeartPulse, NotebookPen, Sprout } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { UpcomingCamps } from "@/components/events/UpcomingCamps";
import { VolunteerForm } from "@/components/forms/EnquiryForms";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCopy, getEvent, getEventTimeline, getSiteSettings } from "@/lib/cms";
import { fill, formatBeneficiaries, formatDate, formatPlace } from "@/lib/format";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [{ identity }, copy] = await Promise.all([getSiteSettings(), getCopy()]);
  const text = copy.pages.volunteer;
  return pageMetadata({
    title: text.metaTitle,
    description: fill(text.metaDescription, { siteName: identity.siteName }),
    path: ROUTES.volunteer,
    identity,
  });
}

/** One icon per role, in order; extra roles added in /admin reuse them. */
const ROLE_ICONS = [HeartPulse, NotebookPen, Sprout];

/**
 * Signs volunteers up: what they'd do, then the old site's volunteer form
 * (saved to /admin → Inbox), then the camps they could help at.
 * Text: Website text → Page text → Volunteer page, and → Forms.
 */
export default async function VolunteerPage() {
  const [settings, timeline, copy] = await Promise.all([getSiteSettings(), getEventTimeline(), getCopy()]);
  const text = copy.pages.volunteer;
  const training = text.trainingCamp.trim() ? await getEvent(text.trainingCamp.trim()) : undefined;
  const crumbs = [{ label: copy.labels.common.home, href: ROUTES.home }, { label: text.breadcrumb }];

  return (
    <>
      <PageHeader
        id="volunteer-title"
        crumbs={crumbs}
        breadcrumbLabel={copy.labels.accessibility.breadcrumb}
        eyebrow={text.eyebrow}
        title={text.title}
        intro={text.intro}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10 lg:px-8 lg:py-16">
        <section aria-labelledby="roles-title" className="lg:col-span-5">
          <figure className="relative hidden aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-paper-2 sm:block">
            <Image
              src={text.image.src}
              alt={text.image.alt}
              fill
              sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </figure>
          <h2 id="roles-title" className="text-2xl font-semibold sm:mt-8 sm:text-3xl">
            {text.rolesTitle}
          </h2>
          <ul className="mt-5 space-y-5">
            {text.roles.map((role, i) => {
              const Icon = ROLE_ICONS[i % ROLE_ICONS.length]!;
              return (
                <li key={`${role.title}-${i}`} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-crimson/[0.08] text-crimson">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-sans text-[1.05rem] font-semibold text-ink">{role.title}</h3>
                    <p className="mt-0.5 text-ink-muted">{role.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section
          id="volunteer-form"
          aria-labelledby="form-title"
          className="scroll-mt-24 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1"
        >
          <h2 id="form-title" className="text-[1.75rem] font-semibold sm:text-4xl">
            {text.formTitle}
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">{text.formIntro}</p>
          <div className="mt-6">
            <VolunteerForm
              whatsappNumber={settings.whatsappNumber}
              text={{ ...copy.forms, privacyLinkText: copy.policies.privacy.linkText }}
            />
          </div>
        </section>

        <div className="space-y-8 lg:col-span-5">
          <section aria-labelledby="next-title" className="rounded-[1.5rem] bg-paper-2 p-6 sm:p-8">
            <h2 id="next-title" className="text-2xl font-semibold">
              {text.stepsTitle}
            </h2>
            <ol className="mt-5 space-y-4">
              {text.steps.map((step, i) => (
                <li key={`${step}-${i}`} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-crimson text-sm font-semibold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-ink-soft">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {training ? (
            <Link
              href={ROUTES.event(training.slug)}
              className="group block rounded-[1.5rem] p-6 ring-1 ring-line transition-colors hover:bg-paper-2 sm:p-8"
            >
              <p className="eyebrow text-crimson">{text.trainingEyebrow}</p>
              <p className="mt-2 font-display text-xl leading-snug text-ink group-hover:text-crimson">{training.title}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {[formatDate(training.startDate), formatPlace(training), training.beneficiaries ? formatBeneficiaries(training.beneficiaries) : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {training.summary ? <p className="mt-3 text-ink-soft">{training.summary}</p> : null}
              <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-crimson">
                {text.trainingCta}
                <ArrowRight aria-hidden className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Camps they could help at, while any are scheduled. */}
      <UpcomingCamps events={timeline.upcoming} settings={settings} copy={copy} />

      <JsonLd data={[breadcrumbJsonLd(crumbs, ROUTES.volunteer)]} />
    </>
  );
}
