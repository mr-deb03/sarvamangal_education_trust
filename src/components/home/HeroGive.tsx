"use client";

import { HeartHandshake } from "lucide-react";
import { useState } from "react";

import { buttonClasses } from "@/components/ui/ButtonLink";
import type { DonationTier } from "@/lib/cms/types";
import { formatINR } from "@/lib/format";
import { cn, donateHref } from "@/lib/utils";

/**
 * The giving box on the hero card: amount chips and the Donate link — a
 * general gift, not tied to one cause (the Give section further down explains
 * what each amount does). Payment happens on the donation app; the choice only
 * shapes the link. Defaults to the second tier, the usual anchor.
 */
export function HeroGive({ tiers, donateUrl }: { tiers: DonationTier[]; donateUrl: string }) {
  const [selectedId, setSelectedId] = useState(tiers[1]?.id ?? tiers[0]?.id);
  const selected = tiers.find((t) => t.id === selectedId);
  const href = donateHref(donateUrl, { amount: selected?.amount });

  return (
    <div>
      {tiers.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Choose an amount</legend>
          <div className={cn("mt-2.5 grid gap-2", tiers.length >= 4 ? "grid-cols-4" : "grid-cols-3")}>
            {tiers.slice(0, 4).map((tier) => {
              const checked = tier.id === selectedId;
              return (
                <label
                  key={tier.id}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center justify-center rounded-full border-2 px-2 text-[1.02rem] font-semibold tabular-nums transition-colors duration-200",
                    "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-crimson",
                    checked
                      ? "border-crimson bg-crimson text-white"
                      : "border-line text-ink hover:border-ink/35",
                  )}
                >
                  <input
                    type="radio"
                    name="hero-amount"
                    value={tier.id}
                    checked={checked}
                    onChange={() => setSelectedId(tier.id)}
                    className="sr-only"
                  />
                  {tier.amount ? formatINR(tier.amount) : "Other"}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <a href={href} className={cn(buttonClasses("primary", "lg"), "mt-5 w-full")}>
        <HeartHandshake aria-hidden />
        {selected?.amount ? `Donate ${formatINR(selected.amount)}` : "Donate now"}
      </a>
    </div>
  );
}
