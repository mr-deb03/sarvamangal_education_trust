import { Plus } from "lucide-react";

import { SectionIntro } from "@/components/ui/SectionIntro";
import type { Faq as FaqItem } from "@/lib/cms/types";

/** Native <details> — works without JS, and the answers stay in the HTML for search engines. */
export function Faq({ faqs, email }: { faqs: FaqItem[]; email: string }) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-title" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <SectionIntro id="faq-title" eyebrow="Questions" title="Before you give">
            What donors and volunteers ask us most. Something else on your mind?{" "}
            <a href={`mailto:${email}`} className="font-semibold text-crimson underline decoration-crimson/40 underline-offset-4 hover:decoration-crimson">
              Write to us
            </a>
            .
          </SectionIntro>
        </div>

        <div className="divide-y divide-line border-y border-line lg:col-span-8">
          {faqs.map((f, i) => (
            <details key={f.id} className="group" open={i === 0}>
              <summary className="flex min-h-11 items-start justify-between gap-6 py-5 font-display text-xl leading-snug font-semibold text-ink transition-colors hover:text-crimson sm:text-[1.35rem]">
                <span>{f.question}</span>
                <Plus
                  aria-hidden
                  className="mt-1 size-5 shrink-0 text-crimson transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-ink-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
