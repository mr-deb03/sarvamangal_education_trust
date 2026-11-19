import { ArrowDown, Phone, Users, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CsrForm } from "@/components/forms/EnquiryForms";
import { Voices } from "@/components/home/Voices";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrustFacts } from "@/components/ui/TrustFacts";
import { getCauses, getCopy, getEventTimeline, getSiteSettings, getSupporters, getTestimonials } from "@/lib/cms";
import { fill, plural } from "@/lib/format";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";
import { telHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [{ identity }, copy] = await Promise.all([getSiteSettings(), getCopy()]);
  const text = copy.pages.csr;
  return pageMetadata({
    title: text.metaTitle,
    description: fill(text.metaDescription, { siteName: identity.siteName }),
    path: ROUTES.csr,
    identity,
  });
}

/**
 * For companies: why partner, the ways to do it (the old site's "Adopt a
 * project" and payroll giving), the registration details CSR teams need, the
 * sponsors' own words, and the old CSR registration form (saved to /admin → Inbox).
 * Text: Website text → Page text → CSR page, and → Forms.
 */
export default async function CsrPage() {
  const [settings, causes, timeline, testimonials, supporters, copy] = await Promise.all([
    getSiteSettings(),
    getCauses(),
    getEventTimeline(),
    getTestimonials(),
    getSupporters(),
    getCopy(),
  ]);
  const text = copy.pages.csr;
  const crumbs = [{ label: copy.labels.common.home, href: ROUTES.home }, { label: text.breadcrumb }];

  return (
    <>
      <PageHeader
        id="csr-title"
        crumbs={crumbs}
        breadcrumbLabel={copy.labels.accessibility.breadcrumb}
        eyebrow={text.eyebrow}
        title={text.title}
        intro={text.intro}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="#csr-form" variant="marigold" size="lg">
            {text.registerCta}
            <ArrowDown aria-hidden />
          </ButtonLink>
          <a
            href={telHref(settings.contact.phone)}
            className="inline-flex min-h-14 items-center gap-2 rounded-full px-5 font-semibold whitespace-nowrap text-white ring-1 ring-white/25 hover:bg-white/10"
          >
            <Phone aria-hidden className="size-5 text-marigold" />
            {fill(text.call, { phone: settings.contact.phone })}
          </a>
        </div>
      </PageHeader>

      <section aria-labelledby="why-title" className="py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-crimson">{text.why.eyebrow}</p>
            <h2 id="why-title" className="mt-3 text-[2rem] font-semibold tracking-[-0.015em] sm:text-5xl">
              {text.why.title}
            </h2>
          </div>
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg lg:col-span-7">
            {text.why.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* The signature: three ways in, with the four causes to adopt. */}
      <section aria-labelledby="ways-title" className="on-ink py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-marigold">{text.ways.eyebrow}</p>
          <h2 id="ways-title" className="mt-3 max-w-2xl text-[2rem] font-semibold tracking-[-0.015em] text-white sm:text-5xl">
            {text.ways.title}
          </h2>

          <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:gap-5">
            <article className="rounded-[1.75rem] bg-white p-6 text-ink sm:p-8 lg:col-span-7 lg:row-span-2">
              <p className="eyebrow text-crimson">{text.ways.adoptEyebrow}</p>
              <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">{text.ways.adoptTitle}</h3>
              <p className="mt-3 text-ink-muted">{text.ways.adoptText}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {causes.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={ROUTES.cause(c.slug)}
                      className="group flex min-h-16 flex-col justify-center rounded-2xl bg-paper-2 px-4 py-3 transition-colors hover:bg-crimson/[0.06]"
                    >
                      <span className="font-display text-lg leading-tight text-ink group-hover:text-crimson">{c.title}</span>
                      <span className="text-sm text-ink-muted">
                        {plural(timeline.countByCause[c.slug] ?? 0, text.ways.adoptCount)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[1.75rem] bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8 lg:col-span-5">
              <Wallet aria-hidden className="size-7 text-marigold" strokeWidth={1.6} />
              <h3 className="mt-3 text-2xl font-semibold text-white">{text.ways.payrollTitle}</h3>
              <p className="mt-2 text-ink-200">{text.ways.payrollText}</p>
            </article>

            <article className="rounded-[1.75rem] bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8 lg:col-span-5">
              <Users aria-hidden className="size-7 text-marigold" strokeWidth={1.6} />
              <h3 className="mt-3 text-2xl font-semibold text-white">{text.ways.teamTitle}</h3>
              <p className="mt-2 text-ink-200">{text.ways.teamText}</p>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="facts-title" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="facts-title" className="text-2xl font-semibold sm:text-3xl">
            {text.facts.title}
          </h2>
          <p className="mt-3 max-w-2xl text-ink-muted">{fill(text.facts.text, { foundingYear: settings.identity.foundingYear })}</p>
          <TrustFacts legal={settings.legal} labels={copy.labels.trust} className="mt-6" />
        </div>
      </section>

      <div className="border-t border-line">
        <Voices testimonials={testimonials} supporters={supporters} copy={copy} />
      </div>

      <section id="csr-form" aria-labelledby="register-title" className="scroll-mt-20 bg-paper-2 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-crimson">{text.form.eyebrow}</p>
            <h2 id="register-title" className="mt-3 text-[2rem] font-semibold tracking-[-0.015em] sm:text-5xl">
              {text.form.title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">{text.form.text}</p>
          </div>
          <div className="lg:col-span-7">
            <CsrForm whatsappNumber={settings.whatsappNumber} text={{ ...copy.forms, privacyLinkText: copy.policies.privacy.linkText }} />
          </div>
        </div>
      </section>

      <JsonLd data={[breadcrumbJsonLd(crumbs, ROUTES.csr)]} />
    </>
  );
}
