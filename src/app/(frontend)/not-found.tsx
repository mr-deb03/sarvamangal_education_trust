import { ArrowLeft, HeartHandshake } from "lucide-react";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCopy, getSiteSettings } from "@/lib/cms";
import { ROUTES } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCopy();
  return { title: copy.pages.notFound.metaTitle, robots: { index: false } };
}

export default async function NotFound() {
  const [settings, copy] = await Promise.all([getSiteSettings(), getCopy()]);
  const text = copy.pages.notFound;

  return (
    <section className="notebook">
      <div className="mx-auto max-w-3xl py-24 pr-6 pl-[calc(var(--margin-w)+1.5rem)] sm:py-32">
        <p className="eyebrow text-crimson">{text.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{text.title}</h1>
        <p className="mt-5 max-w-xl text-lg text-ink-muted">{text.text}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={ROUTES.home} variant="secondary">
            <ArrowLeft aria-hidden />
            {text.home}
          </ButtonLink>
          <ButtonLink href={settings.donateUrl}>
            <HeartHandshake aria-hidden />
            {text.donate}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
