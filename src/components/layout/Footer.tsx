import { Landmark, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { SocialLinks } from "@/components/ui/SocialIcons";
import type { Cause, SiteSettings } from "@/lib/cms/types";
import { formatDate } from "@/lib/format";
import { ROUTES, SITE_NAME } from "@/lib/site";
import { telHref } from "@/lib/utils";

import { HomeLink } from "./HomeLink";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const explore = [
  { label: "About us", href: ROUTES.about },
  { label: "Events", href: ROUTES.events },
  { label: "Blog", href: ROUTES.blog },
  { label: "Volunteer", href: ROUTES.volunteer },
  { label: "CSR partnerships", href: ROUTES.csr },
  { label: "Contact", href: ROUTES.contact },
];

/**
 * How donors can pay on the donation app (Easebuzz checkout), confirmed by the
 * trust, Nov 2026. Logos: UPI and RuPay are the official marks (Wikimedia
 * Commons); Visa (Simple Icons path, Visa blue) and Mastercard (its two
 * circles) in their brand colours. Only list what the checkout really offers.
 */
const paymentMarks = [
  { src: "/brand/payments/upi.svg", alt: "UPI", width: 57, height: 20 },
  { src: "/brand/payments/rupay.svg", alt: "RuPay", width: 61, height: 16 },
  { src: "/brand/payments/visa.svg", alt: "Visa", width: 45, height: 15 },
  { src: "/brand/payments/mastercard.svg", alt: "Mastercard", width: 35, height: 22 },
];

const policies = [
  { label: "Privacy policy", href: ROUTES.privacy },
  { label: "Terms & conditions", href: ROUTES.terms },
];

export function Footer({
  settings,
  causes,
}: {
  settings: SiteSettings;
  causes: Pick<Cause, "slug" | "title">[];
}) {
  const { contact, legal, socials } = settings;

  return (
    <footer className="defer-render on-ink pb-24 text-[0.95rem] md:pb-0">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:gap-y-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-20">
        <div className="col-span-2 lg:col-span-4">
          <HomeLink className="inline-flex items-center gap-3 rounded-md">
            <Image src="/brand/sarvamangal-mark.png" alt="" width={458} height={458} className="size-12" />
            <span className="font-display text-xl leading-tight text-white">
              Sarvamangal
              <span className="block font-sans text-sm font-normal tracking-[0.12em] text-ink-200 uppercase">
                Education Trust
              </span>
            </span>
          </HomeLink>
          <p className="mt-5 max-w-sm leading-relaxed">
            Sarvamangal (<span lang="hi">सर्वमंगल</span>) means “wellbeing for all”. Since 2015 our volunteers
            have run free camps for health, education, society and spirituality across Maharashtra.
          </p>
          <SocialLinks socials={socials} className="mt-6" />
        </div>

        <nav aria-label="Explore" className="lg:col-span-2">
          <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-white uppercase">Explore</h2>
          <ul className="mt-3">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Causes" className="lg:col-span-2">
          <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-white uppercase">Causes</h2>
          <ul className="mt-3">
            {causes.map((c) => (
              <li key={c.slug}>
                <Link
                  href={ROUTES.cause(c.slug)}
                  className="inline-flex min-h-11 items-center hover:text-white hover:underline"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 lg:col-span-4">
          <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-white uppercase">Visit or write</h2>
          <address className="mt-4 space-y-1 not-italic">
            <p className="flex gap-3">
              <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-marigold" />
              <span>
                {contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                {contact.locality}, {contact.city}
                {contact.postalCode ? ` ${contact.postalCode}` : ""}, {contact.state}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone aria-hidden className="size-4 shrink-0 text-marigold" />
              <a href={telHref(contact.phone)} className="inline-flex min-h-11 items-center hover:text-white hover:underline">
                {contact.phone}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Mail aria-hidden className="size-4 shrink-0 text-marigold" />
              <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center break-all hover:text-white hover:underline">
                {contact.email}
              </a>
            </p>
          </address>

          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-white/10 pt-5 text-sm">
            <dt className="text-white">Public trust reg.</dt>
            <dd>{legal.registrationNo}</dd>
            <dt className="text-white">PAN</dt>
            <dd>{legal.pan}</dd>
            <dt className="text-white">80G</dt>
            <dd>
              {legal.eightyGNo} <span className="text-ink-200/80">({formatDate(legal.eightyGDate)})</span>
            </dd>
          </dl>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="flex items-start gap-2.5 text-sm">
            <ShieldCheck aria-hidden className="mt-px size-5 shrink-0 text-marigold" />
            <span>
              <span className="font-semibold text-white">Secure online donations.</span> Payments are processed by
              Easebuzz.
            </span>
          </p>
          <ul aria-label="Ways to pay" className="flex flex-wrap items-center gap-2">
            {paymentMarks.map((mark) => (
              <li key={mark.alt} className="flex h-9 items-center rounded-md bg-white px-3">
                <Image
                  src={mark.src}
                  alt={mark.alt}
                  width={mark.width}
                  height={mark.height}
                  unoptimized
                  sizes={`${mark.width}px`}
                />
              </li>
            ))}
            <li className="flex h-9 items-center gap-1.5 rounded-md bg-white px-3 text-[0.8rem] font-semibold text-ink">
              <Landmark aria-hidden className="size-4" />
              Net banking
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © <CurrentYear /> {SITE_NAME}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6">
            {policies.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="inline-flex min-h-11 items-center hover:text-white hover:underline">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
