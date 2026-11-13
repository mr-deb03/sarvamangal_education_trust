import { Reveal } from "@/components/motion/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { DonationTier, SiteSettings } from "@/lib/cms/types";

import { DonationPicker } from "./DonationPicker";

export function GiveSection({ settings, tiers }: { settings: SiteSettings; tiers: DonationTier[] }) {
  const quote = settings.notebookQuote;

  return (
    <section
      id="donate"
      aria-labelledby="give-title"
      data-donate-zone
      className="defer-render on-ink relative scroll-mt-20 overflow-hidden py-14 sm:py-20 lg:py-28"
    >
      {/* The trust's name, "wellbeing for all", as a quiet watermark. */}
      <p
        aria-hidden
        className="pointer-events-none absolute -right-10 -bottom-16 font-display text-[11rem] leading-none font-bold text-white/[0.035] select-none sm:text-[15rem] lg:text-[19rem]"
        lang="hi"
      >
        सर्वमंगल
      </p>

      {/* Phones: heading → amounts → the notebook line, so the amounts come straight after the
          heading. Desktop: heading and notebook line on the left, amounts on the right. */}
      <div className="relative mx-auto grid max-w-7xl items-start gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-12 lg:gap-x-10 lg:px-8">
        <div className="lg:col-span-5 lg:row-start-1 lg:pt-4">
          <SectionIntro id="give-title" eyebrow="Give" title="Choose what your gift does" tone="dark">
            Every camp is free for the people who come to it. Our volunteers give their time — your gift pays
            for the rest.
          </SectionIntro>
        </div>

        <Reveal className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <DonationPicker tiers={tiers} donateUrl={settings.donateUrl} />
        </Reveal>

        <div className="lg:col-span-5 lg:row-start-2">
          <figure className="border-l-2 border-marigold pl-5">
            <blockquote lang="hi" className="font-display text-[1.7rem] leading-snug font-medium text-white sm:text-3xl">
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
