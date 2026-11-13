"use client";

import { CircleCheck, HeartHandshake, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { buttonClasses } from "@/components/ui/ButtonLink";
import type { DonationTier } from "@/lib/cms/types";
import { formatINR } from "@/lib/format";
import { cn, donateHref } from "@/lib/utils";

/**
 * Amount picker. The choice only shapes the outgoing link — payment happens
 * on the donation app. Defaults to the second tier, the usual anchor.
 */
export function DonationPicker({ tiers, donateUrl }: { tiers: DonationTier[]; donateUrl: string }) {
  const [selectedId, setSelectedId] = useState(tiers[1]?.id ?? tiers[0]?.id);
  const selected = tiers.find((t) => t.id === selectedId);
  const href = donateHref(donateUrl, { amount: selected?.amount, cause: selected?.causeSlug });

  return (
    <div className="rounded-[1.75rem] bg-white p-5 text-ink-soft shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)] [--focus-ring:var(--color-crimson)] sm:p-8">
      {tiers.length > 0 ? (
        <fieldset>
          <legend className="font-display text-2xl font-semibold text-ink">Pick an amount</legend>
          {/* Phones: a compact 2 × 2 grid (amount + title); the chosen amount's outcome shows below. */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
            {tiers.map((tier) => {
              const checked = tier.id === selectedId;
              return (
                <label
                  key={tier.id}
                  className={cn(
                    "relative flex cursor-pointer flex-col rounded-2xl border-2 p-3.5 transition-colors duration-200 sm:min-h-[8.5rem] sm:p-5",
                    "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-crimson",
                    checked ? "border-crimson bg-crimson/[0.04]" : "border-line hover:border-ink/30",
                  )}
                >
                  <input
                    type="radio"
                    name="donation-tier"
                    value={tier.id}
                    checked={checked}
                    onChange={() => setSelectedId(tier.id)}
                    className="sr-only"
                  />
                  <span className="font-display text-[1.55rem] leading-none font-semibold text-ink sm:text-[1.9rem]">
                    {tier.amount ? formatINR(tier.amount) : "Any amount"}
                  </span>
                  <span className="mt-1.5 text-[0.92rem] leading-snug font-semibold text-ink sm:mt-2 sm:text-base">
                    {tier.title}
                  </span>
                  <span className="mt-1 hidden text-sm leading-snug text-ink-muted sm:block">{tier.outcome}</span>
                  {checked ? (
                    <CircleCheck aria-hidden className="absolute top-3 right-3 size-4 text-crimson sm:top-4 sm:right-4 sm:size-5" />
                  ) : null}
                </label>
              );
            })}
          </div>
          {selected ? (
            <p aria-live="polite" className="mt-3 text-sm leading-snug text-ink-muted sm:hidden">
              {selected.outcome}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <a href={href} className={cn(buttonClasses("primary", "lg"), "mt-6 w-full")}>
        <HeartHandshake aria-hidden />
        {selected?.amount ? `Donate ${formatINR(selected.amount)}` : "Donate now"}
      </a>
      <p className="mt-4 flex items-start gap-2 text-sm leading-snug text-ink-muted">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-crimson" />
        <span>
          Eligible for 80G tax deduction. You’ll finish on our secure donation page and get a receipt by email.
        </span>
      </p>
    </div>
  );
}
