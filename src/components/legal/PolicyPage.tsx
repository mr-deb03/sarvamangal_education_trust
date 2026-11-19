import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCopy, getSiteSettings } from "@/lib/cms";
import { fill, formatAddress } from "@/lib/format";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES, SITE_URL } from "@/lib/site";
import { telHref } from "@/lib/utils";

import { LegalDocument } from "./LegalDocument";

type Which = "privacy" | "terms";
const PATH: Record<Which, string> = { privacy: ROUTES.privacy, terms: ROUTES.terms };

export async function policyMetadata(which: Which): Promise<Metadata> {
  const [{ identity }, copy] = await Promise.all([getSiteSettings(), getCopy()]);
  const text = copy.policies[which];
  return pageMetadata({
    title: text.metaTitle,
    description: fill(text.metaDescription, { siteName: identity.siteName }),
    path: PATH[which],
    identity,
  });
}

/**
 * The privacy policy or the terms, from Website text → Policies. Contact details
 * come from Site settings, so a changed phone number updates both pages.
 */
export async function PolicyPage({ which }: { which: Which }) {
  const [settings, copy] = await Promise.all([getSiteSettings(), getCopy()]);
  const { contact, identity } = settings;
  const text = copy.policies[which];
  const { privacy, terms } = copy.policies;
  const domain = SITE_URL.replace(/^https?:\/\//, "");
  const crumbs = [{ label: copy.labels.common.home, href: ROUTES.home }, { label: text.breadcrumb }];
  const vars = {
    siteName: identity.siteName,
    domain,
    address: formatAddress(contact),
    email: <a href={`mailto:${contact.email}`}>{contact.email}</a>,
    phone: <a href={telHref(contact.phone)}>{contact.phone}</a>,
    rightsPhone: <a href={telHref(privacy.rightsPhone)}>{privacy.rightsPhone}</a>,
    privacyLink: <Link href={ROUTES.privacy}>{privacy.linkText}</Link>,
    termsLink: <Link href={ROUTES.terms}>{terms.linkText}</Link>,
  };

  return (
    <>
      <PageHeader
        id={`${which}-title`}
        tone="light"
        crumbs={crumbs}
        breadcrumbLabel={copy.labels.accessibility.breadcrumb}
        eyebrow={text.eyebrow}
        title={text.title}
        intro={fill(text.intro, { siteName: identity.siteName, domain })}
      />
      <LegalDocument sections={text.sections} updated={text.updated} labels={copy.labels.policy} vars={vars} />
      <JsonLd data={[breadcrumbJsonLd(crumbs, PATH[which])]} />
    </>
  );
}
