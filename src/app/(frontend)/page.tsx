import { Appeal } from "@/components/home/Appeal";
import { CampRegister } from "@/components/home/CampRegister";
import { Causes } from "@/components/home/Causes";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { GetInvolved } from "@/components/home/GetInvolved";
import { GiveSection } from "@/components/home/GiveSection";
import { Hero } from "@/components/home/Hero";
import { Voices } from "@/components/home/Voices";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomePageData } from "@/lib/cms";
import { eventJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE_NAME} — Mumbai NGO for health & education`,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const { settings, causes, timeline, testimonials, supporters, donationTiers, faqs, appeal } =
    await getHomePageData();

  return (
    <>
      <Hero settings={settings} latest={timeline.past[0]} />
      <Causes causes={causes} countByCause={timeline.countByCause} />
      <CampRegister timeline={timeline} stats={settings.impactStats} whatsappNumber={settings.whatsappNumber} />
      {/* Shown only while the trust has a live appeal switched on in /admin. */}
      {appeal ? <Appeal appeal={appeal} donateUrl={settings.donateUrl} /> : null}
      <GiveSection settings={settings} tiers={donationTiers} />
      <Voices testimonials={testimonials} supporters={supporters} />
      <GetInvolved settings={settings} />
      <Faq faqs={faqs} email={settings.contact.email} />
      <FinalCta donateUrl={settings.donateUrl} />

      <JsonLd
        data={[
          ...(faqs.length > 0 ? [faqJsonLd(faqs)] : []),
          ...timeline.upcoming.map(eventJsonLd),
        ]}
      />
    </>
  );
}
