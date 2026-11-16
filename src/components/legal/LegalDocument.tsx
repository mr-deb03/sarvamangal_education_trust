import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export type LegalSection = { id: string; title: string; content: ReactNode };

/**
 * A policy page body: the sections in order with a contents list — a sticky
 * column on desktop, a fold-out at the top on phones — so a reader can jump
 * straight to "Donations" or "Your rights".
 */
export function LegalDocument({ sections, updated }: { sections: LegalSection[]; updated: string }) {
  const contents = (
    <ol className="space-y-0.5">
      {sections.map((s, i) => (
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
      <nav aria-label="On this page" className="lg:col-span-4 xl:col-span-3">
        <details className="group rounded-2xl ring-1 ring-line lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
            On this page
            <ChevronDown aria-hidden className="size-5 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-2 pb-3">{contents}</div>
        </details>
        <div className="hidden lg:sticky lg:top-28 lg:block">
          <p className="eyebrow px-2 text-ink-muted">On this page</p>
          <div className="mt-3">{contents}</div>
        </div>
      </nav>

      <div className="min-w-0 max-w-3xl lg:col-span-8">
        <p className="text-sm text-ink-muted">Last updated: {updated}</p>
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mt-10 scroll-mt-28 first-of-type:mt-6">
            <h2 id={`${s.id}-title`} className="flex gap-3 text-2xl font-semibold sm:text-[1.75rem]">
              <span aria-hidden className="font-sans text-base leading-[2] font-semibold text-crimson tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </h2>
            <div className="prose-camp mt-4">{s.content}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
