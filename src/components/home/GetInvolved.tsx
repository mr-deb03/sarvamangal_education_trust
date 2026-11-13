import { ArrowRight, Building2, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { SiteSettings } from "@/lib/cms/types";
import { ROUTES } from "@/lib/site";
import { whatsappHref } from "@/lib/utils";

export function GetInvolved({ settings }: { settings: SiteSettings }) {
  const whatsapp = whatsappHref(
    settings.whatsappNumber,
    "Hi! Please let me know when the next Sarvamangal camp is announced.",
  );

  return (
    <section aria-labelledby="involved-title" className="defer-render bg-paper-2 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro id="involved-title" eyebrow="Get involved" title="Give time, not only money">
          Every camp runs on people. Here are three ways to be one of them.
        </SectionIntro>

        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 lg:mt-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7 lg:row-span-2">
          <Link
            href={ROUTES.volunteer}
            className="group relative isolate flex h-full min-h-[20rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-5 text-white sm:min-h-[24rem] sm:p-8"
          >
            <Image
              src="/images/blood-donation-camp.jpg"
              alt="Smiling donors give blood at a Sarvamangal blood donation camp"
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="-z-10 object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/0" />
            <p className="eyebrow text-marigold">Volunteer</p>
            <h3 className="mt-1 max-w-md text-3xl font-semibold text-white sm:text-4xl">Give a morning to a camp</h3>
            <p className="mt-3 max-w-md text-white/85">
              Register visitors, hand out notebooks, keep the queue moving. Every extra pair of hands means more
              people seen.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-white">
              Become a volunteer
              <ArrowRight aria-hidden className="size-5 transition-transform motion-safe:group-hover:translate-x-1" />
            </span>
          </Link>
          </Reveal>

          <Reveal className="flex flex-col rounded-[1.75rem] bg-white p-5 ring-1 ring-line sm:p-8 lg:col-span-5">
            <Building2 aria-hidden className="size-7 text-crimson sm:size-8" strokeWidth={1.6} />
            <h3 className="mt-3 text-[1.4rem] font-semibold sm:mt-4 sm:text-2xl">Partner with us for CSR</h3>
            <p className="mt-2 flex-1 text-ink-muted">
              Bring a health camp or a notebook drive to the community your company serves. We plan it with your
              team, run it on the ground, and report back with photos and numbers.
            </p>
            <ButtonLink href={ROUTES.csr} variant="secondary" className="mt-6 self-start">
              Talk to us about CSR
              <ArrowRight aria-hidden />
            </ButtonLink>
          </Reveal>

          <Reveal className="flex flex-col rounded-[1.75rem] bg-white p-5 ring-1 ring-line sm:p-8 lg:col-span-5">
            <MessageCircle aria-hidden className="size-7 text-crimson sm:size-8" strokeWidth={1.6} />
            <h3 className="mt-3 text-[1.4rem] font-semibold sm:mt-4 sm:text-2xl">Hear about the next camp</h3>
            <p className="mt-2 flex-1 text-ink-muted">
              Send us a WhatsApp message and we’ll tell you when the next camp near you is announced — to come,
              to help, or to bring someone who needs it.
            </p>
            <ButtonLink
              href={whatsapp}
              variant="secondary"
              className="mt-6 self-start"
              target="_blank"
              rel="noopener noreferrer"
            >
              Message us on WhatsApp
              <ArrowRight aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
