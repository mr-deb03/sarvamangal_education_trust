import { Causes } from "@/components/home/Causes";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCauses, getEventTimeline, getSiteSettings } from "@/lib/cms";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Our causes: health, education, society and spirituality",
  description:
    "The four kinds of free camps Sarvamangal Education Trust runs in Maharashtra: health, education, cleaner neighbourhoods and spirituality.",
  path: ROUTES.causes,
});

export default async function CausesPage() {
  const [causes, timeline, settings] = await Promise.all([getCauses(), getEventTimeline(), getSiteSettings()]);

  return (
    <>
      <section aria-labelledby="causes-page-title" className="on-ink">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-14 lg:px-8">
          <Breadcrumbs tone="dark" items={[{ label: "Home", href: ROUTES.home }, { label: "Our causes" }]} />
          <p className="eyebrow mt-6 text-marigold">Our causes</p>
          <h1 id="causes-page-title" className="mt-3 max-w-3xl text-[2.4rem] leading-[1.05] font-semibold text-white sm:text-6xl">
            Four ways we show up
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">
            One trust, one team of volunteers, four kinds of care. Start with the one closest to your heart.
          </p>
        </div>
      </section>

      <Causes causes={causes} countByCause={timeline.countByCause} showIntro={false} />

      <FinalCta donateUrl={settings.donateUrl} timeline={timeline} />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: ROUTES.home },
            { name: "Our causes", path: ROUTES.causes },
          ]),
        ]}
      />
    </>
  );
}
