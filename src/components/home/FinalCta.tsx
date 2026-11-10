import { HeartHandshake } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/site";

export function FinalCta({ donateUrl }: { donateUrl: string }) {
  return (
    <section
      aria-labelledby="final-title"
      className="relative overflow-hidden bg-gradient-to-b from-crimson to-crimson-deep text-white [--focus-ring:white]"
    >
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <p className="eyebrow text-marigold-soft">The next page of the register</p>
        <h2 id="final-title" className="mt-3 text-4xl font-semibold text-white sm:text-6xl">
          The next camp is already being planned.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
          A child’s new notebook. An elder’s long-overdue check-up. It starts with someone deciding to help.
          Help us keep it free.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href={donateUrl} variant="white" size="lg">
            <HeartHandshake aria-hidden />
            Donate now
          </ButtonLink>
          <ButtonLink href={ROUTES.volunteer} variant="outline-light" size="lg">
            Volunteer with us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
