import type { SiteSettings } from "@/lib/cms/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Registration, PAN and 80G — what donors and CSR teams check before giving. */
export function TrustFacts({
  legal,
  tone = "light",
  className,
}: {
  legal: SiteSettings["legal"];
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  const facts = [
    { term: "Public trust registration", value: legal.registrationNo },
    { term: "PAN", value: legal.pan },
    { term: "80G registration", value: legal.eightyGNo, note: `since ${formatDate(legal.eightyGDate)}` },
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
