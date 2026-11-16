import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSiteSettings } from "@/lib/cms";
import { formatAddress } from "@/lib/format";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES, SITE_NAME, SITE_URL } from "@/lib/site";
import { telHref } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Terms & conditions",
  description:
    "The terms for using the Sarvamangal Education Trust website and donating online: payments, receipts, who can donate and how donations are used.",
  path: ROUTES.terms,
});

/**
 * The trust's terms, carried over from the old site (Nov 2025). Changed Nov 2026:
 * no separate refund page (owner's call) and donations only from Indian citizens
 * living in India (owner's rule).
 */
export default async function TermsPage() {
  const { contact } = await getSiteSettings();
  const domain = SITE_URL.replace(/^https?:\/\//, "");

  const sections: LegalSection[] = [
    {
      id: "about-us",
      title: "About us",
      content: (
        <>
          <p>
            {SITE_NAME} is a registered public charitable trust working for education, health, social welfare and
            spiritual causes, for the good of the public.
          </p>
          <p>Registered address: {formatAddress(contact)}, India.</p>
        </>
      ),
    },
    {
      id: "use-of-our-website",
      title: "Use of our website",
      content: (
        <>
          <p>You agree to use the website only for legitimate, non-commercial purposes and to support charitable work.</p>
          <p>You must not:</p>
          <ul>
            <li>access or misuse the website’s features without permission</li>
            <li>publish harmful or misleading information</li>
            <li>try to disrupt the website’s security or operation</li>
          </ul>
        </>
      ),
    },
    {
      id: "donations-and-payments",
      title: "Donations & payments",
      content: (
        <ul>
          <li>
            <strong>Who can donate:</strong> we accept online donations only from Indian citizens living in India. We
            can’t accept donations from NRIs or from outside India.
          </li>
          <li>All online donations are processed securely through the Easebuzz payment gateway.</li>
          <li>Receipts, including 80G certificates where applicable, are issued once we have valid donor details.</li>
          <li>
            Donations are final and non-refundable, except for duplicate transactions or technical errors (subject to
            verification).
          </li>
        </ul>
      ),
    },
    {
      id: "use-of-donations",
      title: "Use of donations",
      content: (
        <>
          <p>Funds are used strictly for charitable purposes in line with our mission, including:</p>
          <ul>
            <li>child education and tuition support</li>
            <li>notebook and stationery distribution</li>
            <li>career development programmes</li>
            <li>health camps and public welfare activities</li>
          </ul>
          <p>We may share transparency reports with donors on request or in our official updates.</p>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      content: (
        <>
          <p>
            All content on this website — logos, text, graphics and images — belongs to {SITE_NAME} unless stated
            otherwise. You must not:
          </p>
          <ul>
            <li>republish the website’s content without permission</li>
            <li>use the trust’s name or logo for personal or commercial purposes</li>
          </ul>
        </>
      ),
    },
    {
      id: "third-party-links",
      title: "Third-party links",
      content: (
        <p>
          Our website links to outside services for donations, analytics and information. We are not responsible
          for the content or practices of other websites.
        </p>
      ),
    },
    {
      id: "data-protection",
      title: "Data protection & privacy",
      content: (
        <p>
          When you use our website or donate online, we may collect and use your personal data as described in our{" "}
          <Link href={ROUTES.privacy}>privacy policy</Link>. By continuing to use this website, you agree to it.
        </p>
      ),
    },
    {
      id: "liability",
      title: "Liability & disclaimer",
      content: (
        <>
          <p>We work to keep the website accurate and secure, but:</p>
          <ul>
            <li>we do not guarantee that it will always be available</li>
            <li>we are not liable for losses caused by technical failures, internet problems or unauthorised access</li>
          </ul>
          <p>All services are provided “as is” and “as available”.</p>
        </>
      ),
    },
    {
      id: "your-responsibility",
      title: "Your responsibility",
      content: (
        <>
          <p>Please make sure the details you give us are accurate, especially for:</p>
          <ul>
            <li>donation receipts</li>
            <li>tax documents</li>
            <li>contacting you</li>
          </ul>
          <p>If information turns out to be false, we may be unable to provide a receipt or service.</p>
        </>
      ),
    },
    {
      id: "changes",
      title: "Changes to these terms",
      content: (
        <p>
          We may change these terms at any time. Changes will be posted on this page with the date they were made.
          Using {domain} after a change means you accept the updated terms.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      content: (
        <p>
          For questions, concerns or feedback, email <a href={`mailto:${contact.email}`}>{contact.email}</a> or call{" "}
          <a href={telHref(contact.phone)}>{contact.phone}</a>.
        </p>
      ),
    },
    {
      id: "our-commitment",
      title: "Our commitment",
      content: (
        <p>
          Thank you for supporting our work with children and communities through education, health and social
          care. Your trust and your gifts help build a better tomorrow.
        </p>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        id="terms-title"
        tone="light"
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Terms & conditions" }]}
        eyebrow="Policies"
        title="Terms & conditions"
        intro={`These terms cover your use of ${domain} and taking part in our charitable work, including donating online. By using the website, you agree to them.`}
      />
      <LegalDocument sections={sections} updated="November 2026" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: ROUTES.home },
            { name: "Terms & conditions", path: ROUTES.terms },
          ]),
        ]}
      />
    </>
  );
}
