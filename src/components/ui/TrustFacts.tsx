import type { SiteCopy, SiteSettings } from "@/lib/cms/types";
import { fill, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Registration, PAN and 80G — what donors and CSR teams check before giving. */
export function TrustFacts({
  legal,
  labels,
  tone = "light",
  className,
}: {
  legal: SiteSettings["legal"];
  /** Buttons & labels → Trust (the CMS). */
  labels: SiteCopy["labels"]["trust"];
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  const facts = [
    { term: labels.registration, value: legal.registrationNo },
    { term: labels.pan, value: legal.pan },
    { term: labels.eightyG, value: legal.eightyGNo, note: fill(labels.since, { date: formatDate(legal.eightyGDate) }) },
  ];
  return (
    <dl className={cn("grid gap-x-6 gap-y-4 sm:grid-cols-3", className)}>
      {facts.map((f) => (
        <div key={f.term} className={cn("border-t pt-3", dark ? "border-white/15" : "border-line")}>
          <dt className={cn("text-sm", dark ? "text-ink-200" : "text-ink-muted")}>{f.term}</dt>
          <dd className={cn("mt-1 font-semibold tracking-[0.02em] break-all", dark ? "text-white" : "text-ink")}>
            {f.value}
            {f.note ? (
              <span className={cn("block text-sm font-normal tracking-normal", dark ? "text-ink-200" : "text-ink-muted")}>
                {f.note}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
