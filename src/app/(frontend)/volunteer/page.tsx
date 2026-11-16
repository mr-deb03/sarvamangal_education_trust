import { ArrowRight, HeartPulse, NotebookPen, Sprout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { VolunteerForm } from "@/components/forms/EnquiryForms";
import { UpcomingCamps } from "@/components/home/UpcomingCamps";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { getEvent, getEventTimeline, getSiteSettings } from "@/lib/cms";
import { formatBeneficiaries, formatDate, formatPlace } from "@/lib/format";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Volunteer with us in Mumbai",
  description:
    "Give a morning to a free health camp, notebook drive or clean-up in Mumbai. Fill in the volunteer form and Sarvamangal Education Trust will call you.",
  path: ROUTES.volunteer,
});

const roles = [
  {
    icon: HeartPulse,
    title: "At health camps and blood drives",
    text: "Register visitors and keep the queue moving, so the doctors can see more people.",
  },
  {
    icon: NotebookPen,
    title: "At notebook drives",
    text: "Hand out notebooks and stationery to the children who come.",
  },
  {
    icon: Sprout,
    title: "On days of service",
    text: "Clean-ups, tree planting and yoga days in the neighbourhood.",
  },
];

const steps = [
  "Send us the form. It takes a few minutes.",
  "Someone from the trust calls you about the camps coming up.",
  "You join a camp near you.",
];

/**
 * Signs volunteers up: what they'd do, then the old site's volunteer form
 * (saved to /admin → Inbox), then the camps they could help at.
 */
export default async function VolunteerPage() {
  const [settings, timeline, prarambh] = await Promise.all([
    getSiteSettings(),
    getEventTimeline(),
    getEvent("prarambh-2"),
  ]);

  return (
    <>
      <PageHeader
        id="volunteer-title"
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Volunteer" }]}
        eyebrow="Volunteer"
        title="Give a morning to a camp"
        intro="Society united, progress amplified. Every camp we run needs people — every extra pair of hands means more people seen."
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10 lg:px-8 lg:py-16">
        <section aria-labelledby="roles-title" className="lg:col-span-5">
          <figure className="relative hidden aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-paper-2 sm:block">
            <Image
              src="/images/world-environment-day-volunteers.jpg"
              alt="Young volunteers wearing Sarvamangal lanyards collect waste from shops on World Environment Day"
              fill
              sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </figure>
          <h2 id="roles-title" className="text-2xl font-semibold sm:mt-8 sm:text-3xl">
            What volunteers do
          </h2>
          <ul className="mt-5 space-y-5">
            {roles.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-crimson/[0.08] text-crimson">
                  <Icon aria-hidden className="size-5" />
                </span>
                <div>
                  <h3 className="font-sans text-[1.05rem] font-semibold text-ink">{title}</h3>
                  <p className="mt-0.5 text-ink-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="volunteer-form"
          aria-labelledby="form-title"
          className="scroll-mt-24 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1"
        >
          <h2 id="form-title" className="text-[1.75rem] font-semibold sm:text-4xl">
            Volunteer form
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            Tell us a little about yourself. What you study or do for a living helps us find the right role for you at a
            camp.
          </p>
          <div className="mt-6">
            <VolunteerForm whatsappNumber={settings.whatsappNumber} />
          </div>
        </section>

        <div className="space-y-8 lg:col-span-5">
          <section aria-labelledby="next-title" className="rounded-[1.5rem] bg-paper-2 p-6 sm:p-8">
            <h2 id="next-title" className="text-2xl font-semibold">
              What happens next
            </h2>
            <ol className="mt-5 space-y-4">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-crimson text-sm font-semibold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-ink-soft">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {prarambh ? (
            <Link
              href={ROUTES.event(prarambh.slug)}
              className="group block rounded-[1.5rem] p-6 ring-1 ring-line transition-colors hover:bg-paper-2 sm:p-8"
            >
              <p className="eyebrow text-crimson">Trained together</p>
              <p className="mt-2 font-display text-xl leading-snug text-ink group-hover:text-crimson">{prarambh.title}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {formatDate(prarambh.startDate)}
                {formatPlace(prarambh) ? ` · ${formatPlace(prarambh)}` : ""}
                {prarambh.beneficiaries ? ` · ${formatBeneficiaries(prarambh.beneficiaries)}` : ""}
              </p>
              {prarambh.summary ? <p className="mt-3 text-ink-soft">{prarambh.summary}</p> : null}
              <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-crimson">
                Read about the camp
                <ArrowRight aria-hidden className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Camps they could help at, while any are scheduled. */}
      <UpcomingCamps events={timeline.upcoming} settings={settings} />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: ROUTES.home },
            { name: "Volunteer", path: ROUTES.volunteer },
          ]),
        ]}
      />
    </>
  );
}
