import { ArrowLeft, HeartHandshake } from "lucide-react";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { getSiteSettings } from "@/lib/cms";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <section className="notebook">
      <div className="mx-auto max-w-3xl py-24 pr-6 pl-[calc(var(--margin-w)+1.5rem)] sm:py-32">
        <p className="eyebrow text-crimson">Page not found</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">We couldn’t find that page.</h1>
        <p className="mt-5 max-w-xl text-lg text-ink-muted">
          It may have moved when we rebuilt the website, or it is still being written. Start from the home page,
          or support the next camp while you are here.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={ROUTES.home} variant="secondary">
            <ArrowLeft aria-hidden />
            Back to home
          </ButtonLink>
          <ButtonLink href={settings.donateUrl}>
            <HeartHandshake aria-hidden />
            Donate now
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
