import type { Metadata } from "next";

import { CauseGrid } from "@/components/causes/CauseGrid";
import { UpcomingCamps } from "@/components/events/UpcomingCamps";
import { Appeal } from "@/components/home/Appeal";
import { CampRegister } from "@/components/home/CampRegister";
import { Faq } from "@/components/home/Faq";
import { GetInvolved } from "@/components/home/GetInvolved";
import { GiveSection } from "@/components/home/GiveSection";
import { Hero } from "@/components/home/Hero";
import { LiveBar } from "@/components/home/LiveBar";
import { Voices } from "@/components/home/Voices";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomePageData, getSiteSettings } from "@/lib/cms";
import { eventJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { identity } = await getSiteSettings();
  return pageMetadata({
    title: identity.homeTitle,
    description: identity.description,
    path: ROUTES.home,
    identity,
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const { settings, causes, timeline, testimonials, supporters, donationTiers, faqs, appeal, liveUpdates, copy } =
    await getHomePageData();

  return (
    <>
      <LiveBar live={liveUpdates} timeline={timeline} copy={copy} />
      <Hero settings={settings} timeline={timeline} tiers={donationTiers} copy={copy} />
      {/* Shown only while a camp is coming up. */}
      <UpcomingCamps events={timeline.upcoming} settings={settings} copy={copy} />
      <CauseGrid causes={causes} countByCause={timeline.countByCause} copy={copy} />
      <CampRegister timeline={timeline} stats={settings.impactStats} whatsappNumber={settings.whatsappNumber} copy={copy} />
      {/* Shown only while the trust has a live appeal switched on in /admin. */}
      {appeal ? (
        <Appeal appeal={appeal} donateUrl={settings.donateUrl} siteName={settings.identity.siteName} copy={copy} />
      ) : null}
      <GiveSection settings={settings} tiers={donationTiers} copy={copy} />
      <Voices testimonials={testimonials} supporters={supporters} copy={copy} />
      <GetInvolved settings={settings} copy={copy} />
      <Faq faqs={faqs} email={settings.contact.email} copy={copy} />
      <FinalCta settings={settings} timeline={timeline} copy={copy} />

      <JsonLd data={[...(faqs.length > 0 ? [faqJsonLd(faqs)] : []), ...timeline.upcoming.map(eventJsonLd)]} />
    </>
  );
}
