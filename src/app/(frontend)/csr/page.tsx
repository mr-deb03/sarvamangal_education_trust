import { ArrowDown, Phone, Users, Wallet } from "lucide-react";
import Link from "next/link";

import { CsrForm } from "@/components/forms/EnquiryForms";
import { Voices } from "@/components/home/Voices";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrustFacts } from "@/components/ui/TrustFacts";
import { getCauses, getEventTimeline, getSiteSettings, getSupporters, getTestimonials } from "@/lib/cms";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";
import { telHref } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "CSR partnerships",
  description:
    "Partner with Sarvamangal Education Trust for CSR: adopt a health camp or notebook drive in Mumbai, set up payroll giving, or bring your team to volunteer.",
  path: ROUTES.csr,
});

/**
 * For companies: why partner, the ways to do it (the old site's "Adopt a
 * project" and payroll giving), the registration details CSR teams need, the
 * sponsors' own words, and the old CSR registration form (saved to /admin → Inbox).
 */
export default async function CsrPage() {
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
        id="csr-title"
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "CSR partnerships" }]}
        eyebrow="CSR partnerships"
        title="Partner with us for CSR"
        intro="Bring a health camp or a notebook drive to the community your company serves. We plan it with your team, run it on the ground, and report back with photos and numbers."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="#csr-form" variant="marigold" size="lg">
            Register your interest
            <ArrowDown aria-hidden />
          </ButtonLink>
          <a
            href={telHref(settings.contact.phone)}
            className="inline-flex min-h-14 items-center gap-2 rounded-full px-5 font-semibold whitespace-nowrap text-white ring-1 ring-white/25 hover:bg-white/10"
          >
            <Phone aria-hidden className="size-5 text-marigold" />
            Call {settings.contact.phone}
          </a>
        </div>
      </PageHeader>

      <section aria-labelledby="why-title" className="py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-crimson">Why partner with an NGO</p>
            <h2 id="why-title" className="mt-3 text-[2rem] font-semibold tracking-[-0.015em] sm:text-5xl">
              Your reach, our groundwork
            </h2>
          </div>
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg lg:col-span-7">
            <p>
              More and more companies in India are building CSR into the way they work. Partnerships between
              companies and non-profits help both sides: companies gain from an NGO’s groundwork and knowledge of the
              community, and NGOs gain steady funding and support — so social problems can be tackled together, at
              scale.
            </p>
            <p>
              Done well, CSR also strengthens how people see your brand, helps you attract investment and good people,
              and builds engagement among your staff and loyalty among your customers.
            </p>
          </div>
        </div>
      </section>

      {/* The signature: three ways in, with the four causes to adopt. */}
      <section aria-labelledby="ways-title" className="on-ink py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-marigold">Ways to partner with us</p>
          <h2 id="ways-title" className="mt-3 max-w-2xl text-[2rem] font-semibold tracking-[-0.015em] text-white sm:text-5xl">
            Pick what matters to your company
          </h2>

          <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:gap-5">
            <article className="rounded-[1.75rem] bg-white p-6 text-ink sm:p-8 lg:col-span-7 lg:row-span-2">
              <p className="eyebrow text-crimson">Adopt a project</p>
              <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">Fund a whole camp, or part of one</h3>
              <p className="mt-3 text-ink-muted">
                Support an entire project or just a portion of it, in the area you care about. Our work spans issues
                and places, so you can pick what is important to you.
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {causes.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={ROUTES.cause(c.slug)}
                      className="group flex min-h-16 flex-col justify-center rounded-2xl bg-paper-2 px-4 py-3 transition-colors hover:bg-crimson/[0.06]"
                    >
                      <span className="font-display text-lg leading-tight text-ink group-hover:text-crimson">{c.title}</span>
                      <span className="text-sm text-ink-muted">
                        {timeline.countByCause[c.slug] ?? 0} camps in the register
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[1.75rem] bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8 lg:col-span-5">
              <Wallet aria-hidden className="size-7 text-marigold" strokeWidth={1.6} />
              <h3 className="mt-3 text-2xl font-semibold text-white">Payroll giving</h3>
              <p className="mt-2 text-ink-200">
                Your employees give a set amount from their monthly salary — a simple way for them to feel connected
                to the cause your company has taken on.
              </p>
            </article>

            <article className="rounded-[1.75rem] bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8 lg:col-span-5">
              <Users aria-hidden className="size-7 text-marigold" strokeWidth={1.6} />
              <h3 className="mt-3 text-2xl font-semibold text-white">Bring your team</h3>
              <p className="mt-2 text-ink-200">
                CSR is a great way to get your staff involved too: they can volunteer at the camp your company funds.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="facts-title" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="facts-title" className="text-2xl font-semibold sm:text-3xl">
            For your CSR team
          </h2>
          <p className="mt-3 max-w-2xl text-ink-muted">
            A registered public charitable trust in Mumbai, working since 2015. If your process needs other
            documents, ask us.
          </p>
          <TrustFacts legal={settings.legal} className="mt-6" />
        </div>
      </section>

      <div className="border-t border-line">
        <Voices testimonials={testimonials} supporters={supporters} />
      </div>

      <section id="csr-form" aria-labelledby="register-title" className="scroll-mt-20 bg-paper-2 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-crimson">CSR registration</p>
            <h2 id="register-title" className="mt-3 text-[2rem] font-semibold tracking-[-0.015em] sm:text-5xl">
              Let’s plan it together
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
              Leave your details and someone from the trust will get in touch to talk it through.
            </p>
          </div>
          <div className="lg:col-span-7">
            <CsrForm whatsappNumber={settings.whatsappNumber} />
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: ROUTES.home },
            { name: "CSR partnerships", path: ROUTES.csr },
          ]),
        ]}
      />
    </>
  );
}
