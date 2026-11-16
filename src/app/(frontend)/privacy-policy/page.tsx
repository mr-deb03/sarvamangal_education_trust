import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSiteSettings } from "@/lib/cms";
import { formatAddress } from "@/lib/format";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES, SITE_NAME } from "@/lib/site";
import { telHref } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "How Sarvamangal Education Trust collects, uses and protects the details of donors, volunteers and visitors, under India's IT Act and DPDP Act 2023.",
  path: ROUTES.privacy,
});

/** The trust's privacy policy, carried over from the old site (Nov 2025) and updated for the new forms. */
export default async function PrivacyPolicyPage() {
  const { contact } = await getSiteSettings();
  // The old policy gives this second number for privacy requests. CONFIRM with the trust.
  const rightsPhone = "+91 97022 46277";

  const sections: LegalSection[] = [
    {
      id: "information-we-collect",
      title: "Information we collect",
      content: (
        <>
          <p>We may collect the following when you use our website or support our work:</p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Residential or postal address and PIN code</li>
            <li>PAN or Aadhaar number (for donations and statutory compliance)</li>
            <li>Payment and transaction details</li>
            <li>
              For volunteers: date of birth, occupation, education and profession, and who referred you (from the
              volunteer form)
            </li>
            <li>For companies: your company’s name and address (from the CSR form)</li>
            <li>Browser and device information collected automatically through Google Analytics</li>
          </ul>
          <p>We do not store any biometric or financial card information.</p>
        </>
      ),
    },
    {
      id: "how-we-use-your-data",
      title: "How we use your data",
      content: (
        <>
          <p>We use your information only for lawful, charitable purposes:</p>
          <ul>
            <li>Processing donations and issuing receipts, including 80G certificates</li>
            <li>Replying to volunteer sign-ups, CSR enquiries and messages sent through our forms</li>
            <li>Contacting donors and volunteers about our camps and their impact</li>
            <li>Sharing updates and newsletters about our work</li>
            <li>Accounting, legal compliance and donor verification</li>
            <li>Improving the website’s performance and your experience of it</li>
          </ul>
          <p>We do not sell, trade or share your personal data for commercial purposes.</p>
        </>
      ),
    },
    {
      id: "third-party-services",
      title: "Third-party services",
      content: (
        <>
          <p>We share information only with trusted service providers, and only what they need:</p>
          <ul>
            <li>
              <strong>Easebuzz</strong> — to process secure online donations
            </li>
            <li>
              <strong>Google Analytics</strong> — to understand and improve how the website performs
            </li>
          </ul>
          <p>These services follow their own privacy and security standards.</p>
        </>
      ),
    },
    {
      id: "legal-compliance",
      title: "Legal compliance",
      content: (
        <>
          <p>We comply with:</p>
          <ul>
            <li>the Information Technology Act, 2000 (India)</li>
            <li>the Digital Personal Data Protection Act (DPDP), 2023</li>
          </ul>
          <p>Documents donors submit for tax benefits are kept strictly for legal requirements, in secure records.</p>
        </>
      ),
    },
    {
      id: "data-security",
      title: "Data security",
      content: (
        <>
          <p>We take administrative, digital and physical measures to protect your information from:</p>
          <ul>
            <li>unauthorised access</li>
            <li>alteration</li>
            <li>disclosure</li>
            <li>misuse or loss</li>
          </ul>
          <p>All payments are encrypted by the Easebuzz payment gateway.</p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "Your rights",
      content: (
        <>
          <p>You have the right to:</p>
          <ul>
            <li>ask us to correct information that is wrong or out of date</li>
            <li>ask how your data is used</li>
          </ul>
          <p>
            Write to us at <a href={`mailto:${contact.email}`}>{contact.email}</a> or call{" "}
            <a href={telHref(rightsPhone)}>{rightsPhone}</a>. For your safety, we may need to verify your identity
            before acting on a request.
          </p>
        </>
      ),
    },
    {
      id: "data-retention",
      title: "Data retention",
      content: (
        <>
          <p>We keep personal data only as long as it is:</p>
          <ul>
            <li>required by law (including Income Tax Department compliance), or</li>
            <li>needed for our charitable work and record-keeping.</li>
          </ul>
          <p>Data we no longer need is securely archived or deleted.</p>
        </>
      ),
    },
    {
      id: "external-links",
      title: "External links",
      content: (
        <p>
          Our website links to other platforms, such as our donation page, WhatsApp and social media. We are not
          responsible for the privacy practices of external websites.
        </p>
      ),
    },
    {
      id: "consent",
      title: "Consent",
      content: (
        <p>
          By using our website or sending us your information, you agree to this privacy policy. Please also read
          our <Link href={ROUTES.terms}>terms &amp; conditions</Link>.
        </p>
      ),
    },
    {
      id: "updates",
      title: "Updates to this policy",
      content: (
        <p>
          We may update this policy from time to time to comply with the law and stay transparent. Changes will be
          posted on this page with the date they were made.
        </p>
      ),
    },
    {
      id: "grievances",
      title: "Contact and grievances",
      content: (
        <>
          <p>For questions or concerns about your privacy, contact:</p>
          <address className="not-italic">
            <strong>{SITE_NAME}</strong>
            <br />
            {formatAddress(contact)}, India
            <br />
            Phone: <a href={telHref(contact.phone)}>{contact.phone}</a>
            <br />
            Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </address>
        </>
      ),
    },
    {
      id: "our-commitment",
      title: "Our commitment",
      content: (
        <p>
          We value every donor and supporter who believes in our work. Your trust lets us keep serving children,
          young people and communities through education, health and social care.
        </p>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        id="privacy-title"
        tone="light"
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Privacy policy" }]}
        eyebrow="Policies"
        title="Privacy policy"
        intro={`${SITE_NAME} is committed to protecting the privacy of donors, volunteers, beneficiaries and visitors. This policy explains how we collect, use, store and protect your personal information.`}
      />
      <LegalDocument sections={sections} updated="November 2026" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: ROUTES.home },
            { name: "Privacy policy", path: ROUTES.privacy },
          ]),
        ]}
      />
    </>
  );
}
