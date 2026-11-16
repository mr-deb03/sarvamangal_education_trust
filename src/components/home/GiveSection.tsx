import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { WhenNear } from "@/components/ui/WhenNear";
import type { DonationTier, SiteCopy, SiteSettings } from "@/lib/cms/types";

import { DonationPicker } from "./DonationPicker";

export function GiveSection({
  settings,
  tiers,
  copy,
}: {
  settings: SiteSettings;
  tiers: DonationTier[];
  copy: SiteCopy;
}) {
  const quote = settings.notebookQuote;
  const text = copy.home.give;
  const { common } = copy.labels;

  return (
    <section
      id="donate"
      aria-labelledby="give-title"
      data-donate-zone
      className="defer-render on-ink relative scroll-mt-20 overflow-hidden py-14 sm:py-20 lg:py-28"
    >
      {/* Switches on the Hindi web font (Mukta) only when this section is about to be seen. */}
      <WhenNear />
      {/* The trust's name, "wellbeing for all", as a quiet watermark. Drawn as generated content
          (not text in the page), so it's pure decoration to screen readers and contrast checks. */}
      {text.watermark ? (
        <div
          aria-hidden
          lang="hi"
          data-text={text.watermark}
          className="pointer-events-none absolute -right-10 -bottom-16 hindi-type text-[11rem] leading-none font-bold text-white/[0.035] select-none before:content-[attr(data-text)] sm:text-[15rem] lg:text-[19rem]"
        />
      ) : null}

      {/* Phones: heading → amounts → the notebook line, so the amounts come straight after the
          heading. Desktop: heading and notebook line on the left, amounts on the right. */}
      <div className="relative mx-auto grid max-w-7xl items-start gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-12 lg:gap-x-10 lg:px-8">
        <div className="lg:col-span-5 lg:row-start-1 lg:pt-4">
          <SectionIntro id="give-title" eyebrow={text.eyebrow} title={text.title} tone="dark">
            {text.intro}
          </SectionIntro>
        </div>

        <Reveal className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <DonationPicker
            tiers={tiers}
            donateUrl={settings.donateUrl}
            text={{
              legend: text.pickerLegend,
              anyAmount: text.anyAmount,
              donateAmount: common.donateAmount,
              donateNow: common.donateNow,
              taxNote: text.taxNote,
            }}
          />
        </Reveal>

        <div className="lg:col-span-5 lg:row-start-2">
          <figure className="border-l-2 border-marigold pl-5">
            <blockquote lang="hi" className="hindi-type text-[1.7rem] leading-snug text-white sm:text-3xl">
              {quote.text}
            </blockquote>
            <p className="mt-3 text-lg leading-snug text-marigold">“{quote.translation}”</p>
            <figcaption className="mt-2 text-sm text-ink-200">{quote.note}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
