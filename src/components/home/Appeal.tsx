import { CalendarClock, HeartHandshake, MessageCircle, Users } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Fill } from "@/components/ui/Fill";
import { Reveal } from "@/components/ui/Reveal";
import { Rupees } from "@/components/ui/Rupees";
import type { AppealView, SiteCopy } from "@/lib/cms/types";
import { fill, formatINR, plural } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { cn, donateHref, focalStyle } from "@/lib/utils";

/**
 * The current appeal (Payload global "fundraising-appeal"). With a goal: a
 * progress bar. Without one: the running total ("1,500+ pouches distributed so
 * far"). Rendered only when the trust has switched an appeal on.
 */
export function Appeal({
  appeal,
  donateUrl,
  siteName,
  copy,
}: {
  appeal: AppealView;
  donateUrl: string;
  siteName: string;
  copy: SiteCopy;
}) {
  const text = copy.home.appeal;
  const isMoney = appeal.measure === "money";
  const plus = appeal.atLeast ? "+" : "";
  /** On the page (₹ drawn in Mukta) and as plain text (aria, share). */
  const amount = (n: number): ReactNode => (isMoney ? <Rupees amount={n} /> : n.toLocaleString("en-IN"));
  const amountText = (n: number) => (isMoney ? formatINR(n) : n.toLocaleString("en-IN"));
  const counted = isMoney ? text.raised : (appeal.itemLabel ?? "");
  const { goal, percent } = appeal;
  const reached = goal !== undefined && appeal.soFar >= goal;
  const shareText = `${fill(copy.labels.messages.shareAppeal, { title: appeal.title, siteName })} ${SITE_URL}/#appeal`;

  return (
    <section id="appeal" aria-labelledby="appeal-title" className="scroll-mt-20 bg-paper-2 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_70px_-45px_rgb(23_25_59/0.45)] ring-1 ring-line lg:grid-cols-12">
          {appeal.image ? (
            <div className="relative aspect-[16/10] bg-paper-2 lg:col-span-5 lg:aspect-auto lg:min-h-[26rem]">
              <Image
                src={appeal.image.src}
                alt={appeal.image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                style={focalStyle(appeal.image)}
              />
            </div>
          ) : null}

          <div className={cn("flex flex-col justify-center p-6 sm:p-10", appeal.image ? "lg:col-span-7" : "lg:col-span-12")}>
            <p className="eyebrow text-crimson">{text.eyebrow}</p>
            <h2 id="appeal-title" className="mt-3 text-[2rem] font-semibold tracking-[-0.01em] sm:text-4xl">
              {appeal.title}
            </h2>
            {appeal.description ? (
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">{appeal.description}</p>
            ) : null}

            <div className="mt-8">
              {goal !== undefined && percent !== undefined ? (
                <>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-[2.2rem] leading-none font-semibold text-ink lining-nums tabular-nums sm:text-[2.4rem]">
                      {amount(appeal.soFar)}
                      {plus}
                    </p>
                    <p className="font-display text-2xl leading-none font-semibold text-crimson lining-nums tabular-nums">
                      {percent}%
                    </p>
                  </div>
                  <p className="mt-1.5 text-ink-muted">
                    <Fill template={text.towardsGoal} vars={{ counted, goal: amount(goal) }} />
                  </p>

                  <div
                    role="progressbar"
                    aria-label={text.progressLabel}
                    aria-valuemin={0}
                    aria-valuemax={goal}
                    aria-valuenow={Math.min(appeal.soFar, goal)}
                    aria-valuetext={`${amountText(appeal.soFar)}${plus} ${fill(text.towardsGoal, { counted, goal: amountText(goal) })}`}
                    className="mt-3 h-3 overflow-hidden rounded-full bg-paper-2 ring-1 ring-line ring-inset"
                  >
                    <div className="appeal-fill h-full rounded-full bg-crimson" style={{ width: `${percent}%` }} />
                  </div>
                </>
              ) : (
                // No limit: the running total, ruled off with the notebook's crimson margin line.
                <div className="border-l-[3px] border-crimson pl-5">
                  <p className="font-display text-[2.75rem] leading-none font-semibold text-ink lining-nums tabular-nums sm:text-[3.25rem]">
                    {amount(appeal.soFar)}
                    {plus}
                  </p>
                  <p className="mt-2 text-lg text-ink-muted">{fill(text.soFar, { counted })}</p>
                </div>
              )}

              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted empty:hidden">
                {reached ? <li className="font-semibold text-crimson">{text.goalReached}</li> : null}
                {appeal.donors ? (
                  <li className="flex items-center gap-1.5">
                    <Users aria-hidden className="size-4 text-crimson" />
                    {plural(appeal.donors, text.donors)}
                  </li>
                ) : null}
                {appeal.daysLeft !== undefined ? (
                  <li className="flex items-center gap-1.5">
                    <CalendarClock aria-hidden className="size-4 text-crimson" />
                    {appeal.daysLeft <= 0 ? text.lastDay : plural(appeal.daysLeft, text.daysLeft)}
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={donateHref(donateUrl, { cause: appeal.cause?.slug })} size="lg">
                <HeartHandshake aria-hidden />
                {text.donate}
              </ButtonLink>
              <ButtonLink
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                variant="secondary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden />
                {text.share}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
