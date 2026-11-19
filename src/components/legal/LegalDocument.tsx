import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import type { SiteCopy } from "@/lib/cms/types";
import { fill } from "@/lib/format";

import { PolicyText } from "./PolicyText";

export type LegalSection = { title: string; body: string };

/** "Donations & payments" → "donations-and-payments" (the old refund-policy URL lands on that one). */
export function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * A policy page body: the sections in order with a contents list — a sticky
 * column on desktop, a fold-out at the top on phones — so a reader can jump
 * straight to "Donations" or "Your rights". All text comes from the CMS
 * (Website text → Policies); `vars` fills its {tokens}.
 */
export function LegalDocument({
  sections,
  updated,
  labels,
  vars,
}: {
  sections: LegalSection[];
  updated: string;
  labels: SiteCopy["labels"]["policy"];
  vars: Record<string, ReactNode>;
}) {
  const items = sections.map((s) => ({ ...s, id: sectionId(s.title) }));
  const contents = (
    <ol className="space-y-0.5">
      {items.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-[0.95rem] text-ink-soft hover:bg-paper-2 hover:text-crimson lg:min-h-9"
          >
            <span className="w-5 shrink-0 text-right text-sm text-ink-muted tabular-nums">{i + 1}</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-16">
      <nav aria-label={labels.contents} className="lg:col-span-4 xl:col-span-3">
        <details className="group rounded-2xl ring-1 ring-line lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {labels.contents}
            <ChevronDown aria-hidden className="size-5 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-2 pb-3">{contents}</div>
        </details>
        <div className="hidden lg:sticky lg:top-28 lg:block">
          <p className="eyebrow px-2 text-ink-muted">{labels.contents}</p>
          <div className="mt-3">{contents}</div>
        </div>
      </nav>

      <div className="min-w-0 max-w-3xl lg:col-span-8">
        <p className="text-sm text-ink-muted">{fill(labels.updated, { date: updated })}</p>
        {items.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mt-10 scroll-mt-28 first-of-type:mt-6">
            <h2 id={`${s.id}-title`} className="flex gap-3 text-2xl font-semibold sm:text-[1.75rem]">
              <span aria-hidden className="font-sans text-base leading-[2] font-semibold text-crimson tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </h2>
            <div className="prose-camp mt-4">
              <PolicyText text={s.body} vars={vars} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
