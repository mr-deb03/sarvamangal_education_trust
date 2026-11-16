"use client";

import { useState } from "react";

import type { DonationTier } from "@/lib/cms/types";
import { donateHref } from "@/lib/utils";

/**
 * The chosen donation amount and the link it makes. Defaults to the second
 * tier, the usual anchor. Payment happens on the donation app; the choice only
 * shapes the outgoing link.
 */
export function useTierLink(tiers: DonationTier[], donateUrl: string, { withCause = false } = {}) {
  const [selectedId, setSelectedId] = useState(tiers[1]?.id ?? tiers[0]?.id);
  const selected = tiers.find((t) => t.id === selectedId);
  const href = donateHref(donateUrl, { amount: selected?.amount, cause: withCause ? selected?.causeSlug : undefined });
  return { selectedId, setSelectedId, selected, href };
}
