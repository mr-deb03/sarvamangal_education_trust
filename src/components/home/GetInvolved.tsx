import { ArrowRight, Building2, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { SiteCopy, SiteSettings } from "@/lib/cms/types";
import { isExternal, linkOrWhatsapp, whatsappHref } from "@/lib/utils";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function GetInvolved({ settings, copy }: { settings: SiteSettings; copy: SiteCopy }) {
  const text = copy.home.involved;
  const { volunteer, csr, notify } = text;
  // Until /volunteer and /csr exist, these open WhatsApp with a ready message; set a link in /admin when they ship.
  const volunteerHref = linkOrWhatsapp(volunteer.link, settings.whatsappNumber, volunteer.whatsappMessage);
  const csrHref = linkOrWhatsapp(csr.link, settings.whatsappNumber, csr.whatsappMessage);
  const notifyHref = whatsappHref(settings.whatsappNumber, copy.labels.messages.notifyNextCamp);
  const VolunteerLink = isExternal(volunteerHref) ? "a" : Link;

  return (
    <section aria-labelledby="involved-title" className="defer-render bg-paper-2 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro id="involved-title" eyebrow={text.eyebrow} title={text.title}>
          {text.intro}
        </SectionIntro>

        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 lg:mt-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <VolunteerLink
              href={volunteerHref}
              {...(isExternal(volunteerHref) ? external : {})}
              className="group relative isolate flex h-full min-h-[20rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-5 text-white sm:min-h-[24rem] sm:p-8"
            >
              <Image
                src={volunteer.image.src}
                alt={volunteer.image.alt}
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="-z-10 object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
              />
              <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/55 to-ink/0" />
              <p className="eyebrow text-marigold">{volunteer.eyebrow}</p>
              <h3 className="mt-1 max-w-md text-3xl font-semibold text-white sm:text-4xl">{volunteer.title}</h3>
              <p className="mt-3 max-w-md text-white/85">{volunteer.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-white">
                {volunteer.cta}
                <ArrowRight aria-hidden className="size-5 transition-transform motion-safe:group-hover:translate-x-1" />
              </span>
            </VolunteerLink>
          </Reveal>

          <Reveal className="flex flex-col rounded-[1.75rem] bg-white p-5 ring-1 ring-line sm:p-8 lg:col-span-5">
            <Building2 aria-hidden className="size-7 text-crimson sm:size-8" strokeWidth={1.6} />
            <h3 className="mt-3 text-[1.4rem] font-semibold sm:mt-4 sm:text-2xl">{csr.title}</h3>
            <p className="mt-2 flex-1 text-ink-muted">{csr.text}</p>
            <ButtonLink
              href={csrHref}
              variant="secondary"
              className="mt-6 self-start"
              {...(isExternal(csrHref) ? external : {})}
            >
              {csr.cta}
              <ArrowRight aria-hidden />
            </ButtonLink>
          </Reveal>

          <Reveal className="flex flex-col rounded-[1.75rem] bg-white p-5 ring-1 ring-line sm:p-8 lg:col-span-5">
            <MessageCircle aria-hidden className="size-7 text-crimson sm:size-8" strokeWidth={1.6} />
            <h3 className="mt-3 text-[1.4rem] font-semibold sm:mt-4 sm:text-2xl">{notify.title}</h3>
            <p className="mt-2 flex-1 text-ink-muted">{notify.text}</p>
            <ButtonLink href={notifyHref} variant="secondary" className="mt-6 self-start" {...external}>
              {notify.cta}
              <ArrowRight aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
