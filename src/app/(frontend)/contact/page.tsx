import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/forms/EnquiryForms";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { getCopy, getSiteSettings } from "@/lib/cms";
import { fill, formatAddress, formatDate, officeMapHref } from "@/lib/format";
import { breadcrumbJsonLd, ORG_ID, pageMetadata } from "@/lib/seo";
import { ROUTES, SITE_URL } from "@/lib/site";
import { telHref, whatsappHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [{ identity }, copy] = await Promise.all([getSiteSettings(), getCopy()]);
  const text = copy.pages.contact;
  return pageMetadata({
    title: text.metaTitle,
    description: fill(text.metaDescription, { siteName: identity.siteName }),
    path: ROUTES.contact,
    identity,
  });
}

/** One way to reach the trust: an icon, what it is, and the link itself. */
function Way({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 border-t border-white/10 py-5 first:border-t-0 first:pt-0">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-marigold">{icon}</span>
      <div className="min-w-0">
        <p className="eyebrow text-ink-200">{label}</p>
        <div className="mt-1 text-white">{children}</div>
      </div>
    </li>
  );
}

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 font-display text-xl text-white underline decoration-white/30 underline-offset-4 [overflow-wrap:anywhere] hover:decoration-marigold";

/**
 * Every way to reach the trust (from Site settings), and a message form that
 * lands in /admin → Inbox. Text: Website text → Page text → Contact page, and → Forms.
 */
export default async function ContactPage() {
  const [settings, copy] = await Promise.all([getSiteSettings(), getCopy()]);
  const { contact, legal, identity } = settings;
  const text = copy.pages.contact;
  const footer = copy.layout.footer;
  const crumbs = [{ label: copy.labels.common.home, href: ROUTES.home }, { label: text.breadcrumb }];
  // On a narrow card the address wraps after the "@", not mid-word.
  const at = contact.email.indexOf("@");
  const emailParts = at > 0 ? [contact.email.slice(0, at + 1), contact.email.slice(at + 1)] : [contact.email];

  return (
    <>
      <PageHeader
        id="contact-title"
        crumbs={crumbs}
        breadcrumbLabel={copy.labels.accessibility.breadcrumb}
        eyebrow={text.eyebrow}
        title={text.title}
        intro={text.intro}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-16">
        {/* The visiting card: every way to reach the trust. */}
        <aside aria-labelledby="reach-title" className="lg:col-span-5">
          <div className="on-ink rounded-[1.75rem] p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 id="reach-title" className="text-2xl font-semibold text-white">
              {identity.siteName}
            </h2>
            <ul className="mt-6">
              <Way icon={<Phone aria-hidden className="size-5" />} label={text.callLabel}>
                <a href={telHref(contact.phone)} className={linkClass}>
                  {contact.phone}
                </a>
              </Way>
              <Way icon={<MessageCircle aria-hidden className="size-5" />} label={text.whatsappLabel}>
                <a
                  href={whatsappHref(settings.whatsappNumber, copy.layout.whatsapp.greeting)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {text.whatsappCta}
                  <ArrowUpRight aria-hidden className="size-5 text-marigold" />
                </a>
              </Way>
              <Way icon={<Mail aria-hidden className="size-5" />} label={text.emailLabel}>
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  <span>
                    {emailParts[0]}
                    {emailParts[1] ? <wbr /> : null}
                    {emailParts[1]}
                  </span>
                </a>
              </Way>
              <Way icon={<MapPin aria-hidden className="size-5" />} label={text.officeLabel}>
                <address className="leading-relaxed not-italic">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  {[contact.locality, [contact.city, contact.postalCode].filter(Boolean).join(" ")].filter(Boolean).join(", ")}
                </address>
                <a
                  href={officeMapHref(contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={fill(text.directionsLabel, { address: formatAddress(contact) })}
                  className="mt-1 inline-flex min-h-11 items-center gap-1.5 font-semibold text-marigold hover:underline"
                >
                  {text.directions}
                  <ArrowUpRight aria-hidden className="size-4" />
                </a>
              </Way>
            </ul>

            {settings.socials.length > 0 ? (
              <SocialLinks
                socials={settings.socials}
                label={copy.labels.accessibility.social}
                shortName={identity.shortName}
                className="mt-2"
              />
            ) : null}

            <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-6 text-sm">
              <div>
                <dt className="text-ink-200">{footer.registrationLabel}</dt>
                <dd className="font-semibold text-white">{legal.registrationNo}</dd>
              </div>
              <div>
                <dt className="text-ink-200">{footer.panLabel}</dt>
                <dd className="font-semibold text-white">{legal.pan}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-ink-200">{footer.eightyGLabel}</dt>
                <dd className="font-semibold text-white">
                  {legal.eightyGNo} <span className="font-normal text-ink-200">· {formatDate(legal.eightyGDate)}</span>
                </dd>
              </div>
            </dl>
          </div>
        </aside>

        <section aria-labelledby="message-title" className="lg:col-span-7">
          <h2 id="message-title" className="text-[1.75rem] font-semibold sm:text-4xl">
            {text.formTitle}
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">{text.formIntro}</p>
          <div className="mt-6">
            <ContactForm
              whatsappNumber={settings.whatsappNumber}
              text={{ ...copy.forms, privacyLinkText: copy.policies.privacy.linkText }}
            />
          </div>
        </section>
      </div>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: fill(text.schemaName, { siteName: identity.siteName }),
            url: `${SITE_URL}${ROUTES.contact}`,
            about: { "@id": ORG_ID },
          },
          breadcrumbJsonLd(crumbs, ROUTES.contact),
        ]}
      />
    </>
  );
}
