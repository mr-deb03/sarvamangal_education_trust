import { Landmark, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { LangText } from "@/components/ui/LangText";
import { SocialLinks } from "@/components/ui/SocialIcons";
import type { Cause, NavLink, SiteCopy, SiteSettings } from "@/lib/cms/types";
import { fill, formatDate } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { telHref } from "@/lib/utils";

import { HomeLink } from "./HomeLink";

/** The copyright line, with this year filled in (read inside a cache scope, refreshed daily). */
async function Copyright({ template, siteName }: { template: string; siteName: string }) {
  "use cache";
  cacheLife("days");
  return <>{fill(template, { year: new Date().getFullYear(), siteName })}</>;
}

/**
 * How donors can pay on the donation app (Easebuzz checkout), confirmed by the
 * trust, Nov 2026. Logos: UPI and RuPay are the official marks (Wikimedia
 * Commons); Visa (Simple Icons path, Visa blue) and Mastercard (its two
 * circles) in their brand colours. Kept in code: only list what the checkout
 * really offers — change it with the Easebuzz account, not from /admin.
 */
const paymentMarks = [
  { src: "/brand/payments/upi.svg", alt: "UPI", width: 57, height: 20 },
  { src: "/brand/payments/rupay.svg", alt: "RuPay", width: 61, height: 16 },
  { src: "/brand/payments/visa.svg", alt: "Visa", width: 45, height: 15 },
  { src: "/brand/payments/mastercard.svg", alt: "Mastercard", width: 35, height: 22 },
];

const linkClass = "inline-flex min-h-11 items-center hover:text-white hover:underline";
const headingClass = "font-sans text-sm font-semibold tracking-[0.12em] text-white uppercase";

function LinkList({ links }: { links: NavLink[] }) {
  return (
    <ul className="mt-3">
      {links.map((l, i) => (
        <li key={`${l.href}-${i}`}>
          <Link href={l.href} className={linkClass}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer({
  settings,
  causes,
  copy,
}: {
  settings: SiteSettings;
  causes: Pick<Cause, "slug" | "title">[];
  copy: SiteCopy;
}) {
  const { contact, legal, socials, identity } = settings;
  const { footer } = copy.layout;
  const a11y = copy.labels.accessibility;

  return (
    <footer className="on-ink pb-24 text-[0.95rem] md:pb-0">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:gap-y-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-20">
        <div className="col-span-2 lg:col-span-4">
          <HomeLink
            className="inline-flex items-center gap-3 rounded-md"
            aria-label={fill(a11y.homeLink, { siteName: identity.siteName })}
          >
            <Image
              src={identity.mark.src}
              alt=""
              width={identity.mark.width ?? 458}
              height={identity.mark.height ?? 458}
              sizes="48px"
              className="size-12"
            />
            <span aria-hidden className="font-display text-xl leading-tight text-white">
              {footer.wordmarkTop}
              <span className="block font-sans text-sm font-normal tracking-[0.12em] text-ink-200 uppercase">
                {footer.wordmarkBottom}
              </span>
            </span>
          </HomeLink>
          <p className="mt-5 max-w-sm leading-relaxed">
            <LangText text={fill(footer.about, { foundingYear: identity.foundingYear })} />
          </p>
          <SocialLinks socials={socials} label={a11y.social} shortName={identity.shortName} className="mt-6" />
        </div>

        {footer.exploreLinks.length > 0 ? (
          <nav aria-label={a11y.explore} className="lg:col-span-2">
            <h2 className={headingClass}>{footer.exploreHeading}</h2>
            <LinkList links={footer.exploreLinks} />
          </nav>
        ) : null}

        <nav aria-label={a11y.footerCauses} className="lg:col-span-2">
          <h2 className={headingClass}>{footer.causesHeading}</h2>
          <LinkList links={causes.map((c) => ({ label: c.title, href: ROUTES.cause(c.slug) }))} />
        </nav>

        <div id="contact" className="col-span-2 scroll-mt-24 lg:col-span-4">
          <h2 className={headingClass}>{footer.contactHeading}</h2>
          <address className="mt-4 space-y-1 not-italic">
            <p className="flex gap-3">
              <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-marigold" />
              <span>
                {contact.addressLines.map((line, i) => (
                  <span key={`${line}-${i}`} className="block">
                    {line}
                  </span>
                ))}
                {[`${contact.locality}, ${contact.city}${contact.postalCode ? ` ${contact.postalCode}` : ""}`, contact.state].join(", ")}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone aria-hidden className="size-4 shrink-0 text-marigold" />
              <a href={telHref(contact.phone)} className={linkClass}>
                {contact.phone}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Mail aria-hidden className="size-4 shrink-0 text-marigold" />
              <a href={`mailto:${contact.email}`} className={`${linkClass} break-all`}>
                {contact.email}
              </a>
            </p>
          </address>

          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-white/10 pt-5 text-sm">
            <dt className="text-white">{footer.registrationLabel}</dt>
            <dd>{legal.registrationNo}</dd>
            <dt className="text-white">{footer.panLabel}</dt>
            <dd>{legal.pan}</dd>
            <dt className="text-white">{footer.eightyGLabel}</dt>
            <dd>
              {legal.eightyGNo} <span className="text-ink-200">({formatDate(legal.eightyGDate)})</span>
            </dd>
          </dl>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="flex items-start gap-2.5 text-sm">
            <ShieldCheck aria-hidden className="mt-px size-5 shrink-0 text-marigold" />
            <span>
              <span className="font-semibold text-white">{footer.secureLead}</span> {footer.secureText}
            </span>
          </p>
          <ul aria-label={a11y.waysToPay} className="flex flex-wrap items-center gap-2">
            {paymentMarks.map((mark) => (
              <li key={mark.alt} className="flex h-9 items-center rounded-md bg-white px-3">
                <Image src={mark.src} alt={mark.alt} width={mark.width} height={mark.height} unoptimized />
              </li>
            ))}
            <li className="flex h-9 items-center gap-1.5 rounded-md bg-white px-3 text-[0.8rem] font-semibold text-ink">
              <Landmark aria-hidden className="size-4" />
              {footer.netBanking}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            <Copyright template={footer.copyright} siteName={identity.siteName} />
          </p>
          {footer.policyLinks.length > 0 ? (
            <ul className="flex flex-wrap gap-x-6">
              {footer.policyLinks.map((p, i) => (
                <li key={`${p.href}-${i}`}>
                  <Link href={p.href} className={linkClass}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
