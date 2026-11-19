"use client";

import { HeartHandshake } from "lucide-react";

import { buttonClasses } from "@/components/ui/ButtonLink";
import { Fill } from "@/components/ui/Fill";
import { Rupees } from "@/components/ui/Rupees";
import type { DonationTier } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

import { useTierLink } from "./useTierLink";

export type HeroGiveText = {
  legend: string;
  other: string;
  donateAmount: string;
  donateNow: string;
  /** Under the button: who can donate (owner's rule, Nov 2026: no NRI or foreign donations). */
  citizensOnly: string;
};

/**
 * The giving box on the hero card: amount chips and the Donate link — a
 * general gift, not tied to one cause (the Give section further down explains
 * what each amount does).
 */
export function HeroGive({ tiers, donateUrl, text }: { tiers: DonationTier[]; donateUrl: string; text: HeroGiveText }) {
  const { selectedId, setSelectedId, selected, href } = useTierLink(tiers, donateUrl);

  return (
    <div>
      {tiers.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-semibold text-ink">{text.legend}</legend>
          <div className={cn("mt-2.5 grid gap-2", tiers.length >= 4 ? "grid-cols-4" : "grid-cols-3")}>
            {tiers.slice(0, 4).map((tier) => {
              const checked = tier.id === selectedId;
              return (
                <label
                  key={tier.id}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center justify-center rounded-full border-2 px-2 text-[1.02rem] font-semibold tabular-nums transition-colors duration-200",
                    "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-crimson",
                    checked ? "border-crimson bg-crimson text-white" : "border-line text-ink hover:border-ink/35",
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
                  {tier.amount ? <Rupees amount={tier.amount} /> : text.other}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <a href={href} className={cn(buttonClasses("primary", "lg"), "mt-5 w-full")}>
        <HeartHandshake aria-hidden />
        {selected?.amount ? (
          <span>
            <Fill template={text.donateAmount} vars={{ amount: <Rupees amount={selected.amount} /> }} />
          </span>
        ) : (
          text.donateNow
        )}
      </a>
      {text.citizensOnly ? <p className="mt-2 text-center text-[0.82rem] text-ink-muted">{text.citizensOnly}</p> : null}
    </div>
  );
}
