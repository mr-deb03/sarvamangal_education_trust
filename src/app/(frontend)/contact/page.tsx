import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/forms/EnquiryForms";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { getSiteSettings } from "@/lib/cms";
import { formatAddress, formatDate, officeMapHref } from "@/lib/format";
import { breadcrumbJsonLd, ORG_ID, pageMetadata } from "@/lib/seo";
import { ROUTES, SITE_NAME, SITE_URL } from "@/lib/site";
import { telHref, whatsappHref } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Contact us",
  description:
    "Call, WhatsApp or write to Sarvamangal Education Trust in Bhandup West, Mumbai — about a camp, a donation receipt, volunteering or CSR.",
  path: ROUTES.contact,
});

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

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const { contact, legal } = settings;

  return (
    <>
      <PageHeader
        id="contact-title"
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Contact" }]}
        eyebrow="Contact us"
        title="Talk to us"
        intro="A question about a camp, a donation receipt, volunteering or a CSR partnership? Call, send a WhatsApp message or write to us."
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-16">
        {/* The visiting card: every way to reach the trust. */}
        <aside aria-labelledby="reach-title" className="lg:col-span-5">
          <div className="on-ink rounded-[1.75rem] p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 id="reach-title" className="text-2xl font-semibold text-white">
              {SITE_NAME}
            </h2>
            <ul className="mt-6">
              <Way icon={<Phone aria-hidden className="size-5" />} label="Call">
                <a href={telHref(contact.phone)} className={linkClass}>
                  {contact.phone}
                </a>
              </Way>
              <Way icon={<MessageCircle aria-hidden className="size-5" />} label="WhatsApp">
                <a
                  href={whatsappHref(settings.whatsappNumber, "Namaste! I have a question for Sarvamangal Education Trust.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Send us a message
                  <ArrowUpRight aria-hidden className="size-5 text-marigold" />
                </a>
              </Way>
              <Way icon={<Mail aria-hidden className="size-5" />} label="Email">
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {/* On a narrow card the address wraps after the "@", not mid-word. */}
                  <span>
                    {contact.email.split("@")[0]}@<wbr />
                    {contact.email.split("@")[1]}
                  </span>
                </a>
              </Way>
              <Way icon={<MapPin aria-hidden className="size-5" />} label="Office">
                <address className="leading-relaxed not-italic">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  {contact.locality}, {contact.city} {contact.postalCode}
                </address>
                <a
                  href={officeMapHref(contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Directions to ${formatAddress(contact)} (opens Google Maps)`}
                  className="mt-1 inline-flex min-h-11 items-center gap-1.5 font-semibold text-marigold hover:underline"
                >
                  Get directions
                  <ArrowUpRight aria-hidden className="size-4" />
                </a>
              </Way>
            </ul>

            {settings.socials.length > 0 ? <SocialLinks socials={settings.socials} className="mt-2" /> : null}

            <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-6 text-sm">
              <div>
                <dt className="text-ink-200">Registration</dt>
                <dd className="font-semibold text-white">{legal.registrationNo}</dd>
              </div>
              <div>
                <dt className="text-ink-200">PAN</dt>
                <dd className="font-semibold text-white">{legal.pan}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-ink-200">80G</dt>
                <dd className="font-semibold text-white">
                  {legal.eightyGNo} <span className="font-normal text-ink-200">· {formatDate(legal.eightyGDate)}</span>
                </dd>
              </div>
            </dl>
          </div>
        </aside>

        <section aria-labelledby="message-title" className="lg:col-span-7">
          <h2 id="message-title" className="text-[1.75rem] font-semibold sm:text-4xl">
            Send us a message
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            Leave a phone number or an email and we’ll get back to you. For a donation receipt, include the date and
            amount of your gift.
          </p>
          <div className="mt-6">
            <ContactForm whatsappNumber={settings.whatsappNumber} />
          </div>
        </section>
      </div>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: `Contact ${SITE_NAME}`,
            url: `${SITE_URL}${ROUTES.contact}`,
            about: { "@id": ORG_ID },
          },
          breadcrumbJsonLd([
            { name: "Home", path: ROUTES.home },
            { name: "Contact", path: ROUTES.contact },
          ]),
        ]}
      />
    </>
  );
}
