import type { Metadata } from "next";

import { CauseGrid } from "@/components/causes/CauseGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCauses, getCopy, getEventTimeline, getSiteSettings } from "@/lib/cms";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [{ identity }, copy] = await Promise.all([getSiteSettings(), getCopy()]);
  const text = copy.pages.causes;
  return pageMetadata({ title: text.metaTitle, description: text.metaDescription, path: ROUTES.causes, identity });
}

export default async function CausesPage() {
  const [causes, timeline, settings, copy] = await Promise.all([
    getCauses(),
    getEventTimeline(),
    getSiteSettings(),
    getCopy(),
  ]);
  // The page header is the homepage's causes intro, so the two always say the same.
  const intro = copy.home.causes;
  const crumbs = [{ label: copy.labels.common.home, href: ROUTES.home }, { label: copy.pages.causes.breadcrumb }];

  return (
    <>
      <section aria-labelledby="causes-page-title" className="on-ink">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-14 lg:px-8">
          <Breadcrumbs tone="dark" items={crumbs} label={copy.labels.accessibility.breadcrumb} />
          <p className="eyebrow mt-6 text-marigold">{intro.eyebrow}</p>
          <h1 id="causes-page-title" className="mt-3 max-w-3xl text-[2.4rem] leading-[1.05] font-semibold text-white sm:text-6xl">
            {intro.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">{intro.intro}</p>
        </div>
      </section>

      <CauseGrid causes={causes} countByCause={timeline.countByCause} copy={copy} showIntro={false} />

      <FinalCta settings={settings} timeline={timeline} copy={copy} />

      <JsonLd data={[breadcrumbJsonLd(crumbs, ROUTES.causes)]} />
    </>
  );
}
